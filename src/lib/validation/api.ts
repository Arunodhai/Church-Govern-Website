import { createHash, randomUUID } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import type { z } from "zod";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

const MAX_JSON_BYTES = 64 * 1024;

export type ApiFailure = {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
};

export function jsonFailure(message: string, status: number, errors?: Record<string, string[]>) {
  return NextResponse.json<ApiFailure>({ success: false, message, ...(errors ? { errors } : {}) }, { status });
}

function issueMap(error: z.ZodError): Record<string, string[]> {
  const errors: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = issue.path.length ? issue.path.join(".") : "form";
    errors[key] ??= [];
    errors[key].push(issue.message);
  }
  return errors;
}

export async function parseJson<T>(request: NextRequest, schema: z.ZodType<T>) {
  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (declaredLength > MAX_JSON_BYTES) {
    return { response: jsonFailure("Request body is too large.", 413) } as const;
  }
  let raw: unknown;
  try {
    const body = await request.text();
    if (new TextEncoder().encode(body).byteLength > MAX_JSON_BYTES) {
      return { response: jsonFailure("Request body is too large.", 413) } as const;
    }
    raw = JSON.parse(body);
  } catch {
    return { response: jsonFailure("Request body must be valid JSON.", 400) } as const;
  }
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return {
      response: jsonFailure("Please check the highlighted fields.", 400, issueMap(parsed.error)),
    } as const;
  }
  return { data: parsed.data } as const;
}

export function rejectCrossSiteRequest(request: NextRequest): NextResponse<ApiFailure> | null {
  const origin = request.headers.get("origin");
  if (!origin) return null;
  const allowedOrigin = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? request.nextUrl.origin;
  if (origin !== allowedOrigin && origin !== request.nextUrl.origin) {
    return jsonFailure("This request origin is not allowed.", 403);
  }
  return null;
}

function requestIp(request: NextRequest): string {
  return (
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

export function requestFingerprint(request: NextRequest, stableToken?: string): string {
  const secret = process.env.RATE_LIMIT_SECRET ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? randomUUID();
  const subject = stableToken ?? `${requestIp(request)}|${request.headers.get("user-agent") ?? "unknown"}`;
  return createHash("sha256").update(`${secret}|${subject}`).digest("hex");
}

export async function enforceRateLimit(
  request: NextRequest,
  bucket: string,
  limit: number,
  windowSeconds: number,
) {
  const supabase = createSupabaseAdminClient();
  if (!supabase) return { configured: false, allowed: false, fingerprint: "" } as const;
  const fingerprint = requestFingerprint(request);
  const { data, error } = await supabase.rpc("consume_rate_limit", {
    p_bucket: bucket,
    p_subject_hash: fingerprint,
    p_limit: limit,
    p_window_seconds: windowSeconds,
  });
  return { configured: true, allowed: !error && data === true, fingerprint } as const;
}

export function publicWriteUnavailable() {
  return jsonFailure("Enquiries are temporarily unavailable. Please contact us directly.", 503);
}

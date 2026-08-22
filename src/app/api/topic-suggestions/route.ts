import { NextResponse, type NextRequest } from "next/server";
import { isMockOperationsMode } from "@/lib/demo-mode";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { topicSuggestionSchema } from "@/lib/validation/forms";
import {
  enforceRateLimit,
  jsonFailure,
  parseJson,
  publicWriteUnavailable,
  rejectCrossSiteRequest,
} from "@/lib/validation/api";

export async function POST(request: NextRequest) {
  const originFailure = rejectCrossSiteRequest(request);
  if (originFailure) return originFailure;
  const parsed = await parseJson(request, topicSuggestionSchema);
  if ("response" in parsed) return parsed.response;
  if (parsed.data.website) return jsonFailure("Submission rejected.", 400);
  if (isMockOperationsMode()) {
    return NextResponse.json(
      {
        success: true,
        message: "Demo mode: the suggestion passed validation and entered a simulated moderation queue. It was not stored.",
        referenceId: `demo-topic-${crypto.randomUUID().slice(0, 8)}`,
        mock: true,
      },
      { status: 201 },
    );
  }
  const rate = await enforceRateLimit(request, "topic-suggestion", 3, 3600);
  if (!rate.configured) return publicWriteUnavailable();
  if (!rate.allowed) return jsonFailure("Too many requests. Please try again later.", 429);
  const supabase = createSupabaseAdminClient();
  if (!supabase) return publicWriteUnavailable();
  const { data, error } = await supabase
    .from("topic_suggestions")
    .insert({
      name: parsed.data.name ?? null,
      email: parsed.data.email ?? null,
      topic: parsed.data.topic,
      description: parsed.data.description,
      status: "pending",
      ip_hash: rate.fingerprint,
    })
    .select("id")
    .single();
  if (error || !data) return jsonFailure("We could not save your suggestion. Please try again.", 500);
  return NextResponse.json(
    { success: true, message: "Thank you. Your topic is now awaiting editorial review.", referenceId: data.id },
    { status: 201 },
  );
}

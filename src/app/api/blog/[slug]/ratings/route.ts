import { randomUUID } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { getBlogEngagement, getPublicBlogPost, isMockContentEnabled } from "@/lib/content";
import { isMockOperationsMode } from "@/lib/demo-mode";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { requestFingerprint } from "@/lib/validation/api";
import { blogRatingSchema } from "@/lib/validation/forms";
import {
  enforceRateLimit,
  jsonFailure,
  parseJson,
  publicWriteUnavailable,
  rejectCrossSiteRequest,
} from "@/lib/validation/api";

type Context = { params: Promise<{ slug: string }> };
const VISITOR_COOKIE = "cg_rating_visitor";

async function ratingSummary(slug: string) {
  const supabase = createSupabaseAdminClient();
  if (!supabase) return { average: 0, count: 0 };
  const { data } = await supabase.rpc("get_blog_rating_summary_by_slug", { p_blog_slug: slug });
  return { average: Number(data?.[0]?.average ?? 0), count: Number(data?.[0]?.rating_count ?? 0) };
}

export async function GET(_request: NextRequest, context: Context) {
  const { slug } = await context.params;
  if (!(await getPublicBlogPost(slug))) return jsonFailure("Blog post not found.", 404);
  if (isMockContentEnabled && isMockOperationsMode()) return NextResponse.json((await getBlogEngagement(slug)).rating);
  return NextResponse.json(await ratingSummary(slug));
}

export async function POST(request: NextRequest, context: Context) {
  const originFailure = rejectCrossSiteRequest(request);
  if (originFailure) return originFailure;
  const parsed = await parseJson(request, blogRatingSchema);
  if ("response" in parsed) return parsed.response;
  const { slug } = await context.params;
  if (!(await getPublicBlogPost(slug))) return jsonFailure("Blog post not found.", 404);
  if (isMockOperationsMode()) {
    return NextResponse.json({ success: true, average: parsed.data.rating, count: 13, mock: true });
  }
  const rate = await enforceRateLimit(request, "blog-rating", 20, 3600);
  if (!rate.configured) return publicWriteUnavailable();
  if (!rate.allowed) return jsonFailure("Too many ratings. Please try again later.", 429);
  const visitorToken = request.cookies.get(VISITOR_COOKIE)?.value ?? randomUUID();
  const fingerprint = requestFingerprint(request, visitorToken);
  const supabase = createSupabaseAdminClient();
  if (!supabase) return publicWriteUnavailable();
  const { error } = await supabase
    .from("blog_ratings")
    .upsert(
      { post_id: null, blog_slug: slug, rating: parsed.data.rating, fingerprint_hash: fingerprint },
      { onConflict: "blog_slug,fingerprint_hash" },
    );
  if (error) return jsonFailure("We could not save your rating. Please try again.", 500);
  const response = NextResponse.json({ success: true, ...(await ratingSummary(slug)) });
  if (!request.cookies.has(VISITOR_COOKIE)) {
    response.cookies.set(VISITOR_COOKIE, visitorToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  }
  return response;
}

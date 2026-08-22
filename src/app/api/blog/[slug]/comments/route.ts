import { NextResponse, type NextRequest } from "next/server";
import { getBlogEngagement, getPublicBlogPost, isMockContentEnabled } from "@/lib/content";
import { isMockOperationsMode } from "@/lib/demo-mode";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { blogCommentSchema } from "@/lib/validation/forms";
import {
  enforceRateLimit,
  jsonFailure,
  parseJson,
  publicWriteUnavailable,
  rejectCrossSiteRequest,
} from "@/lib/validation/api";

type Context = { params: Promise<{ slug: string }> };

export async function GET(_request: NextRequest, context: Context) {
  const { slug } = await context.params;
  if (isMockContentEnabled && isMockOperationsMode()) {
    if (!(await getPublicBlogPost(slug))) return jsonFailure("Blog post not found.", 404);
    return NextResponse.json({ comments: (await getBlogEngagement(slug)).comments });
  }
  const [post, supabase] = await Promise.all([getPublicBlogPost(slug), Promise.resolve(createSupabaseAdminClient())]);
  if (!post) return jsonFailure("Blog post not found.", 404);
  if (!supabase) return NextResponse.json({ comments: [] });
  const { data, error } = await supabase.rpc("get_approved_blog_comments_by_slug", { p_blog_slug: slug });
  if (error) return jsonFailure("Comments are temporarily unavailable.", 503);
  return NextResponse.json({ comments: data ?? [] });
}

export async function POST(request: NextRequest, context: Context) {
  const originFailure = rejectCrossSiteRequest(request);
  if (originFailure) return originFailure;
  const parsed = await parseJson(request, blogCommentSchema);
  if ("response" in parsed) return parsed.response;
  if (parsed.data.website) return jsonFailure("Submission rejected.", 400);
  const { slug } = await context.params;
  if (!(await getPublicBlogPost(slug))) return jsonFailure("Blog post not found.", 404);
  if (isMockOperationsMode()) {
    return NextResponse.json(
      { success: true, message: "Mock mode: the comment form works, but this submission was not stored.", referenceId: `mock-${crypto.randomUUID()}` },
      { status: 201 },
    );
  }
  const rate = await enforceRateLimit(request, "blog-comment", 5, 3600);
  if (!rate.configured) return publicWriteUnavailable();
  if (!rate.allowed) return jsonFailure("Too many comments. Please try again later.", 429);
  const supabase = createSupabaseAdminClient();
  if (!supabase) return publicWriteUnavailable();
  const { data, error } = await supabase
    .from("blog_comments")
    .insert({
      post_id: null,
      blog_slug: slug,
      name: parsed.data.name,
      email: parsed.data.email,
      body: parsed.data.body,
      status: "pending",
      ip_hash: rate.fingerprint,
      user_agent: request.headers.get("user-agent")?.slice(0, 500) ?? null,
    })
    .select("id")
    .single();
  if (error || !data) return jsonFailure("We could not save your comment. Please try again.", 500);
  return NextResponse.json(
    { success: true, message: "Your comment is awaiting moderation.", referenceId: data.id },
    { status: 201 },
  );
}

import { NextResponse, type NextRequest } from "next/server";
import { getAdminContext } from "@/lib/supabase/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { leadWorkflowUpdateSchema, moderationWorkflowUpdateSchema } from "@/lib/validation/admin";
import { jsonFailure, parseJson } from "@/lib/validation/api";
import { getCollection } from "@/app/admin/collections";

type Context = { params: Promise<{ collection: string; id: string }> };

async function contextFor(params: Context["params"]) {
  const values = await params;
  const config = getCollection(values.collection);
  const admin = await getAdminContext();
  if (!config || !admin || !config.roles.includes(admin.profile.role)) return null;
  return { ...values, config, admin };
}

export async function PATCH(request: NextRequest, routeContext: Context) {
  const context = await contextFor(routeContext.params);
  if (!context) return jsonFailure("Not authorized.", 403);
  if (context.admin.mode === "demo") return jsonFailure("Changes are disabled in demo mode.", 503);
  const isModeration = context.collection === "comments" || context.collection === "topic-suggestions";
  const isLead = ["demo-leads", "digitization-leads", "inquiries"].includes(context.collection);
  if (!isModeration && !isLead) return jsonFailure("This collection is read-only.", 405);
  let parsedData: unknown;
  if (isModeration) {
    const parsed = await parseJson(request, moderationWorkflowUpdateSchema);
    if ("response" in parsed) return parsed.response;
    parsedData = parsed.data;
  } else {
    const parsed = await parseJson(request, leadWorkflowUpdateSchema);
    if ("response" in parsed) return parsed.response;
    parsedData = parsed.data;
  }
  const supabase = await createSupabaseServerClient();
  if (!supabase) return jsonFailure("Administration is unavailable.", 503);
  let error: { message: string } | null = null;
  switch (context.collection) {
    case "demo-leads": ({ error } = await supabase.from("demo_requests").update(leadWorkflowUpdateSchema.parse(parsedData)).eq("id", context.id)); break;
    case "digitization-leads": ({ error } = await supabase.from("digitization_requests").update(leadWorkflowUpdateSchema.parse(parsedData)).eq("id", context.id)); break;
    case "inquiries": ({ error } = await supabase.from("general_inquiries").update(leadWorkflowUpdateSchema.parse(parsedData)).eq("id", context.id)); break;
    case "comments": ({ error } = await supabase.from("blog_comments").update({ ...moderationWorkflowUpdateSchema.parse(parsedData), moderated_by: context.admin.userId, moderated_at: new Date().toISOString() }).eq("id", context.id)); break;
    case "topic-suggestions": ({ error } = await supabase.from("topic_suggestions").update(moderationWorkflowUpdateSchema.parse(parsedData)).eq("id", context.id)); break;
  }
  if (error) return jsonFailure("The record could not be updated.", 400);
  return NextResponse.json({ success: true });
}

export async function DELETE(_request: NextRequest, routeContext: Context) {
  const context = await contextFor(routeContext.params);
  if (!context) return jsonFailure("Not authorized.", 403);
  return jsonFailure("Operational records follow retention workflows and cannot be deleted here.", 405);
}

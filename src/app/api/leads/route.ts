import { NextResponse, type NextRequest } from "next/server";
import { sendLeadNotification } from "@/lib/email/lead-notification";
import { isMockOperationsMode } from "@/lib/demo-mode";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { leadRequestSchema } from "@/lib/validation/forms";
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
  const parsed = await parseJson(request, leadRequestSchema);
  if ("response" in parsed) return parsed.response;
  if (parsed.data.website) return jsonFailure("Submission rejected.", 400);

  if (isMockOperationsMode()) {
    return NextResponse.json(
      {
        success: true,
        message: "Demo mode: the complete enquiry flow was validated, but no personal data was stored or emailed.",
        referenceId: `demo-${parsed.data.type}-${crypto.randomUUID().slice(0, 8)}`,
        mock: true,
      },
      { status: 201 },
    );
  }

  const rate = await enforceRateLimit(request, `lead:${parsed.data.type}`, 5, 3600);
  if (!rate.configured) return publicWriteUnavailable();
  if (!rate.allowed) return jsonFailure("Too many requests. Please try again later.", 429);
  const supabase = createSupabaseAdminClient();
  if (!supabase) return publicWriteUnavailable();

  let result: { data: { id: string } | null; error: { message: string } | null };
  if (parsed.data.type === "demo") {
    result = await supabase
      .from("demo_requests")
      .insert({
        church_name: parsed.data.churchName,
        denomination: parsed.data.denomination,
        contact_person: parsed.data.contactPerson,
        email: parsed.data.email,
        phone: parsed.data.phone,
        country: parsed.data.country,
        state: parsed.data.state,
        district: parsed.data.district,
        city: parsed.data.city,
        pincode: parsed.data.pincode,
        consent: true,
        status: "new",
        source: parsed.data.source ?? null,
        utm: parsed.data.utm ?? {},
        ip_hash: rate.fingerprint,
      })
      .select("id")
      .single();
  } else if (parsed.data.type === "digitization") {
    result = await supabase
      .from("digitization_requests")
      .insert({
        church_name: parsed.data.churchName,
        contact_person: parsed.data.contactPerson,
        email: parsed.data.email,
        phone: parsed.data.phone,
        record_type: parsed.data.recordType,
        approximate_pages: parsed.data.approximatePages ?? null,
        page_sizes: parsed.data.pageSizes,
        state: parsed.data.state,
        district: parsed.data.district,
        location: parsed.data.location,
        pincode: parsed.data.pincode,
        comments: parsed.data.comments ?? null,
        consent: true,
        status: "new",
        source: parsed.data.source ?? null,
        utm: parsed.data.utm ?? {},
        ip_hash: rate.fingerprint,
      })
      .select("id")
      .single();
  } else {
    result = await supabase
      .from("general_inquiries")
      .insert({
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone ?? null,
        subject: parsed.data.subject,
        message: parsed.data.message,
        consent: true,
        status: "new",
        source: parsed.data.source ?? null,
        ip_hash: rate.fingerprint,
      })
      .select("id")
      .single();
  }

  if (result.error || !result.data) {
    console.error("Lead submission failed", result.error?.message);
    return jsonFailure("We could not save your request. Please try again.", 500);
  }
  const notification = await sendLeadNotification(result.data.id, parsed.data);
  return NextResponse.json(
    {
      success: true,
      message: "Thank you. Our team will contact you soon.",
      referenceId: result.data.id,
      notificationStatus: notification.status,
    },
    { status: 201 },
  );
}

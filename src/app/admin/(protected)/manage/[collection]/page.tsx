import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCollection } from "../../../collections";
import { ManagementWorkspace, type AdminRow } from "./workspace";
import { DemoAnalyticsWorkspace } from "@/components/admin/demo-analytics-workspace";

const demoRowsByCollection: Record<string, AdminRow[]> = {
  "demo-leads": [
    { id: "demo-lead-1", title: "St. Mark Sample Parish (demo)", subtitle: "Anita Demo · anita.demo@example.com", status: "new", values: { church_name: "St. Mark Sample Parish (demo)", denomination: "Denomination-neutral sample", contact_person: "Anita Demo", email: "anita.demo@example.com", phone: "+91 90000 00001", country: "India", state: "Kerala", district: "Ernakulam", city: "Kochi", pincode: "682000", created_at: "2026-08-21T09:15:00.000Z" } },
    { id: "demo-lead-2", title: "Grace Community Demo Church", subtitle: "Joseph Sample · joseph.sample@example.com", status: "contacted", values: { church_name: "Grace Community Demo Church", denomination: "Community church sample", contact_person: "Joseph Sample", email: "joseph.sample@example.com", phone: "+91 90000 00002", country: "India", state: "Tamil Nadu", district: "Coimbatore", city: "Coimbatore", pincode: "641000", internal_notes: "Demo note: discovery call requested.", created_at: "2026-08-20T14:30:00.000Z" } },
    { id: "demo-lead-3", title: "Holy Family Example Parish", subtitle: "Maria Demo · maria.demo@example.com", status: "qualified", values: { church_name: "Holy Family Example Parish", denomination: "Parish sample", contact_person: "Maria Demo", email: "maria.demo@example.com", phone: "+91 90000 00003", country: "India", state: "Karnataka", district: "Bengaluru Urban", city: "Bengaluru", pincode: "560000", internal_notes: "Demo note: interested in records and member services.", created_at: "2026-08-19T11:00:00.000Z" } },
  ],
  "digitization-leads": [
    { id: "demo-digitization-1", title: "Heritage Parish Archive (demo)", subtitle: "Thomas Sample · thomas.sample@example.com", status: "new", values: { church_name: "Heritage Parish Archive (demo)", contact_person: "Thomas Sample", email: "thomas.sample@example.com", phone: "+91 90000 00004", record_type: "both", approximate_pages: 18000, page_sizes: ["A4", "Register / bound book", "Mixed / unsure"], state: "Kerala", district: "Kottayam", location: "Parish archive room (sample)", pincode: "686000", comments: "Demo enquiry for fragile registers spanning several decades.", created_at: "2026-08-21T08:40:00.000Z" } },
    { id: "demo-digitization-2", title: "St. Anne Records Project (demo)", subtitle: "Samuel Demo · samuel.demo@example.com", status: "contacted", values: { church_name: "St. Anne Records Project (demo)", contact_person: "Samuel Demo", email: "samuel.demo@example.com", phone: "+91 90000 00005", record_type: "old", approximate_pages: 6400, page_sizes: ["Register / bound book"], state: "Kerala", district: "Thrissur", location: "Sample records office", pincode: "680000", comments: "Demo assessment requested for historic registers.", created_at: "2026-08-18T12:10:00.000Z" } },
  ],
  inquiries: [
    { id: "demo-inquiry-1", title: "Implementation timeline question (demo)", subtitle: "Reena Sample · reena.sample@example.com", status: "new", values: { name: "Reena Sample", email: "reena.sample@example.com", phone: "+91 90000 00006", subject: "Implementation timeline question (demo)", message: "How would a phased rollout work for a sample parish?", created_at: "2026-08-20T10:25:00.000Z" } },
    { id: "demo-inquiry-2", title: "Security review request (demo)", subtitle: "Paul Demo · paul.demo@example.com", status: "contacted", values: { name: "Paul Demo", email: "paul.demo@example.com", subject: "Security review request (demo)", message: "Please share the proposed security discovery topics for review.", created_at: "2026-08-17T09:45:00.000Z" } },
  ],
  comments: [
    { id: "demo-comment-1", title: "Sample reader (demo)", subtitle: "A useful overview of record planning. This is a mock comment awaiting moderation.", status: "pending", values: { name: "Sample reader (demo)", email: "reader.demo@example.com", blog_slug: "building-a-responsible-digitization-plan", body: "A useful overview of record planning. This is a mock comment awaiting moderation.", created_at: "2026-08-21T13:00:00.000Z" } },
    { id: "demo-comment-2", title: "Parish volunteer (demo)", subtitle: "The phased approach would help our sample team prepare.", status: "approved", values: { name: "Parish volunteer (demo)", email: "volunteer.demo@example.com", blog_slug: "less-administration-more-ministry", body: "The phased approach would help our sample team prepare.", created_at: "2026-08-19T15:20:00.000Z" } },
    { id: "demo-comment-3", title: "Anonymous sample", subtitle: "Promotional sample content for moderation testing.", status: "spam", values: { name: "Anonymous sample", email: "spam.demo@example.com", blog_slug: "a-healthier-member-record", body: "Promotional sample content for moderation testing.", created_at: "2026-08-18T07:30:00.000Z" } },
  ],
  "topic-suggestions": [
    { id: "demo-topic-1", title: "Preparing volunteers for digital change (demo)", subtitle: "A practical checklist for training, support and feedback during phased adoption.", status: "pending", values: { name: "Office team sample", email: "office.demo@example.com", topic: "Preparing volunteers for digital change (demo)", description: "A practical checklist for training, support and feedback during phased adoption.", created_at: "2026-08-21T08:00:00.000Z" } },
    { id: "demo-topic-2", title: "Caring for fragile parish registers (demo)", subtitle: "Explain condition assessment before digitization begins.", status: "approved", values: { name: "Archive volunteer sample", email: "archive.demo@example.com", topic: "Caring for fragile parish registers (demo)", description: "Explain condition assessment before digitization begins.", created_at: "2026-08-16T12:00:00.000Z" } },
  ],
  analytics: [],
  audit: [
    { id: "demo-audit-1", title: "update demo_request", subtitle: "demo-lead-2 · 21 Aug 2026, 14:32", status: "recorded", values: { action: "update", entity_type: "demo_request", entity_id: "demo-lead-2", actor: "Demo administrator", created_at: "2026-08-21T14:32:00.000Z" } },
    { id: "demo-audit-2", title: "approve blog_comment", subtitle: "demo-comment-2 · 20 Aug 2026, 10:18", status: "recorded", values: { action: "approve", entity_type: "blog_comment", entity_id: "demo-comment-2", actor: "Demo moderator", created_at: "2026-08-20T10:18:00.000Z" } },
  ],
};

async function loadRows(collection: string): Promise<AdminRow[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return demoRowsByCollection[collection] ?? [];
  switch (collection) {
    case "demo-leads": { const { data } = await supabase.from("demo_requests").select("*").order("created_at", { ascending:false }); return (data ?? []).map((row) => ({ id:row.id,title:row.church_name,subtitle:`${row.contact_person} · ${row.email}`,status:row.status,values:row })); }
    case "digitization-leads": { const { data } = await supabase.from("digitization_requests").select("*").order("created_at", { ascending:false }); return (data ?? []).map((row) => ({ id:row.id,title:row.church_name,subtitle:`${row.contact_person} · ${row.email}`,status:row.status,values:row })); }
    case "inquiries": { const { data } = await supabase.from("general_inquiries").select("*").order("created_at", { ascending:false }); return (data ?? []).map((row) => ({ id:row.id,title:row.subject,subtitle:`${row.name} · ${row.email}`,status:row.status,values:row })); }
    case "comments": { const { data } = await supabase.from("blog_comments").select("*").order("created_at", { ascending:false }); return (data ?? []).map((row) => ({ id:row.id,title:row.name,subtitle:row.body,status:row.status,values:row })); }
    case "topic-suggestions": { const { data } = await supabase.from("topic_suggestions").select("*").order("created_at", { ascending:false }); return (data ?? []).map((row) => ({ id:row.id,title:row.topic,subtitle:row.description,status:row.status,values:row })); }
    case "analytics": { const { data } = await supabase.from("analytics_rollups").select("day,metric,dimension,value,source,updated_at").order("day", { ascending:false }).limit(100); return (data ?? []).map((row) => ({ id:`${row.day}-${row.metric}-${row.dimension}-${row.source}`,title:row.metric,subtitle:`${row.day} · ${row.dimension}`,status:String(row.value),values:row })); }
    case "audit": { const { data } = await supabase.from("audit_events").select("id,action,entity_type,entity_id,created_at").order("created_at", { ascending:false }).limit(100); return (data ?? []).map((row) => ({ id:String(row.id),title:`${row.action} ${row.entity_type}`,subtitle:row.entity_id??row.created_at,status:"recorded",values:row })); }
    default: return [];
  }
}

export default async function CollectionPage({ params }: { params: Promise<{ collection: string }> }) {
  const { collection: key } = await params;
  const config = getCollection(key);
  if (!config) notFound();
  const admin = await requireAdmin();
  if (!config.roles.includes(admin.profile.role)) notFound();
  const rows = admin.mode === "demo" ? demoRowsByCollection[key] ?? [] : await loadRows(key);
  const workflowStatuses = config.kind === "lead" ? ["new","contacted","qualified","closed","spam"]
    : key === "comments" || key === "topic-suggestions" ? ["pending","approved","rejected","spam"] : undefined;

  return (
    <div className="mx-auto max-w-7xl">
      <Link href="/admin" className="text-sm font-semibold text-emerald-800">← Dashboard</Link>
      <p className="mt-7 text-xs font-bold uppercase tracking-[0.18em] text-emerald-800">{config.kind} workspace</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{config.label}</h1>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{config.description}. Access is restricted to approved roles and material changes are captured in the audit trail.</p>
      {admin.mode === "demo" && key === "analytics" ? <DemoAnalyticsWorkspace /> : <ManagementWorkspace
        collection={key}
        rows={rows}
        fields={[]}
        demo={admin.mode === "demo"}
        workflowStatuses={workflowStatuses}
        canCreate={false}
        canDelete={false}
        dedicatedEditor={false}
      />}
    </div>
  );
}

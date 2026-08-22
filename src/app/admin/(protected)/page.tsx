import Link from "next/link";
import { ArrowRight, CircleAlert, FileText, MessageSquareText, UsersRound } from "lucide-react";
import { requireAdmin } from "@/lib/supabase/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { adminCollections } from "../collections";

const demoCounts: Record<string, number> = {
  "demo-leads": 8,
  "digitization-leads": 4,
  inquiries: 3,
  comments: 6,
  "topic-suggestions": 2,
};

async function liveCounts() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return demoCounts;
  const [demos, digitization, inquiries, comments, topics] = await Promise.all([
    supabase.from("demo_requests").select("id", { count: "exact", head: true }),
    supabase.from("digitization_requests").select("id", { count: "exact", head: true }),
    supabase.from("general_inquiries").select("id", { count: "exact", head: true }),
    supabase.from("blog_comments").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("topic_suggestions").select("id", { count: "exact", head: true }).eq("status", "pending"),
  ]);
  return {
    "demo-leads": demos.count ?? 0,
    "digitization-leads": digitization.count ?? 0,
    inquiries: inquiries.count ?? 0,
    comments: comments.count ?? 0,
    "topic-suggestions": topics.count ?? 0,
  };
}

export default async function AdminDashboard() {
  const admin = await requireAdmin();
  const counts = admin.mode === "demo" ? demoCounts : await liveCounts();
  const visible = adminCollections.filter((collection) => collection.roles.includes(admin.profile.role));
  const pending = (counts.comments ?? 0) + (counts["topic-suggestions"] ?? 0);
  const leads = (counts["demo-leads"] ?? 0) + (counts["digitization-leads"] ?? 0) + (counts.inquiries ?? 0);
  const metrics = [
    { label: "Content workspace", value: "Sanity", icon: FileText, href: "/studio" },
    { label: "Total enquiries", value: leads, icon: UsersRound, href: "/admin/manage/demo-leads" },
    { label: "Awaiting moderation", value: pending, icon: MessageSquareText, href: "/admin/manage/comments" },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <header className="flex flex-col gap-5 border-b border-slate-200 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-800">Operations overview</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Good to see you, {admin.profile.display_name.split(" ")[0]}.</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">A focused view of enquiries, community activity, and website performance that needs attention.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/studio" className="rounded-xl bg-emerald-900 px-4 py-2.5 text-sm font-semibold text-white">Open Sanity Studio</Link>
        </div>
      </header>

      {admin.mode === "demo" && <section className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-6 text-amber-950" role="status"><strong>Development demo operations</strong><span className="ml-2">All people, churches, counts and activity below are clearly labelled sample data. Workflow changes stay on this screen and are never sent or stored.</span></section>}

      <section className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Key metrics">
        {metrics.map(({ label, value, icon: Icon, href }) => (
          <Link key={label} href={href} className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-emerald-300 hover:shadow-sm">
            <div className="flex items-start justify-between gap-3"><Icon className="text-emerald-800" size={20} /><span className="text-2xl font-semibold">{value}</span></div>
            <p className="mt-5 text-sm font-medium text-slate-600">{label}</p>
          </Link>
        ))}
      </section>

      {pending > 0 && <section className="mt-7 flex flex-col gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3"><CircleAlert className="mt-0.5 shrink-0 text-amber-700" size={20} /><div><h2 className="font-semibold">Community review queue</h2><p className="mt-1 text-sm text-amber-900/75">{pending} comment or topic submission{pending === 1 ? "" : "s"} await a moderation decision.</p></div></div>
        <Link href="/admin/manage/comments" className="inline-flex items-center gap-2 text-sm font-semibold text-amber-900">Review queue <ArrowRight size={16} /></Link>
      </section>}

      <div className="mt-10 flex items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Workspaces</p><h2 className="mt-1 text-xl font-semibold">Manage operations</h2></div></div>
      <section className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {visible.map((collection) => (
          <Link key={collection.key} href={`/admin/manage/${collection.key}`} className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-emerald-300 hover:shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold">{collection.label}</h3>
                <p className="mt-1.5 text-sm leading-5 text-slate-600">{collection.description}</p>
              </div>
              {counts[collection.key] !== undefined && <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-sm font-bold">{counts[collection.key]}</span>}
            </div>
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-800">Open <ArrowRight size={15} /></span>
          </Link>
        ))}
      </section>
    </div>
  );
}

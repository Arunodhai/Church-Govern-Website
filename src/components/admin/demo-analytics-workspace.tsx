import { BarChart3, FileText, Search, UsersRound } from "lucide-react";

const metrics = [
  { label: "Page views", value: "12,480", change: "+18%", icon: BarChart3 },
  { label: "Lead enquiries", value: "47", change: "+9%", icon: UsersRound },
  { label: "Blog reads", value: "3,920", change: "+24%", icon: FileText },
  { label: "Blog searches", value: "1,180", change: "+12%", icon: Search },
];

const pages = [
  ["Home", "4,820", 100],
  ["Product", "2,760", 57],
  ["Insights", "2,140", 44],
  ["Digitization article", "1,320", 27],
  ["Contact", "980", 20],
] as const;

const searches = [
  ["digitization", "286"],
  ["member records", "214"],
  ["church finance", "168"],
  ["privacy", "141"],
  ["certificates", "96"],
] as const;

export function DemoAnalyticsWorkspace() {
  return <div className="mt-7 space-y-6">
    <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-6 text-amber-950" role="status"><strong>Illustrative analytics</strong><span className="ml-2">These values demonstrate the proposed reporting experience. They are not measurements from a live Church Govern website.</span></div>
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Demo analytics summary">
      {metrics.map(({ label, value, change, icon: Icon }) => <article key={label} className="rounded-2xl border border-slate-200 bg-white p-5"><div className="flex items-center justify-between"><Icon className="text-emerald-800" size={20} /><span className="text-xs font-bold text-emerald-700">{change}</span></div><strong className="mt-6 block text-3xl font-semibold tracking-tight">{value}</strong><span className="mt-1 block text-sm text-slate-600">{label} · last 30 days</span></article>)}
    </section>
    <section className="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(300px,.75fr)]">
      <article className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-800">Content performance</p><h2 className="mt-2 text-lg font-semibold">Top pages</h2></div><ol className="mt-6 space-y-5">{pages.map(([label, value, width]) => <li key={label}><div className="mb-2 flex items-center justify-between gap-3 text-sm"><span className="font-medium text-slate-800">{label}</span><strong>{value}</strong></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><span className="block h-full rounded-full bg-emerald-800" style={{ width: `${width}%` }} /></div></li>)}</ol></article>
      <article className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"><p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-800">Search intent</p><h2 className="mt-2 text-lg font-semibold">Top blog searches</h2><ol className="mt-5 divide-y divide-slate-100">{searches.map(([term, value], index) => <li key={term} className="flex items-center gap-3 py-3"><span className="text-xs font-bold text-slate-400">0{index + 1}</span><span className="min-w-0 flex-1 text-sm font-medium">{term}</span><strong className="text-sm">{value}</strong></li>)}</ol></article>
    </section>
    <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"><p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-800">Conversion overview</p><h2 className="mt-2 text-lg font-semibold">Enquiry outcomes</h2><div className="mt-5 grid gap-3 sm:grid-cols-3"><div className="rounded-xl bg-slate-50 p-4"><strong className="text-2xl">28</strong><span className="mt-1 block text-sm text-slate-600">Demo requests</span></div><div className="rounded-xl bg-slate-50 p-4"><strong className="text-2xl">12</strong><span className="mt-1 block text-sm text-slate-600">Digitization enquiries</span></div><div className="rounded-xl bg-slate-50 p-4"><strong className="text-2xl">7</strong><span className="mt-1 block text-sm text-slate-600">General enquiries</span></div></div></section>
  </div>;
}

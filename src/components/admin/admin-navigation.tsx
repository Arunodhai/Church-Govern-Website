"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  BarChart3,
  BookOpenText,
  ChevronDown,
  CircleHelp,
  FileText,
  ExternalLink,
  Images,
  LayoutDashboard,
  Menu,
  MessageSquareText,
  Network,
  PackageOpen,
  Quote,
  ScrollText,
  UsersRound,
  X,
} from "lucide-react";
import type { CollectionConfig } from "@/app/admin/collections";

const icons = {
  pages: FileText,
  modules: PackageOpen,
  blogs: BookOpenText,
  faqs: CircleHelp,
  testimonials: Quote,
  navigation: Network,
  media: Images,
  "demo-leads": UsersRound,
  "digitization-leads": ScrollText,
  inquiries: MessageSquareText,
  comments: MessageSquareText,
  "topic-suggestions": BookOpenText,
  analytics: BarChart3,
  audit: ScrollText,
} as const;

const groupLabels = {
  content: "Content",
  engagement: "Community",
  lead: "Enquiries",
  insight: "Insights",
} as const;

export function AdminNavigation({ collections }: { collections: CollectionConfig[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const groups = Object.entries(groupLabels).map(([kind, label]) => ({
    kind,
    label,
    items: collections.filter((item) => item.kind === kind),
  })).filter((group) => group.items.length > 0);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-3 py-2 text-sm font-semibold text-white lg:hidden"
        aria-expanded={open}
        aria-controls="admin-navigation"
      >
        {open ? <X size={18} /> : <Menu size={18} />} {open ? "Close menu" : "Menu"}
      </button>
      <nav id="admin-navigation" className={`${open ? "mt-5 block" : "hidden"} lg:mt-8 lg:block`} aria-label="Administration">
        <Link
          href="/admin"
          onClick={() => setOpen(false)}
          className={`mb-5 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${pathname === "/admin" ? "bg-emerald-400 text-slate-950" : "text-slate-300 hover:bg-white/10 hover:text-white"}`}
        >
          <LayoutDashboard size={18} /> Overview
        </Link>
        <Link
          href="/studio"
          onClick={() => setOpen(false)}
          className="mb-5 flex items-center gap-3 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-3 py-2.5 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-400/20 hover:text-white"
        >
          <ExternalLink size={18} /> Sanity Studio
        </Link>
        <div className="space-y-5">
          {groups.map((group) => (
            <section key={group.kind}>
              <div className="mb-2 flex items-center gap-2 px-3 text-[0.67rem] font-bold uppercase tracking-[0.18em] text-slate-400">
                {group.label}<ChevronDown size={13} aria-hidden="true" />
              </div>
              <div className="space-y-1">
                {group.items.map((collection) => {
                  const Icon = icons[collection.key as keyof typeof icons] ?? FileText;
                  const href = `/admin/manage/${collection.key}`;
                  const active = pathname === href || pathname.startsWith(`${href}/`);
                  return (
                    <Link
                      key={collection.key}
                      href={href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${active ? "admin-nav-active bg-emerald-50 font-semibold text-slate-950 shadow-sm" : "text-slate-300 hover:bg-white/10 hover:text-white"}`}
                    >
                      <Icon size={17} aria-hidden="true" />
                      <span className="truncate">{collection.label}</span>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </nav>
    </>
  );
}

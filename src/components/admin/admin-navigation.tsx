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
        className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/20 px-3 py-2 text-sm font-semibold text-white lg:hidden"
        aria-expanded={open}
        aria-controls="admin-navigation"
      >
        {open ? <X size={18} /> : <Menu size={18} />} {open ? "Close menu" : "Menu"}
      </button>
      <nav id="admin-navigation" className={`${open ? "mt-5 block" : "hidden"} lg:mt-8 lg:block`} aria-label="Administration">
        <Link
          href="/admin"
          onClick={() => setOpen(false)}
          className={`mb-3 flex min-h-11 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${pathname === "/admin" ? "bg-[#dff43b] text-[#101112]" : "text-slate-300 hover:bg-white/10 hover:text-white"}`}
        >
          <LayoutDashboard size={18} /> Overview
        </Link>
        <Link
          href="/studio"
          onClick={() => setOpen(false)}
          className="mb-6 flex min-h-11 items-center gap-3 rounded-lg border border-[#58c8b0]/50 bg-[#58c8b0]/15 px-3 py-2.5 text-sm font-semibold text-[#bceee3] transition hover:bg-[#58c8b0]/25 hover:text-white"
        >
          <ExternalLink size={18} /> Sanity Studio
        </Link>
        <div className="space-y-5">
          {groups.map((group) => (
            <section key={group.kind}>
              <div className="mb-1.5 flex items-center gap-2 px-3 text-[0.66rem] font-bold uppercase tracking-[0.14em] text-slate-400">
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
                      className={`flex min-h-11 items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${active ? "admin-nav-active bg-[#dff43b] font-semibold text-[#101112]" : "text-slate-300 hover:bg-white/10 hover:text-white"}`}
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

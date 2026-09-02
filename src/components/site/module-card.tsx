import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SiteIcon } from "./site-icon";

type ModuleSummary = { slug: string; name: string; suite: string; summary: string; icon?: string | null };

const moduleIcons: Record<string, string> = {
  "church-dashboard": "layout", "family-management": "users", "church-administration": "church",
  "record-management": "archive", "request-certificate-processing": "fileCheck", "finance-management": "wallet",
  communication: "message", "asset-management": "building", "cemetery-management": "landmark", reports: "chart",
  "member-dashboard": "layout", "family-profile": "users", "request-submission": "send", "subscription-history": "file",
  notifications: "bell", "church-directory": "book", "profile-management": "user",
};

export function ModuleCard({ module }: { module: ModuleSummary }) {
  return (
    <article className="module-card">
      <div className="icon-box"><SiteIcon name={module.icon || moduleIcons[module.slug] || "layout"} /></div>
      <p className="module-card__suite">{module.suite}</p>
      <h3>{module.name}</h3>
      <p>{module.summary}</p>
      <Link href={`/product/${module.slug}`} aria-label={`Explore ${module.name} module`}>Explore module <ArrowUpRight aria-hidden="true" size={18} /></Link>
    </article>
  );
}

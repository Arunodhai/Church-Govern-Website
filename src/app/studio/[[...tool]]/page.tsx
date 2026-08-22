import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { sanityEnv } from "@/sanity/env";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: sanityEnv.isConfigured ? "Open Church Govern Studio" : "Configure Sanity | Church Govern" },
  robots: { index: false, follow: false },
};

export default function StudioPage() {
  if (sanityEnv.isConfigured && sanityEnv.studioUrl.startsWith("https://")) {
    redirect(sanityEnv.studioUrl);
  }

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "2rem", background: "#f5f5f2", color: "#0f172a", fontFamily: "system-ui, sans-serif" }}>
      <section style={{ width: "min(100%, 42rem)", border: "1px solid #cbd5e1", borderRadius: "1rem", background: "white", padding: "clamp(1.5rem, 5vw, 3rem)", boxShadow: "0 24px 60px rgba(15, 23, 42, 0.08)" }}>
        <p style={{ margin: "0 0 0.75rem", color: "#047857", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase" }}>Church Govern CMS</p>
        <h1 style={{ margin: 0, fontSize: "clamp(1.75rem, 5vw, 2.5rem)", lineHeight: 1.15 }}>{sanityEnv.isConfigured ? "Studio URL required" : "Sanity configuration required"}</h1>
        <p style={{ margin: "1rem 0 0", color: "#475569", lineHeight: 1.7 }}>Sanity Studio is deployed separately through Sanity so its editor authentication and bundle stay independent of the Hostinger website. Configure the project and hosted Studio URL, then restart the application.</p>
        <dl style={{ margin: "1.5rem 0 0", display: "grid", gap: "0.75rem" }}>
          <div><dt style={{ fontWeight: 700 }}>Project</dt><dd style={{ margin: "0.25rem 0 0" }}><code>NEXT_PUBLIC_SANITY_PROJECT_ID</code></dd></div>
          <div><dt style={{ fontWeight: 700 }}>Dataset</dt><dd style={{ margin: "0.25rem 0 0" }}><code>NEXT_PUBLIC_SANITY_DATASET</code></dd></div>
          <div><dt style={{ fontWeight: 700 }}>Hosted Studio</dt><dd style={{ margin: "0.25rem 0 0" }}><code>NEXT_PUBLIC_SANITY_STUDIO_URL</code></dd></div>
        </dl>
        <p style={{ margin: "1.5rem 0 0", color: "#64748b", fontSize: "0.875rem", lineHeight: 1.6 }}>For local schema work, run <code>npm run sanity:dev</code>. Authentication and editor access are managed by Sanity. Never place a write token in a <code>NEXT_PUBLIC_</code> variable.</p>
        <p style={{ margin: "1.5rem 0 0" }}><Link href="/admin" style={{ color: "#047857", fontWeight: 700 }}>Return to operations</Link></p>
      </section>
    </main>
  );
}

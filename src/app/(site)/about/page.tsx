import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { CtaBand } from "@/components/site/cta-band";
import { CmsPageSections } from "@/components/site/cms-page-sections";
import { PageHero } from "@/components/site/page-hero";
import { SectionHeading } from "@/components/site/section-heading";
import { SiteIcon } from "@/components/site/site-icon";
import { publicMetadata } from "@/components/seo/metadata";
import { getPublicPage } from "@/lib/content/repository";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPublicPage("about");
  return publicMetadata("/about", { title: "About", description: "Why Church Govern is being built and the principles guiding the platform." }, page?.seo);
}

export default async function AboutPage() {
  const page = await getPublicPage("about");
  return <>
    <PageHero eyebrow="About Church Govern" title={page?.title ?? <>Technology should strengthen the work that <em>already matters.</em></>} description={page?.excerpt ?? "Church Govern is being shaped as a dependable digital foundation for churches—one that respects community, continuity and responsible stewardship."} aside={<div className="principle-card"><span>Our guiding idea</span><blockquote>“Simplify the administration around ministry, without simplifying the people it serves.”</blockquote></div>} />
    <CmsPageSections blocks={page?.blocks} />
    <section className="section"><div className="shell split-copy"><div><p className="eyebrow">Our purpose</p><h2>Make church operations easier to understand, manage and sustain.</h2></div><div><p>Churches hold generations of history while coordinating active communities every day. Important work can become fragmented across physical registers, spreadsheets, personal inboxes and isolated applications.</p><p>Church Govern is intended to create a more connected way forward: centralizing relevant information, guiding recurring work and offering considered member services while keeping human responsibility at the center.</p></div></div></section>
    <section className="section section--paper"><div className="shell"><SectionHeading eyebrow="What guides the product" title="Built around enduring principles" align="center" /><div className="value-grid">{[
      ["handshake", "Human first", "Every workflow should make work clearer for clergy, staff, volunteers or members."],
      ["shield", "Trustworthy by design", "Access, privacy and continuity should be considered before information is collected."],
      ["sparkle", "Simple without being shallow", "Powerful capability should arrive through calm, understandable experiences."],
      ["network", "Ready to grow", "Churches should be able to begin deliberately and expand as their needs mature."],
    ].map(([icon,title,text]) => <article key={title}><div className="icon-box"><SiteIcon name={icon} /></div><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>
    <section className="section"><div className="shell about-company"><div className="company-mark"><span>F</span><strong>FamilyaConnect</strong><small>Company identity placeholder</small></div><div><p className="eyebrow">The organization behind the platform</p><h2>FamilyaConnect</h2><p>Church Govern has been proposed as a FamilyaConnect initiative, drawing on broader community-technology and digitization experience. Final company history, mission, vision, relationship to SBL, years of experience and approved credentials have not yet been supplied.</p><div className="notice-box"><strong>Content awaiting approval</strong><p>This page deliberately avoids unsupported experience, customer, scale and compliance claims. Approved corporate copy and links can be added through the CMS.</p></div></div></div></section>
    <section className="digitization-story"><div className="shell digitization-story__grid"><div className="digitization-story__image"><Image src="/images/records-digitization.jpg" alt="A specialist carefully reviewing historical church records for digitization" fill sizes="(max-width: 980px) 100vw, 52vw" /></div><div><p className="eyebrow eyebrow--light">Preserving what cannot be replaced</p><h2>Digitization begins with careful handling.</h2><p>Historical church records carry personal, pastoral and community history. The proposed assessment begins with record condition, volume, format, location and access—before any handling commitment is made.</p><Link className="button button--light" href="/contact#digitization">Request an assessment <ArrowRight size={18} /></Link></div></div></section>
    <section className="section other-products"><div className="shell"><SectionHeading eyebrow="A wider community focus" title="Related products" description="The requirements identify three related products. Approved descriptions, brand assets and destination links are still required." /><div className="related-products">{["FamNme", "Purvaj Tablet", "Purvaj.com"].map((name, index) => <article key={name}><span>0{index + 1}</span><h3>{name}</h3><p>Verified product summary and external link pending from FamilyaConnect.</p><span className="pending-link">Destination pending</span></article>)}</div></div></section>
    <section className="section mission-grid-section"><div className="shell mission-grid"><article><SiteIcon name="map" size={28} /><p className="eyebrow">Mission</p><h2>Approved mission statement pending.</h2><p>The CMS is ready for the final company language when supplied.</p></article><article><SiteIcon name="sparkle" size={28} /><p className="eyebrow">Vision</p><h2>Approved vision statement pending.</h2><p>No placeholder claim will be presented as an official commitment.</p></article><div><h2>Why focus on community?</h2><ul className="check-list"><li><Check />Community records need long-term continuity</li><li><Check />Local teams need technology that respects context</li><li><Check />Engagement works best when administration is dependable</li></ul><Link className="text-link" href="/product">Explore the platform <ArrowRight size={18} /></Link></div></div></section>
    <CtaBand title="Help shape a more useful demonstration" text="Share your church’s current processes, priorities and questions. We’ll use that context to focus the conversation." />
  </>;
}

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { CtaBand } from "@/components/site/cta-band";
import { CmsPageSections } from "@/components/site/cms-page-sections";
import { ModuleCard } from "@/components/site/module-card";
import { PageHero } from "@/components/site/page-hero";
import { SectionHeading } from "@/components/site/section-heading";
import { SiteIcon } from "@/components/site/site-icon";
import { absoluteUrl, publicMetadata } from "@/components/seo/metadata";
import { JsonLd } from "@/components/seo/json-ld";
import { getPublicModules, getPublicPage } from "@/lib/content/repository";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPublicPage("product");
  return publicMetadata("/product", { title: "Product", description: "Explore the Church Govern office and member suites." }, page?.seo);
}

export default async function ProductPage() {
  const [modules, page] = await Promise.all([getPublicModules(), getPublicPage("product")]);
  const officeSuite = modules.filter((item) => item.suite.toLowerCase().includes("office"));
  const memberSuite = modules.filter((item) => item.suite.toLowerCase().includes("member"));
  return <>
    <JsonLd data={{ "@context": "https://schema.org", "@type": "ItemList", name: "Church Govern modules", itemListElement: modules.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.name, url: absoluteUrl(`/product/${item.slug}`) })) }} />
    <PageHero eyebrow="The Church Govern platform" title={page?.title ?? <>One connected foundation. <em>Two focused experiences.</em></>} description={page?.excerpt ?? "Give church teams a more coherent way to administer daily work and members a clear, considered path to church services."} aside={<div className="suite-diagram"><div><span><SiteIcon name="building" /></span><strong>Office suite</strong><small>For authorized church teams</small></div><i /><div><span><SiteIcon name="users" /></span><strong>Member suite</strong><small>For church members</small></div></div>} />
    <CmsPageSections blocks={page?.blocks} />
    <section className="section product-intro"><div className="shell split-copy"><div><p className="eyebrow">Designed to work together</p><h2>Connected records. Clearer workflows. More useful service.</h2></div><div><p>Church Govern is intended to reduce the gaps between the information a church maintains, the work its teams complete and the services its members use.</p><div className="mini-features"><span><Check />Role-aware views</span><span><Check />Shared source records</span><span><Check />Phased adoption</span><span><Check />Traceable workflows</span></div></div></div></section>
    <section className="section section--paper" id="office-suite"><div className="shell"><SectionHeading eyebrow="For clergy, trustees and church teams" title="Office suite" description="Ten focused modules bring administrative work into one considered environment." />{officeSuite.length ? <div className="module-grid">{officeSuite.map((module) => <ModuleCard key={module.slug} module={module} />)}</div> : <div className="empty-state" role="status"><h2>Office-suite details are being prepared</h2><p>No approved office modules are published yet.</p></div>}</div></section>
    <section className="section" id="member-suite"><div className="shell"><SectionHeading eyebrow="For members and families" title="Member suite" description="Seven connected capabilities support self-service, timely updates and accurate personal information." />{memberSuite.length ? <div className="module-grid">{memberSuite.map((module) => <ModuleCard key={module.slug} module={module} />)}</div> : <div className="empty-state" role="status"><h2>Member-suite details are being prepared</h2><p>No approved member modules are published yet.</p></div>}</div></section>
    <section className="section security-preview"><div className="shell security-preview__grid"><div><p className="eyebrow eyebrow--light">Trust and responsibility</p><h2>A secure product is also a well-governed product.</h2><p>Encryption, access controls, auditability, backup planning and data ownership need both technical safeguards and accountable operating practices.</p><Link className="button button--light" href="/security-compliance">Review the trust approach <ArrowRight size={18} /></Link></div><div className="security-rings"><span><SiteIcon name="shield" size={42} /></span><i /><i /><i /></div></div></section>
    <CtaBand />
  </>;
}

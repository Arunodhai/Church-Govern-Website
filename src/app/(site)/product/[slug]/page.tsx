import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { absoluteUrl, publicMetadata } from "@/components/seo/metadata";
import { CtaBand } from "@/components/site/cta-band";
import { FaqList } from "@/components/site/faq-list";
import { MediaGallery } from "@/components/site/media-gallery";
import { ModuleCard } from "@/components/site/module-card";
import { getPublicFaqs, getPublicModule, getPublicModules, isMockContentEnabled } from "@/lib/content/repository";

type Props = { params: Promise<{ slug: string }> };
export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const moduleItem = await getPublicModule(slug);
  return moduleItem ? publicMetadata(`/product/${slug}`, { title: moduleItem.name, description: moduleItem.summary }, { ...moduleItem.seo, imageUrl: moduleItem.seo.imageUrl ?? moduleItem.media?.url }) : {};
}

export default async function ModulePage({ params }: Props) {
  const { slug } = await params;
  const [modules, faqs] = await Promise.all([getPublicModules(), getPublicFaqs()]);
  const moduleItem = modules.find((item) => item.slug === slug);
  if (!moduleItem) notFound();
  const related = moduleItem.related.map((item) => modules.find((candidate) => candidate.slug === item)).filter((item): item is NonNullable<typeof item> => Boolean(item));
  const moduleFaqs = faqs.filter((item) => item.moduleSlug === moduleItem.slug);
  return <>
    <JsonLd data={{ "@context": "https://schema.org", "@type": "SoftwareApplication", name: moduleItem.name, description: moduleItem.summary, applicationCategory: "BusinessApplication", url: absoluteUrl(`/product/${moduleItem.slug}`), operatingSystem: "Web" }} />
    <section className="module-hero"><div className="shell"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Product", href: "/product" }, { label: moduleItem.name }]} /><Link className="back-link" href="/product"><ArrowLeft size={17} /> All modules</Link><div className="module-hero__grid"><div><p className="eyebrow">{moduleItem.suite}</p><h1>{moduleItem.name}</h1><p className="module-hero__tagline">{moduleItem.eyebrow}</p><p className="page-hero__lede">{moduleItem.summary}</p><div className="button-row"><Link className="button" href="/contact#request-demo">Request a demonstration <ArrowRight size={18} /></Link><a className="button button--ghost" href="#features">View features</a></div></div>{moduleItem.media ? <figure className="module-hero-media"><Image src={moduleItem.media.url} alt={moduleItem.media.alt} fill loading="eager" sizes="(max-width: 980px) 100vw, 48vw" />{moduleItem.media.caption ? <figcaption>{moduleItem.media.caption}</figcaption> : null}</figure> : <div className="module-screen"><div className="module-screen__top"><span /><span /><span /><small>Illustrative preview</small></div><div className="module-screen__body"><aside><b>CG</b><i /><i /><i /><i /></aside><div><span className="screen-kicker">{moduleItem.suite}</span><h3>{moduleItem.name}</h3><div className="screen-stats"><span /><span /><span /></div><div className="screen-table"><i /><i /><i /><i /></div><small>Final product screenshot pending approval</small></div></div></div>}</div></div></section>
    <section className="section"><div className="shell module-overview"><div><p className="eyebrow">Module overview</p><h2>{moduleItem.eyebrow}</h2><p className="lede">{moduleItem.overview}</p></div><div className="benefit-panel"><h3>Designed to help teams</h3><ul>{moduleItem.benefits.map((benefit) => <li key={benefit}><Check size={18} />{benefit}</li>)}</ul></div></div></section>
    <section className="section section--paper" id="features"><div className="shell"><div className="feature-workflow-grid"><div><p className="eyebrow">Core capability</p><h2>Features</h2><div className="feature-list">{moduleItem.features.map((feature, index) => <article key={feature}><span>0{index + 1}</span><h3>{feature}</h3><p>Detailed behavior and configuration will be confirmed during product discovery.</p></article>)}</div></div><div><p className="eyebrow">A typical path</p><h2>Workflow</h2><ol className="workflow-list">{moduleItem.workflow.map((step, index) => <li key={step}><span>{index + 1}</span><div><h3>{step}</h3><p>Permissions and review points adapt to the church’s approved process.</p></div></li>)}</ol></div></div></div></section>
    <section className="section"><div className="shell"><div className="section-heading-row"><div><p className="eyebrow">Product imagery</p><h2>See the module in context</h2><p className="lede">{isMockContentEnabled ? "Illustrative interface concepts demonstrate the required multi-screen gallery and lightbox. They are not product screenshots." : "Only approved media uploaded through the CMS is displayed here."}</p></div></div><MediaGallery title={`${moduleItem.name} screenshots`} items={moduleItem.screenshots} /></div></section>
    <section className="section related-modules section--paper"><div className="shell"><div className="section-heading-row"><div><p className="eyebrow">Connected capabilities</p><h2>Related modules</h2></div><Link className="text-link" href="/product">View all modules <ArrowRight size={18} /></Link></div><div className="module-grid module-grid--three">{related.map((item) => <ModuleCard key={item.slug} module={item} />)}</div></div></section>
    {moduleFaqs.length ? <section className="section"><div className="shell faq-shell"><div className="section-heading-row"><div><p className="eyebrow">Module questions</p><h2>Frequently asked about {moduleItem.name}</h2></div></div><FaqList faqs={moduleFaqs} /></div></section> : null}
    <CtaBand title={`Explore ${moduleItem.name} with your own priorities in mind`} />
  </>;
}

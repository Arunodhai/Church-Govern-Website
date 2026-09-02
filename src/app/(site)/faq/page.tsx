import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ArrowRight } from "lucide-react";
import { FaqList } from "@/components/site/faq-list";
import { PageHero } from "@/components/site/page-hero";
import { JsonLd } from "@/components/seo/json-ld";
import { absoluteUrl, publicMetadata } from "@/components/seo/metadata";
import { getPublicFaqs, getPublicPage } from "@/lib/content/repository";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPublicPage("faq");
  return publicMetadata("/faq", { title: "Frequently asked questions", description: "Answers about Church Govern, implementation, security, digitization and support." }, page?.seo);
}
export default async function FaqPage() {
  const [allFaqs, page] = await Promise.all([getPublicFaqs(), getPublicPage("faq")]);
  const faqs = allFaqs.filter((item) => !item.moduleSlug);
  return <div className="faq-page">
    <JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", url: absoluteUrl("/faq"), mainEntity: faqs.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) }} />
    <PageHero title={page?.title ?? <>Clear answers for an <em>important decision.</em></>} description={page?.excerpt ?? "Start with the questions below. Where product or commercial details still need approval, we say so plainly."} aside={<div className="faq-hero-guide"><h2>A focused place to start.</h2><p>Search by keyword or narrow the questions by topic.</p><a className="text-link" href="#faq-browser">Browse questions <ArrowDown aria-hidden="true" size={18} /></a></div>} />
    <section className="section section--paper faq-workspace"><div className="shell faq-shell"><FaqList faqs={faqs} /></div></section>
    <section className="section faq-help"><div className="shell help-row"><div><h2>Bring us the questions specific to your church.</h2><p>We can use your current records, workflows and priorities to make the conversation more useful.</p></div><Link className="button" href="/contact">Talk with us <ArrowRight aria-hidden="true" size={18} /></Link></div></section>
  </div>;
}

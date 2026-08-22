import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FaqList } from "@/components/site/faq-list";
import { CmsPageSections } from "@/components/site/cms-page-sections";
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
  return <><JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", url: absoluteUrl("/faq"), mainEntity: faqs.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) }} /><PageHero eyebrow="Frequently asked questions" title={page?.title ?? <>Clear answers for an <em>important decision.</em></>} description={page?.excerpt ?? "Start with the questions below. Where product or commercial details still need approval, we say so plainly."} aside={<div className="question-mark" aria-hidden="true">?</div>} /><CmsPageSections blocks={page?.blocks} /><section className="section section--paper"><div className="shell faq-shell"><FaqList faqs={faqs} /></div></section><section className="section"><div className="shell help-row"><div><p className="eyebrow">Still deciding?</p><h2>Bring us the questions specific to your church.</h2><p>We can use your current records, workflows and priorities to make the conversation more useful.</p></div><Link className="button" href="/contact">Talk with us <ArrowRight size={18} /></Link></div></section></>;
}

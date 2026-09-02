import type { Metadata } from "next";
import { ArrowDown } from "lucide-react";
import { BlogExplorer } from "@/components/site/blog-explorer";
import { EnquiryForm } from "@/components/site/enquiry-form";
import { PageHero } from "@/components/site/page-hero";
import { publicMetadata } from "@/components/seo/metadata";
import { getPublicBlogPosts, getPublicPage } from "@/lib/content/repository";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPublicPage("blogs");
  return publicMetadata("/blogs", { title: "Insights", description: "Practical thinking on church administration, technology, governance and records." }, page?.seo);
}

export default async function BlogsPage() {
  const [blogPosts, page] = await Promise.all([getPublicBlogPosts(), getPublicPage("blogs")]);
  return <div className="blogs-page">
    <PageHero title={page?.title ?? <>Practical ideas for churches navigating <em>digital change.</em></>} description={page?.excerpt ?? "Considered guidance on administration, governance, records, technology and member engagement."} aside={<div className="insights-guide"><h2>Thinking for responsible change.</h2><p>Explore practical perspectives on administration, governance, records, technology and community.</p><a className="text-link" href="#insights-library">Browse the library <ArrowDown aria-hidden="true" size={18} /></a></div>} />
    <section className="section section--paper"><div className="shell"><BlogExplorer posts={blogPosts} /></div></section>
    <section className="section section--paper blog-topic-section"><div className="shell form-shell form-shell--narrow"><EnquiryForm kind="topic" compact /></div></section>
  </div>;
}

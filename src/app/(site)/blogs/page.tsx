import type { Metadata } from "next";
import Link from "next/link";
import { BlogExplorer } from "@/components/site/blog-explorer";
import { CmsPageSections } from "@/components/site/cms-page-sections";
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
  const recent = blogPosts.slice(0, 4);
  const popular = blogPosts.filter((post) => post.popular).slice(0, 4);
  return <>
    <PageHero eyebrow="Church Govern insights" title={page?.title ?? <>Practical ideas for churches navigating <em>digital change.</em></>} description={page?.excerpt ?? "Considered guidance on administration, governance, records, technology and member engagement."} aside={<div className="topic-cloud"><span>Administration</span><span>Governance</span><span>Records</span><span>Technology</span><span>Community</span></div>} />
    <CmsPageSections blocks={page?.blocks} />
    <section className="section section--paper"><div className="shell"><BlogExplorer posts={blogPosts} /></div></section>
    <section className="section blog-lists"><div className="shell two-lists"><div><p className="eyebrow">Recently published</p><h2>Latest four</h2><ol>{recent.map((post, index) => <li key={post.slug}><span>0{index + 1}</span><Link href={`/blogs/${post.slug}`}>{post.title}</Link></li>)}</ol></div><div><p className="eyebrow">Reader interest</p><h2>Popular four</h2><ol>{popular.map((post, index) => <li key={post.slug}><span>0{index + 1}</span><Link href={`/blogs/${post.slug}`}>{post.title}</Link></li>)}</ol><small>Popularity is seeded editorial content until analytics data is available.</small></div></div></section>
    <section className="section section--paper"><div className="shell form-shell form-shell--narrow"><EnquiryForm kind="topic" compact /></div></section>
  </>;
}

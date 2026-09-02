import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CalendarDays, Clock3 } from "lucide-react";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { absoluteUrl, publicMetadata } from "@/components/seo/metadata";
import { BlogEngagement } from "@/components/site/blog-engagement";
import { BlogCard } from "@/components/site/blog-card";
import { CtaBand } from "@/components/site/cta-band";
import { getBlogEngagement, getPublicBlogPost, getPublicBlogPosts } from "@/lib/content/repository";

type Props = { params: Promise<{ slug: string }> };
export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublicBlogPost(slug);
  if (!post) return {};
  const base = publicMetadata(`/blogs/${slug}`, { title: post.title, description: post.summary }, { ...post.seo, imageUrl: post.seo.imageUrl ?? post.media?.url });
  return { ...base, authors: [{ name: post.author }], openGraph: { ...base.openGraph, type: "article", publishedTime: post.date, authors: [post.author], tags: post.tags } };
}
const formatDate = (date: string) => new Intl.DateTimeFormat("en", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));
const sectionId = (heading: string) => heading.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const [blogPosts, engagement] = await Promise.all([getPublicBlogPosts(), getBlogEngagement(slug)]);
  const post = blogPosts.find((item) => item.slug === slug);
  if (!post) notFound();
  const related = blogPosts.filter((item) => item.slug !== post.slug).slice(0, 3);
  return <>
    <JsonLd data={{ "@context": "https://schema.org", "@type": "BlogPosting", headline: post.title, description: post.summary, datePublished: post.date, author: { "@type": "Organization", name: post.author }, publisher: { "@type": "Organization", name: "Church Govern" }, mainEntityOfPage: absoluteUrl(`/blogs/${post.slug}`), ...(post.media ? { image: absoluteUrl(post.media.url) } : {}) }} />
    <article className="blog-article-page">
      <header className="article-hero">
        <div className="shell article-hero__inner">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Insights", href: "/blogs" }, { label: post.title }]} />
          <div className="article-hero__utility">
            <Link className="back-link" href="/blogs"><ArrowLeft aria-hidden="true" size={17} /> All insights</Link>
            <span className="article-category">{post.category}</span>
          </div>
          <h1>{post.title}</h1>
          <p className="article-summary">{post.summary}</p>
          <div className="article-byline" aria-label="Article information">
            <span className="article-author">By {post.author}</span>
            <span><CalendarDays aria-hidden="true" size={16} />{formatDate(post.date)}</span>
            <span><Clock3 aria-hidden="true" size={16} />{post.readTime}</span>
          </div>
        </div>
      </header>
      <div className="shell article-media-shell">
        {post.media ? <div className="article-art article-art--media"><Image src={post.media.url} alt={post.media.alt} fill priority sizes="(max-width: 680px) calc(100vw - 32px), (max-width: 1280px) calc(100vw - 64px), 1180px" /></div> : <div className="article-art" aria-hidden="true"><span>{post.category}</span><i /><i /></div>}
      </div>
      <details className="shell mobile-toc"><summary>In this article <span>{post.sections.length} sections</span></summary><nav aria-label="Article sections">{post.sections.map((section) => <a key={section.heading} href={`#${sectionId(section.heading)}`}>{section.heading}</a>)}</nav></details>
      <div className="article-layout shell">
        <aside aria-label="Article table of contents"><span>In this article</span><nav>{post.sections.map((section) => <a key={section.heading} href={`#${sectionId(section.heading)}`}>{section.heading}<ArrowRight aria-hidden="true" size={14} /></a>)}</nav></aside>
        <div className="article-body">
          <p className="article-lead">This article provides general operational guidance. Churches should adapt decisions to their governance, legal duties and pastoral context.</p>
          {post.sections.map((section) => <section key={section.heading} id={sectionId(section.heading)}><h2>{section.heading}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>)}
          <div className="article-note"><strong>Editorial note</strong><p>This content provides general information and does not provide legal, financial or security advice.</p></div>
          <BlogEngagement slug={post.slug} initialComments={engagement.comments} initialRating={engagement.rating} />
        </div>
      </div>
    </article>
    <section className="section section--paper article-related"><div className="shell"><div className="section-heading-row"><div><h2>Continue reading</h2><p>More practical thinking from the Church Govern insight library.</p></div><Link className="text-link" href="/blogs">View all insights <ArrowRight aria-hidden="true" size={18} /></Link></div><div className="blog-grid">{related.map((item) => <BlogCard key={item.slug} post={item} />)}</div></div></section>
    <CtaBand />
  </>;
}

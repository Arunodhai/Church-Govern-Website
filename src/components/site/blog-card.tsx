import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, CalendarDays, Star } from "lucide-react";
type BlogCardPost = { slug: string; title: string; summary: string; category: string; date: string; readTime: string; rating?: { average: number; count: number }; media?: { url: string; alt: string } | null };

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));
}

export function BlogCard({ post }: { post: BlogCardPost }) {
  return (
    <article className="blog-card">
      <div className="blog-card__art">{post.media ? <Image src={post.media.url} alt={post.media.alt} fill sizes="(max-width: 680px) 100vw, 33vw" /> : <span aria-hidden="true">{post.category.split(" ")[0]}</span>}</div>
      <div className="blog-card__body">
        <div className="card-meta"><span className="card-date"><CalendarDays aria-hidden="true" size={16} />{formatDate(post.date)}</span><span className="card-category">{post.category}</span></div>
        <h3><Link href={`/blogs/${post.slug}`}>{post.title}</Link></h3>
        <p>{post.summary}</p>
        <div className="blog-card__footer"><span>{post.readTime}</span>{post.rating ? <span className="card-rating" aria-label={`${post.rating.average.toFixed(1)} out of 5 from ${post.rating.count} ratings`}><Star aria-hidden="true" size={13} fill="currentColor" /> {post.rating.average.toFixed(1)} ({post.rating.count})</span> : null}<Link href={`/blogs/${post.slug}`} aria-label={`Read ${post.title}`}><ArrowUpRight aria-hidden="true" size={19} /></Link></div>
      </div>
    </article>
  );
}

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Star } from "lucide-react";
type BlogCardPost = { slug: string; title: string; summary: string; category: string; date: string; readTime: string; rating?: { average: number; count: number }; media?: { url: string; alt: string } | null };

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));
}

export function BlogCard({ post, featured = false }: { post: BlogCardPost; featured?: boolean }) {
  return (
    <article className={`blog-card${featured ? " blog-card--featured" : ""}`}>
      <div className="blog-card__art">{post.media ? <Image src={post.media.url} alt={post.media.alt} fill sizes="(max-width: 680px) 100vw, 33vw" /> : <span aria-hidden="true">{post.category.split(" ")[0]}</span>}</div>
      <div className="blog-card__body">
        <p className="card-meta"><span>{post.category}</span><span>{formatDate(post.date)}</span><span>{post.readTime}</span>{post.rating ? <span className="card-rating" aria-label={`${post.rating.average.toFixed(1)} out of 5 from ${post.rating.count} ratings`}><Star aria-hidden="true" size={13} fill="currentColor" /> {post.rating.average.toFixed(1)} ({post.rating.count})</span> : null}</p>
        <h3>{post.title}</h3>
        <p>{post.summary}</p>
        <Link href={`/blogs/${post.slug}`}>Read article <ArrowUpRight aria-hidden="true" size={18} /></Link>
      </div>
    </article>
  );
}

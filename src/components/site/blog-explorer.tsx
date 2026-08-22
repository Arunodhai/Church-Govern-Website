"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { BlogCard } from "./blog-card";

type ExplorerPost = Parameters<typeof BlogCard>[0]["post"];

export function BlogExplorer({ posts }: { posts: ExplorerPost[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All topics");
  const categories = ["All topics", ...Array.from(new Set(posts.map((post) => post.category)))];
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesCategory = category === "All topics" || post.category === category;
      const matchesQuery = !needle || `${post.title} ${post.summary} ${post.category}`.toLowerCase().includes(needle);
      return matchesCategory && matchesQuery;
    });
  }, [category, posts, query]);

  return (
    <div>
      <div className="filter-bar">
        <label className="search-field"><span className="sr-only">Search insights</span><Search aria-hidden="true" size={20} /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by topic or keyword" /></label>
        <label><span className="sr-only">Filter by category</span><select value={category} onChange={(event) => setCategory(event.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
      </div>
      <p className="result-count" role="status">{filtered.length} {filtered.length === 1 ? "article" : "articles"}</p>
      {filtered.length ? <div className="blog-grid">{filtered.map((post) => <BlogCard key={post.slug} post={post} />)}</div> : <div className="empty-state"><h2>No matching articles</h2><p>Try a broader keyword or choose all topics.</p><button className="text-button" type="button" onClick={() => { setQuery(""); setCategory("All topics"); }}>Clear filters</button></div>}
    </div>
  );
}

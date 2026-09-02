"use client";

import { Search, X } from "lucide-react";
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
    <div className="blog-library" id="insights-library">
      <header className="blog-library__heading">
        <h2>Explore the insight library</h2>
        <p>Search practical guidance by subject, keyword or area of church responsibility.</p>
      </header>
      <div className="filter-bar">
        <div className="search-field" role="search"><Search aria-hidden="true" size={20} /><label><span className="sr-only">Search insights</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by topic or keyword" /></label>{query ? <button type="button" aria-label="Clear insight search" onClick={() => setQuery("")}><X aria-hidden="true" size={18} /></button> : null}</div>
        <label className="blog-category-select"><span className="sr-only">Filter by category</span><select value={category} onChange={(event) => setCategory(event.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
      </div>
      <div className="blog-topic-filter" role="group" aria-label="Filter insights by topic">
        {categories.map((item) => <button type="button" className={category === item ? "is-active" : ""} aria-pressed={category === item} onClick={() => setCategory(item)} key={item}><span>{item}</span><small>{item === "All topics" ? posts.length : posts.filter((post) => post.category === item).length}</small></button>)}
      </div>
      <p className="result-count" role="status" aria-live="polite">Showing {filtered.length} {filtered.length === 1 ? "article" : "articles"}</p>
      {filtered.length ? <div className="blog-grid">{filtered.map((post) => <BlogCard key={post.slug} post={post} />)}</div> : <div className="empty-state"><h2>No matching articles</h2><p>Try a broader keyword or choose all topics.</p><button className="text-button" type="button" onClick={() => { setQuery(""); setCategory("All topics"); }}>Clear filters</button></div>}
    </div>
  );
}

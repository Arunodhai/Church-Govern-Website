"use client";

import { ChevronDown, Search, X } from "lucide-react";
import { useState } from "react";
type PublicFaq = { id?: string; category: string; question: string; answer: string };

export function FaqList({ faqs }: { faqs: PublicFaq[] }) {
  const [category, setCategory] = useState<string>("All");
  const [query, setQuery] = useState("");
  const faqCategories = Array.from(new Set(faqs.map((item) => item.category)));
  const needle = query.trim().toLowerCase();
  const shown = faqs.filter((item) => {
    const matchesCategory = category === "All" || item.category === category;
    const matchesQuery = !needle || `${item.question} ${item.answer} ${item.category}`.toLowerCase().includes(needle);
    return matchesCategory && matchesQuery;
  });
  if (!faqs.length) return <div className="empty-state" role="status"><h2>Answers are being prepared</h2><p>No approved frequently asked questions are published yet. Please contact the team with your question.</p></div>;
  return (
    <div className="faq-browser" id="faq-browser">
      <header className="faq-browser__heading">
        <h2>Find an answer</h2>
        <p>Search the complete question library or narrow it to the topic most relevant to your church.</p>
      </header>
      <div className="faq-browser__controls">
        <div className="faq-search" role="search">
          <Search aria-hidden="true" size={20} />
          <label><span className="sr-only">Search frequently asked questions</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search questions and answers" /></label>
          {query ? <button type="button" aria-label="Clear FAQ search" onClick={() => setQuery("")}><X aria-hidden="true" size={18} /></button> : null}
        </div>
        <div className="faq-browser__filters">
          <span className="faq-filter-label">Filter by topic</span>
          <div className="chip-row" role="group" aria-label="Filter frequently asked questions by category">
            {["All", ...faqCategories].map((item) => <button type="button" className={category === item ? "is-active" : ""} aria-pressed={category === item} onClick={() => setCategory(item)} key={item}><span>{item}</span><small>{item === "All" ? faqs.length : faqs.filter((faq) => faq.category === item).length}</small></button>)}
          </div>
        </div>
      </div>
      <div className="faq-browser__answers">
        <p className="faq-result-count" aria-live="polite">Showing {shown.length} {shown.length === 1 ? "question" : "questions"}</p>
        {shown.length ? <div className="faq-list">
          {shown.map((item) => (
            <details key={item.id ?? item.question}>
              <summary><span><small>{item.category}</small>{item.question}</span><ChevronDown aria-hidden="true" /></summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div> : <div className="empty-state"><h2>No matching questions</h2><p>Try a broader phrase or return to all topics.</p><button className="text-button" type="button" onClick={() => { setQuery(""); setCategory("All"); }}>Clear search and filters</button></div>}
      </div>
    </div>
  );
}

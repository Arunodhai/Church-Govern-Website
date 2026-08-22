"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
type PublicFaq = { id?: string; category: string; question: string; answer: string };

export function FaqList({ faqs }: { faqs: PublicFaq[] }) {
  const [category, setCategory] = useState<string>("All");
  const faqCategories = Array.from(new Set(faqs.map((item) => item.category)));
  const shown = category === "All" ? faqs : faqs.filter((item) => item.category === category);
  if (!faqs.length) return <div className="empty-state" role="status"><h2>Answers are being prepared</h2><p>No approved frequently asked questions are published yet. Please contact the team with your question.</p></div>;
  return (
    <div>
      <div className="chip-row" aria-label="Filter frequently asked questions">
        {["All", ...faqCategories].map((item) => <button type="button" className={category === item ? "is-active" : ""} aria-pressed={category === item} onClick={() => setCategory(item)} key={item}>{item}</button>)}
      </div>
      <div className="faq-list">
        {shown.map((item) => (
          <details key={item.id ?? item.question}>
            <summary><span><small>{item.category}</small>{item.question}</span><ChevronDown aria-hidden="true" /></summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
}

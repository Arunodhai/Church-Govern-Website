type PageBlock = { heading: string; body: string };

export function CmsPageSections({ blocks }: { blocks?: PageBlock[] }) {
  if (!blocks?.length) return null;
  return (
    <section className="section cms-page-sections" aria-label="Page information">
      <div className="shell cms-page-sections__grid">
        {blocks.map((block, index) => (
          <article key={`${block.heading}-${index}`}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <div><h2>{block.heading}</h2>{block.body.split(/\n{2,}/).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
          </article>
        ))}
      </div>
    </section>
  );
}


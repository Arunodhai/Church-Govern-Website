import type { ReactNode } from "react";

export function PageHero({ eyebrow, title, description, aside }: { eyebrow: string; title: ReactNode; description: ReactNode; aside?: ReactNode }) {
  return (
    <section className="page-hero">
      <div className="shell page-hero__grid">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="page-hero__lede">{description}</p>
        </div>
        {aside && <div className="page-hero__aside">{aside}</div>}
      </div>
    </section>
  );
}

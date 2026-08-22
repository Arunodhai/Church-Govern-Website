import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CtaBand({ title = "See how Church Govern could fit your church", text = "Tell us about your administration, member services and record needs. We’ll use the conversation to shape a relevant demonstration." }: { title?: string; text?: string }) {
  return (
    <section className="cta-wrap">
      <div className="shell">
        <div className="cta-band">
          <div><p className="eyebrow eyebrow--light">A useful first conversation</p><h2>{title}</h2><p>{text}</p></div>
          <Link className="button button--light" href="/contact#request-demo">Request a demonstration <ArrowRight aria-hidden="true" size={18} /></Link>
        </div>
      </div>
    </section>
  );
}

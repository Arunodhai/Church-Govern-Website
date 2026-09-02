"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { EnquiryForm } from "./enquiry-form";
import { SiteIcon } from "./site-icon";

type Intent = "request-demo" | "digitization" | "general-enquiry";

const intents = [
  {
    id: "request-demo" as const,
    icon: "layout",
    label: "Product demonstration",
    summary: "Explore the modules most relevant to your church.",
    title: "See the platform through your church’s priorities.",
    description: "We’ll prepare around the modules and responsibilities most relevant to your team. A submission is a request, not a confirmed appointment.",
    form: "demo" as const,
  },
  {
    id: "digitization" as const,
    icon: "archive",
    label: "Digitization assessment",
    summary: "Discuss records, preservation and responsible handling.",
    title: "Begin with a responsible assessment.",
    description: "Historical registers can be fragile and sensitive. This form helps us understand the first practical questions; it is not a handling or pricing commitment.",
    form: "digitization" as const,
  },
  {
    id: "general-enquiry" as const,
    icon: "message",
    label: "General enquiry",
    summary: "Ask a question or start a different conversation.",
    title: "Not sure where to begin?",
    description: "Send the question in your own words. Approved phone, email and office details can be added here when supplied by the project owner.",
    form: "contact" as const,
  },
];

function isIntent(value: string): value is Intent {
  return intents.some((intent) => intent.id === value);
}

export function ContactEnquiryTabs() {
  const [active, setActive] = useState<Intent>("request-demo");
  const tablistRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const syncHash = () => {
      const hash = window.location.hash.slice(1);
      if (isIntent(hash)) setActive(hash);
    };
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  function choose(intent: Intent) {
    setActive(intent);
    window.history.replaceState(null, "", `#${intent}`);
  }

  function moveFocus(event: KeyboardEvent<HTMLButtonElement>, currentIndex: number) {
    const lastIndex = intents.length - 1;
    let nextIndex = currentIndex;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = currentIndex === lastIndex ? 0 : currentIndex + 1;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = currentIndex === 0 ? lastIndex : currentIndex - 1;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = lastIndex;
    else return;

    event.preventDefault();
    choose(intents[nextIndex].id);
    requestAnimationFrame(() => {
      tablistRef.current?.querySelectorAll<HTMLButtonElement>("[role='tab']")[nextIndex]?.focus();
    });
  }

  return (
    <section className="section contact-workspace" aria-labelledby="contact-intent-title">
      <div className="shell">
        <div className="contact-workspace__intro">
          <h2 id="contact-intent-title">What would you like to do?</h2>
          <p>Choose one path to see only the questions relevant to your enquiry. You can switch paths without losing information already entered.</p>
        </div>
        <div className="contact-intent-workspace">
          <div ref={tablistRef} className="contact-intent-tabs" role="tablist" aria-label="Enquiry type">
            {intents.map((intent, index) => (
              <button
                key={intent.id}
                id={`${intent.id}-tab`}
                type="button"
                role="tab"
                aria-selected={active === intent.id}
                aria-controls={`${intent.id}-panel`}
                tabIndex={active === intent.id ? 0 : -1}
                onClick={() => choose(intent.id)}
                onKeyDown={(event) => moveFocus(event, index)}
              >
                <SiteIcon name={intent.icon} />
                <span><strong>{intent.label}</strong><small>{intent.summary}</small></span>
              </button>
            ))}
          </div>
          <div className="contact-intent-content">
            {intents.map((intent) => (
              <div
                key={intent.id}
                id={`${intent.id}-panel`}
                className="contact-intent-panel"
                role="tabpanel"
                aria-labelledby={`${intent.id}-tab`}
                hidden={active !== intent.id}
              >
                <aside>
                  <h2>{intent.title}</h2>
                  <p>{intent.description}</p>
                  {intent.id === "request-demo" ? <div className="privacy-mini"><SiteIcon name="shield" /><span><strong>Your details stay purposeful</strong>We collect only what is needed to respond and prepare.</span></div> : null}
                </aside>
                <EnquiryForm kind={intent.form} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

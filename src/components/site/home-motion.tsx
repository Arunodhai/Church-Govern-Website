"use client";

import { useEffect } from "react";

const REVEAL_SELECTOR = "[data-reveal], [data-reveal-group]";

/**
 * Where "on screen" stops, as a fraction of the viewport. The initial pass and
 * the observer both use it, so a section cannot be classified as already seen by
 * one and still waiting by the other.
 */
const FOLD_RATIO = 0.88;

/** A section has been reached once its top has crossed the fold. */
const reached = (target: HTMLElement) =>
  target.getBoundingClientRect().top < window.innerHeight * FOLD_RATIO;

/**
 * Arms the home page's scroll-reveal sequence.
 *
 * Motion is opt-in from the client: the server-rendered page carries no hidden
 * state, so the complete page is readable without JavaScript. Visitors who
 * prefer reduced motion are left on that fully visible path.
 */
export function HomeMotion() {
  useEffect(() => {
    // Scoped exactly like the stylesheet. A bare ".home-page" can match the
    // copy React still holds in its streaming buffer, which no scoped rule
    // reaches, so the page would be marked armed and never animate.
    const root = document.querySelector<HTMLElement>(".public-site .home-page");
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let frame = 0;
    let observer: IntersectionObserver | undefined;

    const arm = () => {
      if (cancelled) return;
      const targets = Array.from(root.querySelectorAll<HTMLElement>(REVEAL_SELECTOR));
      if (!targets.length) return;

      // Hiding and marking share one synchronous block, so the browser never
      // paints a frame in which content the visitor can already see is hidden.
      root.dataset.motion = "arming";
      const pending = new Set<HTMLElement>();
      for (const target of targets) {
        if (reached(target)) target.dataset.revealed = "";
        else pending.add(target);
      }

      // Transitions are attached a frame later, so the hidden state above lands
      // instantly instead of reading as a fade-out.
      frame = requestAnimationFrame(() => {
        root.dataset.motion = "ready";
        if (!pending.size) return;

        // Being reached is permanent, so the observer re-checks every section
        // still waiting rather than trusting the entries it was handed. The
        // root is also extended above the document, which keeps a section the
        // viewport jumps clean over — restored scroll, find-in-page, a dragged
        // scrollbar — inside it. Without both, such a section is never reported
        // as intersecting and stays invisible for the rest of the visit.
        const overshoot = Math.round(document.documentElement.scrollHeight);
        observer = new IntersectionObserver(
          () => {
            for (const target of pending) {
              if (!reached(target)) continue;
              target.dataset.revealed = "";
              pending.delete(target);
              observer?.unobserve(target);
            }
            if (!pending.size) observer?.disconnect();
          },
          {
            rootMargin: `${overshoot}px 0px -${Math.round((1 - FOLD_RATIO) * 100)}% 0px`,
          },
        );
        for (const target of pending) observer.observe(target);
      });
    };

    // Arming waits for load and webfonts. Measuring the fold while layout is
    // still settling marks sections far down the page as already seen, and they
    // then never animate. Until this resolves the page is simply complete.
    const loaded =
      document.readyState === "complete"
        ? Promise.resolve()
        : new Promise<void>((resolve) => {
            window.addEventListener("load", () => resolve(), { once: true });
          });
    void Promise.all([loaded, document.fonts?.ready]).then(arm);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, []);

  return null;
}

"use client";

import Image from "next/image";
import { Pause, Play } from "lucide-react";
import { useEffect, useState } from "react";

const slides = [
  { src: "/images/church-community-hero.jpg", alt: "Development mock image of a church community gathered in a bright sanctuary", eyebrow: "One shared foundation", title: "Church life, clearly organized" },
  { src: "/images/records-digitization.jpg", alt: "Development mock image of historical church records being reviewed for digitization", eyebrow: "Records with continuity", title: "Preserve history. Improve access." },
] as const;

export function DemoHeroVisual() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % slides.length), 5500);
    return () => window.clearInterval(timer);
  }, [paused]);

  return <div className="hero-visual hero-visual--rotating" aria-label="Development hero media preview">
    <div className="hero-community-photo hero-community-photo--rotating">
      {slides.map((slide, index) => <Image key={slide.src} className={index === active ? "is-active" : ""} src={slide.src} alt={slide.alt} fill loading="eager" fetchPriority={index === 0 ? "high" : "auto"} sizes="(max-width: 980px) 90vw, 44vw" />)}
      <span><small>{slides[active].eyebrow}</small><strong>{slides[active].title}</strong></span>
      <div className="hero-media-controls" aria-label="Choose hero image">
        {slides.map((slide, index) => <button key={slide.src} type="button" className={index === active ? "is-active" : ""} aria-label={`Show image ${index + 1}: ${slide.title}`} aria-pressed={index === active} onClick={() => setActive(index)} />)}
        <button className="hero-media-pause" type="button" aria-label={paused ? "Resume rotating hero images" : "Pause rotating hero images"} onClick={() => setPaused((value) => !value)}>{paused ? <Play aria-hidden="true" size={13} /> : <Pause aria-hidden="true" size={13} />}</button>
      </div>
    </div>
  </div>;
}

"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export type GalleryMedia = { id?: string; url: string; alt: string; caption?: string | null; width?: number | null; height?: number | null };

export function MediaGallery({ items, title = "Image gallery" }: { items: GalleryMedia[]; title?: string }) {
  const [active, setActive] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const close = useCallback(() => {
    dialogRef.current?.close();
    setActive(null);
    requestAnimationFrame(() => openerRef.current?.focus());
  }, []);
  const move = useCallback((direction: number) => setActive((current) => current === null ? null : (current + direction + items.length) % items.length), [items.length]);

  useEffect(() => {
    if (active === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") move(-1);
      if (event.key === "ArrowRight") move(1);
      if (event.key === "Tab") {
        const focusable = Array.from(dialogRef.current?.querySelectorAll<HTMLButtonElement>("button") ?? []);
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable.at(-1)!;
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (!dialogRef.current?.open) dialogRef.current?.showModal();
    requestAnimationFrame(() => dialogRef.current?.querySelector<HTMLButtonElement>(".lightbox__close")?.focus());
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener("keydown", onKey); };
  }, [active, close, move]);

  if (!items.length) {
    return <div className="gallery-empty" role="status"><strong>Product imagery is awaiting approval.</strong><span>No fabricated screenshots are displayed.</span></div>;
  }

  const selected = active === null ? null : items[active];
  return (
    <>
      <div className="media-gallery" aria-label={title}>
        {items.map((item, index) => (
          <figure key={item.id ?? item.url}>
            <button type="button" onClick={(event) => { openerRef.current = event.currentTarget; setActive(index); }} aria-label={`View image: ${item.alt}`}>
              <Image src={item.url} alt={item.alt} fill sizes="(max-width: 680px) 100vw, (max-width: 980px) 50vw, 33vw" />
              <span><Maximize2 aria-hidden="true" size={18} /> View image</span>
            </button>
            {item.caption ? <figcaption>{item.caption}</figcaption> : null}
          </figure>
        ))}
      </div>
      {selected ? (
        <dialog ref={dialogRef} className="lightbox" aria-labelledby="lightbox-title" onCancel={(event) => { event.preventDefault(); close(); }} onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}>
          <h2 className="sr-only" id="lightbox-title">{title}: {selected.alt}</h2>
          <button className="lightbox__close" type="button" onClick={close} aria-label="Close image viewer"><X aria-hidden="true" /></button>
          {items.length > 1 ? <button className="lightbox__previous" type="button" onClick={() => move(-1)} aria-label="Previous image"><ChevronLeft aria-hidden="true" /></button> : null}
          <figure><div><Image src={selected.url} alt={selected.alt} fill sizes="95vw" /></div>{selected.caption ? <figcaption>{selected.caption}</figcaption> : null}</figure>
          {items.length > 1 ? <button className="lightbox__next" type="button" onClick={() => move(1)} aria-label="Next image"><ChevronRight aria-hidden="true" /></button> : null}
        </dialog>
      ) : null}
    </>
  );
}

"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Brand } from "./brand";

type NavigationItem = { href: string; label: string; external?: boolean; children?: NavigationItem[] };

export function SiteHeader({ items }: { items: NavigationItem[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); menuButton.current?.focus(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className="shell site-header__inner">
        <Brand />
        <button
          ref={menuButton}
          className="menu-button"
          type="button"
          aria-expanded={open}
          aria-controls="primary-navigation"
          aria-label={open ? "Close navigation" : "Open navigation"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
        <nav id="primary-navigation" className={`primary-nav${open ? " is-open" : ""}`} aria-label="Primary navigation">
          {items.map((item) => {
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(`${item.href}/`));
            return <div className="nav-group" key={item.href}><Link href={item.href} aria-current={active ? "page" : undefined} onClick={() => setOpen(false)} {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{item.label}</Link>{item.children?.length ? <ul>{item.children.map((child) => <li key={child.href}><Link href={child.href} onClick={() => setOpen(false)} {...(child.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{child.label}</Link></li>)}</ul> : null}</div>;
          })}
          <Link className="button button--small" href="/contact#request-demo" onClick={() => setOpen(false)}>Request a demo</Link>
        </nav>
      </div>
    </header>
  );
}

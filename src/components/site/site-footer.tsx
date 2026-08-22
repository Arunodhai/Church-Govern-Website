import Link from "next/link";
import { Brand } from "./brand";

type NavigationItem = { href: string; label: string; external?: boolean; children?: NavigationItem[] };

export function SiteFooter({ items }: { items: NavigationItem[] }) {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div className="footer-intro">
          <Brand footer />
          <p>A thoughtful digital foundation for church administration, clergy enablement and member connection.</p>
          <span className="status-note">Product and company details are being finalized with the project owner.</span>
        </div>
        <div>
          <h2>Explore</h2>
          <ul>
            {items.slice(0, 6).map((item) => <li key={item.href}><Link href={item.href} {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{item.label}</Link>{item.children?.length ? <ul className="footer-subnav">{item.children.map((child) => <li key={child.href}><Link href={child.href} {...(child.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{child.label}</Link></li>)}</ul> : null}</li>)}
          </ul>
        </div>
        <div>
          <h2>Connect</h2>
          <ul>
            <li><Link href="/contact">Contact us</Link></li>
            <li><Link href="/contact#request-demo">Request a demo</Link></li>
            <li><Link href="/contact#digitization">Digitization enquiry</Link></li>
          </ul>
        </div>
        <div>
          <h2>Legal</h2>
          <ul>
            <li><Link href="/privacy">Privacy</Link></li>
            <li><Link href="/terms">Terms</Link></li>
            <li><Link href="/accessibility">Accessibility</Link></li>
          </ul>
        </div>
      </div>
      <div className="shell footer-base">
        <p>© {new Date().getFullYear()} Church Govern. All rights reserved.</p>
        <p>A FamilyaConnect initiative. Relationship statement pending final approval.</p>
      </div>
    </footer>
  );
}

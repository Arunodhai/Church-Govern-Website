import { ConsentAnalytics } from "@/components/analytics/consent-analytics";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { getPublicNavigation } from "@/lib/content/repository";
import "./site-theme.css";

// CMS publishing and moderation must be visible without a deployment.
export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const navigation = await getPublicNavigation();
  const headerItems = navigation.filter((item) => item.location === "header");
  const footerItems = navigation.filter((item) => item.location === "footer");
  return (
    <div className="public-site">
      <SiteHeader items={headerItems} />
      <main id="main-content">{children}</main>
      <SiteFooter items={footerItems.length ? footerItems : headerItems} />
      <ConsentAnalytics />
    </div>
  );
}

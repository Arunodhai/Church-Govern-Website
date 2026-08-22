import { ConsentAnalytics } from "@/components/analytics/consent-analytics";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { getPublicNavigation, isMockContentEnabled } from "@/lib/content/repository";

// CMS publishing and moderation must be visible without a deployment.
export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const navigation = await getPublicNavigation();
  const headerItems = navigation.filter((item) => item.location === "header");
  const footerItems = navigation.filter((item) => item.location === "footer");
  return (
    <>
      <SiteHeader items={headerItems} />
      {isMockContentEnabled ? <div className="mock-content-banner" role="status">Client preview content · awaiting final approval and replacement</div> : null}
      <main id="main-content">{children}</main>
      <SiteFooter items={footerItems.length ? footerItems : headerItems} />
      <ConsentAnalytics />
    </>
  );
}

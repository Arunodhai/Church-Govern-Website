import type { Metadata } from "next";
import { CtaBand } from "@/components/site/cta-band";
import { CmsPageSections } from "@/components/site/cms-page-sections";
import { PageHero } from "@/components/site/page-hero";
import { SectionHeading } from "@/components/site/section-heading";
import { SiteIcon } from "@/components/site/site-icon";
import { publicMetadata } from "@/components/seo/metadata";
import { getPublicPage } from "@/lib/content/repository";

export async function generateMetadata(): Promise<Metadata> { const page = await getPublicPage("security-compliance"); return publicMetadata("/security-compliance", { title: "Security & compliance", description: "The security, privacy and governance principles intended for Church Govern." }, page?.seo); }
const safeguards = [
  ["lock", "Encryption", "Data protection in transit and at rest is a stated product requirement. Technical specifications await the approved security architecture."],
  ["users", "Role-based access", "Permissions are intended to reflect church responsibilities and minimize unnecessary access."],
  ["shield", "Secure authentication", "Authentication controls will be documented before production onboarding; no unsupported mechanism is claimed here."],
  ["fileCheck", "Audit history", "Sensitive administrative activity should leave a useful, reviewable history."],
  ["archive", "Backup & recovery", "Daily backups, recovery objectives and restore testing require an approved operational policy."],
  ["building", "Hosting & ownership", "Hosting region, subprocessors, data ownership and export terms will be confirmed contractually."],
];
export default async function SecurityPage() { const page = await getPublicPage("security-compliance"); return <>
  <PageHero eyebrow="Security & compliance" title={page?.title ?? <>Trust begins with clear <em>responsibility.</em></>} description={page?.excerpt ?? "Church data can be deeply personal. Church Govern is intended to combine technical safeguards with accountable access, transparent practices and deliberate data stewardship."} aside={<div className="shield-visual"><SiteIcon name="shield" size={64} /><span>Safeguards</span><i>Governance</i><b>People</b></div>} />
  <CmsPageSections blocks={page?.blocks} />
  <section className="section trust-position"><div className="shell"><div className="notice-box notice-box--wide"><strong>Important implementation status</strong><p>This page explains design intentions from the approved website requirements. It is not a certification, legal opinion, data-processing agreement or claim that a production deployment has completed independent security testing. Final architecture, policies and legal documentation must be approved before launch.</p></div></div></section>
  <section className="section section--paper"><div className="shell"><SectionHeading eyebrow="Layered protection" title="Security is a system, not a single feature" description="The platform requirements identify complementary safeguards across identity, information, infrastructure and recovery." /><div className="safeguard-grid">{safeguards.map(([icon,title,text]) => <article key={title}><div className="icon-box"><SiteIcon name={icon} /></div><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>
  <section className="section"><div className="shell compliance-grid"><div><p className="eyebrow">DPDP readiness</p><h2>Support responsible handling in India</h2><p>The proposed product requirements include consent collection and withdrawal, purpose limitation, data minimization, secure storage and user-rights workflows.</p><ul className="plain-list"><li>Define the reason for collection</li><li>Capture and respect relevant consent</li><li>Limit information and access</li><li>Support correction and withdrawal processes</li></ul><small>Exact obligations depend on the organization, use case and applicable law.</small></div><div><p className="eyebrow">GDPR readiness</p><h2>Build privacy into the operating model</h2><p>The requirements identify privacy by design, transparent processing, consent management, access, erasure and portability as areas the system should support.</p><ul className="plain-list"><li>Document lawful processing</li><li>Provide clear privacy information</li><li>Respond to data-subject requests</li><li>Govern processors and transfers</li></ul><small>Product capability alone does not make an organization compliant.</small></div></div></section>
  <section className="section section--paper"><div className="shell responsibility-grid"><div><p className="eyebrow">Shared responsibility</p><h2>Technology and church governance work together.</h2></div><article><span>Church Govern provider</span><p>Secure engineering, platform operations, documented controls, incident processes and contractual commitments.</p></article><article><span>Church organization</span><p>Appropriate access decisions, accurate records, lawful use, staff practices and timely account management.</p></article></div></section>
  <CtaBand title="Bring security into the first conversation" text="Ask about the information you hold, the people who need access and the assurance documents required by your church." />
  </>; }

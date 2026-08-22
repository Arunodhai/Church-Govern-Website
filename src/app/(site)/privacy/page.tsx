import type { Metadata } from "next";
import { LegalPage } from "@/components/site/legal-page";
import { publicMetadata } from "@/components/seo/metadata";
export const metadata: Metadata = publicMetadata("/privacy", { title: "Privacy notice", description: "How the Church Govern marketing website handles enquiry information." });
export default function PrivacyPage() { return <LegalPage eyebrow="Website privacy" title="Privacy notice" status="Draft for legal and company review · 14 August 2026" intro="This draft explains the intended handling of information submitted through this marketing website. Controller identity, registered address, contact details, retention periods and subprocessors must be approved before production launch." sections={[
  ["Information we collect", "The enquiry forms may collect identity, contact, church, location, product-interest and record-assessment information that you choose to provide. Basic technical and analytics information may also be collected after an approved analytics and consent configuration is installed."],
  ["Why we use it", "Submitted information is intended to be used to respond to enquiries, prepare relevant demonstrations, assess digitization needs, improve website content and protect the service. It should not be repurposed incompatibly without appropriate notice or permission."],
  ["Sharing and storage", "Approved hosting providers, communication services and business processors may handle information only when configured and contractually governed. The final provider list, storage region and transfer safeguards are pending."],
  ["Retention", "Enquiry and analytics retention periods have not yet been approved. The production notice must state specific periods or the criteria used to determine them."],
  ["Your choices and rights", "Depending on applicable law, you may have rights to ask for access, correction, deletion, withdrawal of consent, grievance handling or other action. A verified privacy contact and request process must be added before launch."],
  ["Cookies and analytics", "Non-essential analytics and advertising tools should remain disabled until an approved cookie-consent approach is implemented. Google Analytics 4 and Meta Pixel are requirements, not currently asserted as active."],
  ["Contact", "The official privacy contact, postal address and grievance details are awaiting company approval. Until supplied, this draft must not be treated as the final statutory notice."],
]} />; }

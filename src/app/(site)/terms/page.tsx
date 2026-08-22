import type { Metadata } from "next";
import { LegalPage } from "@/components/site/legal-page";
import { publicMetadata } from "@/components/seo/metadata";
export const metadata: Metadata = publicMetadata("/terms", { title: "Website terms", description: "Draft terms for use of the Church Govern marketing website." });
export default function TermsPage() { return <LegalPage eyebrow="Website use" title="Website terms" status="Draft for legal and company review · 14 August 2026" intro="These draft terms are a launch checklist, not final legal terms. The contracting entity, governing law, jurisdiction and approved contact information must be supplied by the project owner and reviewed by counsel." sections={[
  ["About this website", "The website introduces Church Govern, publishes educational content and allows visitors to request information. It does not itself create a subscription, implementation agreement, service-level commitment or confirmed appointment."],
  ["Product information", "Descriptions represent intended capabilities and may change during product development, configuration or implementation. Security, compliance, availability, pricing and roadmap statements require final approved documentation."],
  ["Acceptable use", "Visitors should not misuse the website, attempt unauthorized access, interfere with operation, submit harmful material or use content in a way that violates applicable law or another person’s rights."],
  ["Educational content", "Articles and FAQs provide general information only and are not legal, accounting, financial, security or pastoral advice."],
  ["Intellectual property", "Final ownership, trademarks, permitted reuse and third-party asset notices are pending confirmation. Approved licensing language must replace this draft before launch."],
  ["External links", "Future links to related FamilyaConnect products and third-party websites may be provided for convenience. Their content and practices are governed separately."],
  ["Liability and governing law", "Any limitations, warranties, indemnities, governing law and dispute provisions require qualified legal review and are intentionally not invented in this draft."],
]} />; }

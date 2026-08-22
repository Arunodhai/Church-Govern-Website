import type { Metadata } from "next";
import { LegalPage } from "@/components/site/legal-page";
import { publicMetadata } from "@/components/seo/metadata";
export const metadata: Metadata = publicMetadata("/accessibility", { title: "Accessibility", description: "The accessibility approach and known status of the Church Govern website." });
export default function AccessibilityPage() { return <LegalPage eyebrow="Inclusive access" title="Accessibility statement" status="Working statement · target: WCAG 2.2 AA" intro="Church Govern aims to make this website understandable, navigable and useful across devices and assistive technologies. This statement describes the build target; a formal independent accessibility audit has not yet been completed." sections={[
  ["What has been considered", "The site uses semantic headings and landmarks, keyboard-operable navigation and disclosure controls, visible focus treatment, descriptive labels, status announcements, reduced-motion preferences and responsive layouts."],
  ["Content and contrast", "The design system targets readable type, sufficient contrast and meaningful text alternatives. Approved photography and product screenshots will require alternative text review when they are added."],
  ["Known limitations", "Third-party services, final CMS-authored content and future embedded media have not yet been evaluated. Form error handling should be re-tested with the production API and representative assistive technologies."],
  ["Feedback", "An approved accessibility contact method and response process must be published before launch. Visitors will be able to use the general contact form in the meantime once the enquiry service is configured."],
  ["Ongoing review", "Accessibility should be included in design review, content publishing, regression testing and procurement rather than treated as a one-time launch task."],
]} />; }

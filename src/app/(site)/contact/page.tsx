import type { Metadata } from "next";
import { EnquiryForm } from "@/components/site/enquiry-form";
import { CmsPageSections } from "@/components/site/cms-page-sections";
import { PageHero } from "@/components/site/page-hero";
import { SiteIcon } from "@/components/site/site-icon";
import { publicMetadata } from "@/components/seo/metadata";
import { getPublicPage } from "@/lib/content/repository";

export async function generateMetadata(): Promise<Metadata> { const page = await getPublicPage("contact"); return publicMetadata("/contact", { title: "Contact", description: "Request a Church Govern demonstration, digitization assessment or general conversation." }, page?.seo); }
export default async function ContactPage() { const page = await getPublicPage("contact"); return <>
  <PageHero eyebrow="Let’s talk" title={page?.title ?? <>Start with your church, <em>not a sales script.</em></>} description={page?.excerpt ?? "Choose the conversation that best fits your need. We’ll use the details only to prepare and respond."} aside={<div className="contact-steps"><span><b>01</b>Share useful context</span><span><b>02</b>We review your needs</span><span><b>03</b>Plan the right next step</span></div>} />
  <CmsPageSections blocks={page?.blocks} />
  <section className="section contact-nav"><div className="shell contact-card-row"><a href="#request-demo"><SiteIcon name="layout" /><strong>Product demonstration</strong><span>Explore relevant modules</span></a><a href="#digitization"><SiteIcon name="archive" /><strong>Digitization assessment</strong><span>Discuss records and handling</span></a><a href="#general-enquiry"><SiteIcon name="message" /><strong>General enquiry</strong><span>Ask anything else</span></a></div></section>
  <section className="section section--paper form-section" id="request-demo"><div className="shell form-shell"><aside><p className="eyebrow">Product conversation</p><h2>See the platform through your church’s priorities.</h2><p>We’ll prepare around the modules and responsibilities most relevant to your team. A submission is a request, not a confirmed appointment.</p><div className="privacy-mini"><SiteIcon name="shield" /><span><strong>Your details stay purposeful</strong>We collect only what is needed to respond and prepare.</span></div></aside><EnquiryForm kind="demo" /></div></section>
  <section className="section form-section" id="digitization"><div className="shell form-shell"><aside><p className="eyebrow">Record preservation</p><h2>Begin with a responsible assessment.</h2><p>Historical registers can be fragile and sensitive. This form helps us understand the first practical questions; it is not a handling or pricing commitment.</p></aside><EnquiryForm kind="digitization" /></div></section>
  <section className="section section--paper form-section" id="general-enquiry"><div className="shell form-shell"><aside><p className="eyebrow">General enquiries</p><h2>Not sure where to begin?</h2><p>Send the question in your own words. Approved phone, email and office details can be added here when supplied by the project owner.</p></aside><EnquiryForm kind="contact" /></div></section>
  </>; }

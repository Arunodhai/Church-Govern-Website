import type { Metadata } from "next";
import { ContactEnquiryTabs } from "@/components/site/contact-enquiry-tabs";
import { PageHero } from "@/components/site/page-hero";
import { publicMetadata } from "@/components/seo/metadata";
import { getPublicPage } from "@/lib/content/repository";

export async function generateMetadata(): Promise<Metadata> { const page = await getPublicPage("contact"); return publicMetadata("/contact", { title: "Contact", description: "Request a Church Govern demonstration, digitization assessment or general conversation." }, page?.seo); }
export default async function ContactPage() { const page = await getPublicPage("contact"); return <div className="contact-page">
  <PageHero eyebrow="Let’s talk" title={page?.title ?? <>Start with your church, <em>not a sales script.</em></>} description={page?.excerpt ?? "Choose the conversation that best fits your need. We’ll use the details only to prepare and respond."} aside={<div className="contact-steps"><span><b>01</b>Share useful context</span><span><b>02</b>We review your needs</span><span><b>03</b>Plan the right next step</span></div>} />
  <ContactEnquiryTabs />
  </div>; }

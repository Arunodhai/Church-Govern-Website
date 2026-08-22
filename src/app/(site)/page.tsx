import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Quote } from "lucide-react";
import { BlogCard } from "@/components/site/blog-card";
import { CtaBand } from "@/components/site/cta-band";
import { DemoHeroVisual } from "@/components/site/demo-hero-visual";
import { CmsPageSections } from "@/components/site/cms-page-sections";
import { MediaGallery } from "@/components/site/media-gallery";
import { SectionHeading } from "@/components/site/section-heading";
import { SiteIcon } from "@/components/site/site-icon";
import { JsonLd } from "@/components/seo/json-ld";
import { absoluteUrl, publicMetadata } from "@/components/seo/metadata";
import { getPublicBlogPosts, getPublicGalleries, getPublicPage, getPublicTestimonials, isMockContentEnabled } from "@/lib/content/repository";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPublicPage("home");
  return publicMetadata("/", { title: "Church administration, thoughtfully connected", description: "Bring church administration, clergy support and member connection into one thoughtful digital platform." }, page?.seo);
}

const challenges = [
  { audience: "Church offices", text: "Records, certificates, finances and communication often live across registers, spreadsheets and disconnected tools.", icon: "building" },
  { audience: "Clergy", text: "Administrative work competes with time for ministry, while pastoral context can be difficult to find when it matters.", icon: "church" },
  { audience: "Members", text: "Requests, updates and personal records still depend on office visits, phone calls and uncertain follow-up.", icon: "users" },
];

const pillars = [
  { number: "01", title: "Church administration", text: "Connect members, records, finances, events and communication through consistent workflows.", href: "/product", icon: "layout" },
  { number: "02", title: "Clergy enablement", text: "Make relevant church and member context easier to access, with permissions that respect responsibility.", href: "/product/church-dashboard", icon: "handshake" },
  { number: "03", title: "Member engagement", text: "Offer a considered self-service experience for updates, requests and church connection.", href: "/product/member-dashboard", icon: "users" },
];

export default async function HomePage() {
  const [blogPosts, testimonials, galleries, page] = await Promise.all([getPublicBlogPosts(), getPublicTestimonials(), getPublicGalleries(), getPublicPage("home")]);
  return (
    <>
      <JsonLd data={[{ "@context": "https://schema.org", "@type": "Organization", name: "Church Govern", url: absoluteUrl("/"), description: page?.excerpt ?? "A digital foundation for church administration and member connection." }, { "@context": "https://schema.org", "@type": "WebSite", name: "Church Govern", url: absoluteUrl("/") }]} />
      <section className="home-hero">
        <div className="shell home-hero__grid">
          <div className="home-hero__copy">
            <p className="eyebrow">Church administration, thoughtfully connected</p>
            <h1>{page?.title ?? <>More time for people.<br /><em>Less time on paperwork.</em></>}</h1>
            <p className="hero-lede">{page?.excerpt ?? "Church Govern brings everyday administration, trusted records and member services into one clear digital environment—so every team can focus on serving its community."}</p>
            <div className="button-row"><Link className="button" href="/contact#request-demo">Request a demonstration <ArrowRight aria-hidden="true" size={18} /></Link><Link className="button button--ghost" href="/product">Explore the platform</Link></div>
            <ul className="hero-trust"><li><Check aria-hidden="true" /> Denomination-neutral</li><li><Check aria-hidden="true" /> Role-aware by design</li><li><Check aria-hidden="true" /> Ready for phased adoption</li></ul>
          </div>
          {isMockContentEnabled ? <DemoHeroVisual /> : <div className="hero-visual" aria-label="Church community and connected administration">
            <div className="hero-community-photo">
              <Image src="/images/church-community-hero.jpg" alt="A diverse church community gathered in a bright sanctuary" fill priority sizes="(max-width: 980px) 90vw, 44vw" />
              <span><small>One shared foundation</small><strong>Church life, clearly organized</strong></span>
            </div>
            <div className="orbit-card orbit-card--one"><SiteIcon name="users" /><span><small>Community</small>Families connected</span></div>
            <div className="orbit-card orbit-card--two"><SiteIcon name="fileCheck" /><span><small>Services</small>Requests followed</span></div>
            <div className="orbit-card orbit-card--three"><SiteIcon name="shield" /><span><small>Trust</small>Access considered</span></div>
          </div>}
        </div>
      </section>
      <CmsPageSections blocks={page?.blocks} />

      <section className="section section--paper">
        <div className="shell">
          <SectionHeading eyebrow="One church. Many responsibilities." title={<>Administration should support ministry, <em>not compete with it.</em></>} description="Church life depends on people, context and care. Disconnected systems make that work harder for everyone." />
          <div className="challenge-grid">{challenges.map((item) => <article key={item.audience}><div className="icon-box"><SiteIcon name={item.icon} /></div><h3>{item.audience}</h3><p>{item.text}</p></article>)}</div>
        </div>
      </section>

      <section className="section pillars-section">
        <div className="shell">
          <SectionHeading eyebrow="One connected approach" title="Designed around the people a church serves" description="Three complementary pillars create a practical path from daily administration to meaningful member connection." />
          <div className="pillar-list">{pillars.map((pillar) => <article key={pillar.number}><span className="pillar-number">{pillar.number}</span><div className="icon-box icon-box--dark"><SiteIcon name={pillar.icon} /></div><div><h3>{pillar.title}</h3><p>{pillar.text}</p></div><Link href={pillar.href} aria-label={`Explore ${pillar.title}`}><ArrowRight aria-hidden="true" /></Link></article>)}</div>
        </div>
      </section>

      <section className="section proof-section">
        <div className="shell proof-grid">
          <div className="product-frame">
            <div className="product-frame__top"><span /><span /><span /><p>Church Govern workspace preview</p></div>
            <div className="product-frame__body"><aside><b>CG</b><i /><i /><i /><i /></aside><div><p>Good morning</p><h3>Your church at a glance</h3><div className="metric-row"><span><small>Open requests</small><strong>12</strong></span><span><small>Upcoming events</small><strong>04</strong></span><span><small>Records reviewed</small><strong>86%</strong></span></div><div className="chart-placeholder"><i /><i /><i /><i /><i /><i /></div><small className="placeholder-label">Illustrative interface · final product screens pending approval</small></div></div>
          </div>
          <div>
            <p className="eyebrow">A calmer way to work</p>
            <h2>Useful information, without the clutter</h2>
            <p className="lede">Church Govern is intended to give each authorized person a focused view of the work and information relevant to them.</p>
            <ul className="check-list"><li><Check aria-hidden="true" />Connected family and church records</li><li><Check aria-hidden="true" />Trackable requests and administrative work</li><li><Check aria-hidden="true" />Member-facing self-service capabilities</li><li><Check aria-hidden="true" />Reporting from consistent source information</li></ul>
            <Link className="text-link" href="/product">View all platform modules <ArrowRight aria-hidden="true" size={18} /></Link>
          </div>
        </div>
      </section>

      <section className="section trust-strip">
        <div className="shell trust-strip__grid"><div><p className="eyebrow eyebrow--light">Trust has to be designed in</p><h2>Security and privacy are not finishing touches.</h2></div><div className="trust-points"><span><SiteIcon name="lock" /> Role-aware access</span><span><SiteIcon name="archive" /> Backup-ready architecture</span><span><SiteIcon name="shield" /> Privacy-conscious workflows</span><span><SiteIcon name="fileCheck" /> Traceable activity</span></div><Link className="button button--light" href="/security-compliance">Explore our trust approach</Link></div>
      </section>

      <section className="section testimonial-section">
        {testimonials.length ? <div className="shell testimonial-list">{testimonials.map((testimonial) => <figure className="testimonial-card" key={testimonial.id}>{testimonial.image ? <Image className="testimonial-card__image" src={testimonial.image.url} alt={testimonial.image.alt} width={testimonial.image.width ?? 84} height={testimonial.image.height ?? 84} /> : <Quote aria-hidden="true" />}<blockquote>“{testimonial.quote}”</blockquote><figcaption><strong>{testimonial.name}</strong><span>{[testimonial.designation, testimonial.churchName].filter(Boolean).join(" · ")}</span></figcaption></figure>)}</div> : <div className="shell testimonial-card"><Quote aria-hidden="true" /><blockquote>Approved customer testimonials will appear here after implementation partners provide consent and verified attribution.</blockquote><p><strong>Testimonial pending</strong><span>No customer endorsement is being claimed</span></p></div>}
      </section>

      {galleries.map((gallery) => gallery.items.length ? <section className="section section--paper" key={gallery.id}><div className="shell"><div className="section-heading-row"><div><p className="eyebrow">Community gallery</p><h2>{gallery.name}</h2>{gallery.description ? <p className="lede">{gallery.description}</p> : null}</div></div><MediaGallery title={gallery.name} items={gallery.items} /></div></section> : null)}

      <section className="section section--paper">
        <div className="shell">
          <div className="section-heading-row"><SectionHeading eyebrow="Ideas for healthier operations" title="Practical thinking for modern churches" description="Explore responsible approaches to records, administration, technology and community." /><Link className="text-link" href="/blogs">All insights <ArrowRight aria-hidden="true" size={18} /></Link></div>
          {blogPosts.length ? <div className="blog-grid blog-grid--home">{blogPosts.slice(0, 4).map((post) => <BlogCard key={post.slug} post={post} />)}</div> : <div className="empty-state" role="status"><h2>Insights are being prepared</h2><p>No approved articles are published yet.</p></div>}
        </div>
      </section>
      <CtaBand />
    </>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Quote } from "lucide-react";
import { BlogCard } from "@/components/site/blog-card";
import { CtaBand } from "@/components/site/cta-band";
import { HomeMotion } from "@/components/site/home-motion";
import { MediaGallery } from "@/components/site/media-gallery";
import { SiteIcon } from "@/components/site/site-icon";
import { JsonLd } from "@/components/seo/json-ld";
import { absoluteUrl, publicMetadata } from "@/components/seo/metadata";
import { getPublicBlogPosts, getPublicGalleries, getPublicPage, getPublicTestimonials } from "@/lib/content/repository";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPublicPage("home");
  return publicMetadata(
    "/",
    {
      title: "Church administration, thoughtfully connected",
      description: "Bring church administration, clergy support and member connection into one thoughtful digital platform.",
    },
    page?.seo,
  );
}

const challenges = [
  { audience: "Church offices", text: "Records, certificates, finances and communication often live across registers, spreadsheets and disconnected tools.", icon: "building" },
  { audience: "Clergy", text: "Administrative work competes with time for ministry, while pastoral context can be difficult to find when it matters.", icon: "church" },
  { audience: "Members", text: "Requests, updates and personal records still depend on office visits, phone calls and uncertain follow-up.", icon: "users" },
] as const;

const pillars = [
  { title: "Church administration", text: "Connect members, records, finances, events and communication through consistent workflows.", href: "/product", icon: "layout" },
  { title: "Clergy enablement", text: "Make relevant church and member context easier to access, with permissions that respect responsibility.", href: "/product/church-dashboard", icon: "handshake" },
  { title: "Member engagement", text: "Offer a considered self-service experience for updates, requests and church connection.", href: "/product/member-dashboard", icon: "users" },
] as const;

export default async function HomePage() {
  const [blogPosts, testimonials, galleries, page] = await Promise.all([
    getPublicBlogPosts(),
    getPublicTestimonials(),
    getPublicGalleries(),
    getPublicPage("home"),
  ]);
  const heroTitle = page?.title ?? "More time for people. Less time on paperwork.";
  const heroTitleBreak = heroTitle.indexOf(". ");

  return (
    <div className="home-page">
      {/* One @graph rather than a top-level array: both are valid structured
          data, but the single shared @context is the form consumers expect. */}
      <JsonLd data={{
        "@context": "https://schema.org",
        "@graph": [
          { "@type": "Organization", name: "Church Govern", url: absoluteUrl("/"), description: page?.excerpt ?? "A digital foundation for church administration and member connection." },
          { "@type": "WebSite", name: "Church Govern", url: absoluteUrl("/") },
        ],
      }} />
      <HomeMotion />

      <section className="home-hero">
        <div className="shell home-hero__grid">
          <div className="home-hero__copy">
            <h1>{heroTitleBreak > -1 ? <>
              <span>{heroTitle.slice(0, heroTitleBreak + 1)}</span>
              <span className="home-hero__title-secondary">{heroTitle.slice(heroTitleBreak + 2)}</span>
            </> : heroTitle}</h1>
            <p className="hero-lede">{page?.excerpt ?? "Church Govern brings everyday administration, trusted records and member services into one clear digital environment—so every team can focus on serving its community."}</p>
            <div className="button-row">
              <Link className="button" href="/contact#request-demo">Request a demonstration <ArrowRight aria-hidden="true" size={18} /></Link>
              <Link className="button button--ghost" href="/product">Explore the platform</Link>
            </div>
            <div className="home-hero__context"><span aria-hidden="true" />Church administration, thoughtfully connected</div>
            <ul className="hero-trust">
              <li><Check aria-hidden="true" />Denomination-neutral</li>
              <li><Check aria-hidden="true" />Role-aware by design</li>
              <li><Check aria-hidden="true" />Ready for phased adoption</li>
            </ul>
          </div>

          <div className="home-hero__media">
            {/* Owner-supplied provisional artwork; replace with a client-approved asset before production. */}
            <div className="home-hero__art">
              <Image
                src="/images/church-govern-main-hero.png"
                alt="Church administrators and clergy reviewing digital church information together"
                fill
                preload
                sizes="(max-width: 760px) 100vw, 1200px"
              />
            </div>
            <div className="home-hero__suite-line" aria-label="Connected product suites">
              <span>Office Suite</span><i aria-hidden="true" /><strong>One shared foundation</strong><i aria-hidden="true" /><span>Member Suite</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section home-responsibilities">
        <div className="shell home-responsibilities__layout">
          <header data-reveal-group>
            <h2>Administration should support ministry, <em>not compete with it.</em></h2>
            <p>Church life depends on people, context and care. Disconnected systems make that work harder for everyone.</p>
            <span>One church. Many responsibilities.</span>
          </header>
          <div className="home-responsibilities__list" data-reveal-group>
            {challenges.map((item) => (
              <article key={item.audience}>
                <div className="home-responsibilities__icon"><SiteIcon name={item.icon} /></div>
                <h3>{item.audience}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section home-foundation">
        <div className="shell home-foundation__layout">
          <header data-reveal-group>
            <div><h2>Designed around the people a church serves</h2><span>One connected approach</span></div>
            <p>Three complementary pillars create a practical path from daily administration to meaningful member connection.</p>
          </header>
          <div className="home-foundation__list" data-reveal-group>
            {pillars.map((pillar) => (
              <article key={pillar.title}>
                <div className="home-foundation__icon"><SiteIcon name={pillar.icon} /></div>
                <div><h3>{pillar.title}</h3><p>{pillar.text}</p></div>
                <Link href={pillar.href} aria-label={`Explore ${pillar.title}`}><ArrowRight aria-hidden="true" /></Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section home-proof">
        <div className="shell home-proof__layout">
          <div className="home-proof__copy" data-reveal-group>
            <h2>Useful information, without the clutter</h2>
            <p className="lede">Church Govern is intended to give each authorized person a focused view of the work and information relevant to them.</p>
            <span>A calmer way to work</span>
            <ul>
              <li><Check aria-hidden="true" />Connected family and church records</li>
              <li><Check aria-hidden="true" />Trackable requests and administrative work</li>
              <li><Check aria-hidden="true" />Member-facing self-service capabilities</li>
              <li><Check aria-hidden="true" />Reporting from consistent source information</li>
            </ul>
            <Link className="text-link" href="/product">View all platform modules <ArrowRight aria-hidden="true" size={18} /></Link>
          </div>

          <div className="product-frame" data-reveal>
            <div className="product-frame__top"><span /><span /><span /><p>Church Govern workspace preview</p></div>
            <div className="product-frame__body">
              <aside><b>CG</b><i /><i /><i /><i /></aside>
              <div>
                <p>Good morning</p>
                <h3>Your church at a glance</h3>
                <div className="metric-row">
                  <span><small>Open requests</small><strong>12</strong></span>
                  <span><small>Upcoming events</small><strong>04</strong></span>
                  <span><small>Records reviewed</small><strong>86%</strong></span>
                </div>
                <div className="chart-placeholder"><i /><i /><i /><i /><i /><i /></div>
                <small className="placeholder-label">Illustrative interface · final product screens pending approval</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section home-trust">
        <div className="shell home-trust__layout" data-reveal-group>
          <div><h2>Security and privacy are not finishing touches.</h2><span>Trust has to be designed in</span></div>
          <div className="home-trust__points">
            <span><SiteIcon name="lock" />Role-aware access</span>
            <span><SiteIcon name="archive" />Backup-ready architecture</span>
            <span><SiteIcon name="shield" />Privacy-conscious workflows</span>
            <span><SiteIcon name="fileCheck" />Traceable activity</span>
          </div>
          <Link className="button" href="/security-compliance">Explore our trust approach</Link>
        </div>
      </section>

      <section className="section home-testimonials">
        {testimonials.length ? (
          <div className="shell testimonial-list" data-reveal-group>
            {testimonials.map((testimonial) => (
              <figure className="testimonial-card" key={testimonial.id}>
                {testimonial.image ? <Image className="testimonial-card__image" src={testimonial.image.url} alt={testimonial.image.alt} width={testimonial.image.width ?? 84} height={testimonial.image.height ?? 84} /> : <Quote aria-hidden="true" />}
                <blockquote>“{testimonial.quote}”</blockquote>
                <figcaption><strong>{testimonial.name}</strong><span>{[testimonial.designation, testimonial.churchName].filter(Boolean).join(" · ")}</span></figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <div className="shell home-testimonials__pending" data-reveal-group>
            <Quote aria-hidden="true" />
            <blockquote>Approved customer testimonials will appear here after implementation partners provide consent and verified attribution.</blockquote>
            <p><strong>Testimonial pending</strong><span>No customer endorsement is being claimed</span></p>
          </div>
        )}
      </section>

      {galleries.map((gallery) => gallery.items.length ? (
        <section className="section home-gallery" key={gallery.id}>
          <div className="shell">
            <div className="home-section-heading" data-reveal-group><div><h2>{gallery.name}</h2>{gallery.description ? <p>{gallery.description}</p> : null}</div><span>Community gallery</span></div>
            <MediaGallery title={gallery.name} items={gallery.items} />
          </div>
        </section>
      ) : null)}

      <section className="section home-insights">
        <div className="shell">
          <div className="home-insights__heading" data-reveal-group>
            <div className="home-insights__index"><span>Insights</span><strong>{String(Math.min(blogPosts.length, 4)).padStart(2, "0")}</strong></div>
            <h2>Practical thinking for modern churches</h2>
            <div><p>Explore responsible approaches to records, administration, technology and community.</p><Link className="text-link" href="/blogs">All insights <ArrowRight aria-hidden="true" size={18} /></Link></div>
          </div>
          {blogPosts.length ? <div className="blog-grid blog-grid--home" data-reveal-group>{blogPosts.slice(0, 4).map((post) => <BlogCard key={post.slug} post={post} />)}</div> : <div className="empty-state" role="status"><h2>Insights are being prepared</h2><p>No approved articles are published yet.</p></div>}
        </div>
      </section>

      <div className="home-outro" data-reveal>
        <CtaBand />
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { CtaBand } from "@/components/site/cta-band";
import { CmsPageSections } from "@/components/site/cms-page-sections";
import { SiteIcon } from "@/components/site/site-icon";
import { publicMetadata } from "@/components/seo/metadata";
import { getPublicPage } from "@/lib/content/repository";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPublicPage("about");
  return publicMetadata(
    "/about",
    {
      title: "About",
      description: "Why Church Govern is being built and the principles guiding the platform.",
    },
    page?.seo,
  );
}

const principles = [
  ["handshake", "Human first", "Every workflow should make work clearer for clergy, staff, volunteers or members."],
  ["shield", "Trustworthy by design", "Access, privacy and continuity should be considered before information is collected."],
  ["sparkle", "Simple without being shallow", "Powerful capability should arrive through calm, understandable experiences."],
  ["network", "Ready to grow", "Churches should be able to begin deliberately and expand as their needs mature."],
] as const;

const relatedProducts = ["FamNme", "Purvaj Tablet", "Purvaj.com"];

export default async function AboutPage() {
  const page = await getPublicPage("about");

  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="shell about-hero__grid">
          <div className="about-hero__copy">
            <h1>{page?.title ?? <>Technology should strengthen the work that <em>already matters.</em></>}</h1>
            <p>{page?.excerpt ?? "Church Govern is being shaped as a dependable digital foundation for churches—one that respects community, continuity and responsible stewardship."}</p>
            <div className="about-hero__context" aria-label="Page context"><span aria-hidden="true" />About Church Govern</div>
          </div>
          <figure className="about-principle">
            <figcaption>Our guiding idea</figcaption>
            <blockquote>“Simplify the administration around ministry, without simplifying the people it serves.”</blockquote>
            <span aria-hidden="true"><SiteIcon name="sparkle" size={24} /></span>
          </figure>
        </div>
      </section>

      <div className="about-cms"><CmsPageSections blocks={page?.blocks} /></div>

      <section className="section about-purpose">
        <div className="shell about-purpose__grid">
          <div className="about-purpose__heading">
            <span>Our purpose</span>
            <h2>Make church operations easier to understand, manage and sustain.</h2>
          </div>
          <div className="about-purpose__copy">
            <p>Churches hold generations of history while coordinating active communities every day. Important work can become fragmented across physical registers, spreadsheets, personal inboxes and isolated applications.</p>
            <p>Church Govern is intended to create a more connected way forward: centralizing relevant information, guiding recurring work and offering considered member services while keeping human responsibility at the center.</p>
          </div>
        </div>
      </section>

      <section className="section about-principles">
        <div className="shell about-principles__layout">
          <header>
            <span>What guides the product</span>
            <h2>Built around enduring principles</h2>
            <p>Every product decision should support careful administration without losing sight of the people and communities behind the work.</p>
          </header>
          <div className="about-principles__list">
            {principles.map(([icon, title, text]) => (
              <article key={title}>
                <div className="about-principles__icon"><SiteIcon name={icon} /></div>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section about-partner">
        <div className="shell about-partner__grid">
          <div className="about-partner__identity" aria-label="FamilyaConnect identity placeholder">
            <span>F</span>
            <div><strong>FamilyaConnect</strong><small>Company identity placeholder</small></div>
          </div>
          <div className="about-partner__copy">
            <div className="about-section-intro"><span>The organization behind the platform</span><h2>FamilyaConnect</h2></div>
            <p>Church Govern has been proposed as a FamilyaConnect initiative, drawing on broader community-technology and digitization experience. Final company history, mission, vision, relationship to SBL, years of experience and approved credentials have not yet been supplied.</p>
            <div className="about-approval-note">
              <SiteIcon name="shield" size={22} />
              <div><strong>Content awaiting approval</strong><p>This page deliberately avoids unsupported experience, customer, scale and compliance claims. Approved corporate copy and links can be added through the CMS.</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="about-records">
        <div className="shell about-records__grid">
          <div className="about-records__image">
            <Image src="/images/records-digitization.jpg" alt="A specialist carefully reviewing historical church records for digitization" fill loading="eager" sizes="(max-width: 980px) 100vw, 54vw" unoptimized />
          </div>
          <div className="about-records__copy">
            <span>Preserving what cannot be replaced</span>
            <h2>Digitization begins with careful handling.</h2>
            <p>Historical church records carry personal, pastoral and community history. The proposed assessment begins with record condition, volume, format, location and access—before any handling commitment is made.</p>
            <Link className="button" href="/contact#digitization">Request an assessment <ArrowRight size={18} /></Link>
          </div>
        </div>
      </section>

      <section className="section about-related">
        <div className="shell about-related__layout">
          <header>
            <span>A wider community focus</span>
            <h2>Related products</h2>
            <p>The requirements identify three related products. Approved descriptions, brand assets and destination links are still required.</p>
          </header>
          <div className="about-related__list">
            {relatedProducts.map((name) => (
              <article key={name}>
                <div><h3>{name}</h3><p>Verified product summary and external link pending from FamilyaConnect.</p></div>
                <span>Destination pending</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section about-outlook">
        <div className="shell about-outlook__grid">
          <article>
            <SiteIcon name="map" size={26} />
            <div><span>Mission</span><h2>Approved mission statement pending.</h2><p>The CMS is ready for the final company language when supplied.</p></div>
          </article>
          <article>
            <SiteIcon name="sparkle" size={26} />
            <div><span>Vision</span><h2>Approved vision statement pending.</h2><p>No placeholder claim will be presented as an official commitment.</p></div>
          </article>
          <div className="about-outlook__community">
            <div><span>Our focus</span><h2>Why focus on community?</h2></div>
            <div>
              <ul>
                <li><Check />Community records need long-term continuity</li>
                <li><Check />Local teams need technology that respects context</li>
                <li><Check />Engagement works best when administration is dependable</li>
              </ul>
              <Link className="text-link" href="/product">Explore the platform <ArrowRight size={18} /></Link>
            </div>
          </div>
        </div>
      </section>

      <CtaBand title="Help shape a more useful demonstration" text="Share your church’s current processes, priorities and questions. We’ll use that context to focus the conversation." />
    </div>
  );
}

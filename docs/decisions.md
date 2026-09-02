# Decisions and open questions

## Confirmed for implementation

| Decision | Status | Consequence |
| --- | --- | --- |
| Next.js App Router and TypeScript | Confirmed | Follow the installed Next.js 16 documentation and Server Component defaults. |
| Sanity editorial CMS and Assets | Confirmed, revised proposal | `/studio` replaces the custom content CMS; Sanity owns editorial content/media and editor access. |
| Supabase operational data/auth | Confirmed, narrowed | Supabase stores leads, engagement, moderation, audit, and analytics; RLS remains mandatory. `/admin` is operational only. |
| Resend transactional email | Confirmed, revised proposal | Notify after successful persistence; secrets remain server-only and failure must not lose the lead. |
| Hostinger Web Apps deployment | Confirmed, revised proposal | Use a Node.js 22 Next.js server and platform-neutral environment controls for production; Vercel is temporary Preview infrastructure only. |
| Complete requirements are launch scope | Confirmed | Comments, ratings, topic moderation, gallery, all 17 module pages, and custom admin analytics must be implemented and accepted. |
| Truthful placeholder policy | Confirmed | Unapproved claims/assets are tracked and blocked from production. |

“Confirmed” here reflects the current engineering direction supplied to the build team. Business scope and third-party account ownership still require client sign-off.

## Blocking or material client decisions

| Topic | Question | Safe state until answered |
| --- | --- | --- |
| Feature behavior | What are the approved identity, moderation, retention, metric-source, gallery placement, and hero-media rules for the required launch features? | Implement secure conservative behavior and keep the question visible; do not remove the feature. |
| Sitemap | Is Contact a page/form, and are Security/Compliance standalone pages or Product sections? | Keep routing/content model adaptable; avoid duplicate public URLs. |
| CMS workflow | Which roles can draft, publish, manage media/SEO, read/export leads, and manage users? | Least privilege; no broad editor access. |
| Content/assets | Who supplies and approves branding, mission/vision, product claims, screenshots, testimonials, imagery, blogs, FAQs, and external links? | Staging-only structural placeholders. |
| Forms | Exact field options, consent wording, recipients, acknowledgement, CRM, retention, and response SLA? | Validate/persist only approved fields; no live notifications. |
| Comments/ratings | Anonymous or authenticated, moderation owner, one-vote rule, anti-spam, edit/delete, retention? | Required for launch; default-deny privileged data/actions and require moderation while awaiting final policy. |
| Analytics/privacy | Jurisdictions, cookie/consent approach, GA4/GSC ownership, optional Meta Pixel, query analytics privacy? | Essential-only behavior; optional tracking disabled. |
| Hosting/operations | Account owners, regions, domains, environments, plan/budget, uptime, backups, RPO/RTO, monitoring? | No production readiness claim. |
| Quality targets | WCAG level, performance budgets, browsers/devices, launch date, acceptance owner? | Recommend WCAG 2.2 AA and current major browsers, but mark unapproved. |
| Language | English only, localization roadmap, and denomination-sensitive terminology? | English, denomination-neutral provisional content only. |

## Architecture revision — 2026-08-21

The client-approved proposal supersedes the old Supabase-content/Vercel decisions. Legacy content tables and Storage records remain for rollback/reference, but new editorial work belongs in Sanity. Comments and ratings use a stable Sanity blog slug in Supabase. SBL owns the paid production accounts and grants developer access.

## Stakeholder Preview deployment — 2026-08-22

The owner approved Vercel for immediate testing while Hostinger remains the proposal production target. The Vercel environment is `APP_ENV=staging`, uses clearly labelled provisional editorial data, uses live Supabase operational writes, and is blocked from indexing through metadata and robots. It must not be promoted to production or have indexing enabled until the content and release gates pass.

## Public visual system — 2026-08-22

The owner rejected the initial mint/blush/green direction and requested a maximum-white, modern public website without green or pink tint. The replacement uses a pure-white canvas, cool neutral structural surfaces, charcoal typography and actions, and a restrained cobalt accent limited to interaction, focus and small navigational signals. Floating hero labels, oversized display typography and colored decorative geometry were removed. Public rules remain scoped beneath `.public-site` so the operational admin console cannot inherit marketing typography or surfaces. No business claims, testimonials or client assets were introduced as part of the redesign.

Product and Contact received interaction changes as part of the usability redesign: only one product suite and one enquiry intent are shown at a time, with direct URL hashes retained. This reduces page length without removing modules, form fields, validation or operational behavior.

### Institutional polish

The code-first polish retains the approved pure-white public system and existing information architecture. The bright cobalt interaction color was quieted to a muted institutional blue, supporting copy contrast was strengthened, and repeated card/CTA radii were reduced so the interface reads as an established church-administration product rather than a generic startup template. Provisional CMS page notes now use editorial rules instead of standalone rounded cards. No copy, routes, integrations, data behavior, or claims changed.

### Operations-console polish

The `/admin` console remains an isolated operational surface with its own denser hierarchy. Its legacy emerald/mint accents were replaced with the shared muted institutional blue, while the dark navigation rail, role-aware routes and workflow semantics were retained. Metrics use compact divided bands, status labels use conservative semantic colors, and mobile controls meet the 44px target without changing Supabase authorization, persistence, moderation or audit behavior.

### Owner-approved reference palette

The owner subsequently supplied a dashboard reference and explicitly selected its chartreuse, mint, white, cool-gray and black palette over the interim blue, pink and orange directions. The public site remains white-first: chartreuse is concentrated in primary actions, selection and one CTA surface; mint supports icons, data and secondary emphasis; near-black remains typography and small product-screen structure. The operational console follows the reference more directly with a near-black navigation rail, chartreuse active states and actions, white cards, cool-gray canvas and mint analytics. This visual-only decision does not change content, routes, information architecture, integrations or behavior.

The owner then approved the homepage gradient trial for the remaining public routes. The shared gradient vocabulary is deliberately limited to primary actions, light hero atmospheres, selected tabs/FAQ states, dark trust/security transitions, testimonial washes and final CTA bands. It does not apply gradient text, change semantic status colors, or enter the isolated admin console.

### About-page editorial composition

The `/about` route now uses an editorial institutional narrative instead of the shared same-size card pattern. The change is route-scoped, preserves the approved and provisional copy exactly, retains CMS page sections and existing destinations, and keeps unresolved FamilyaConnect, product, mission and vision material visibly provisional. It adds no factual claims. The historical-records image is loaded eagerly without optimization because the offset wide-screen composition left the optimized lazy image blank during local browser verification.

### Homepage connected institutional narrative

The `/` route now presents Church Govern as one connected administration platform rather than a sequence of interchangeable SaaS cards. The statement-first hero, Office/Member suite bridge, ruled responsibility and foundation indexes, product proof, trust boundary, editorial testimonial treatment and asymmetrical insight grid establish hierarchy without changing the approved content model, structured data, routes or integrations. The visual decision is route-scoped and introduces no new business, customer, security or compliance claim. Provisional testimonials remain visibly labelled development data until consented client material is supplied.

The Product, Blogs, FAQ and Contact routes use one shared visual system but no longer share one generic composition. Product prioritizes suite and module exploration, Blogs establishes a featured-story reading hierarchy, FAQ uses persistent topic navigation with live counts, and Contact presents one enquiry intent and form at a time. These route-scoped changes preserve approved content, CMS and operational boundaries, metadata, structured data, routes, hashes, validation and API behavior; they introduce no new factual claims.

### Owner-selected homepage hero artwork

The owner selected `main img.png` for the `/` hero. Because the asset is a wide composition with purposeful negative space, it is rendered as a true viewport-wide background immediately beneath the header rather than inside a centered card or the previous square carousel. On desktop the artwork is shifted 7% right and transitions from a solid-white reading field into the photograph, keeping copy separate from charts and people. Tablet and mobile layouts reset that shift, stack the copy and use a full-width crop toward the people on the right. This owner-selected asset supersedes the current homepage rotation but remains provisional until client approval, and it introduces no new textual claim.

### Homepage hero hierarchy polish

The homepage retains the exact CMS-managed hero title, but when that title contains a two-sentence boundary the renderer presents each sentence as a block span. The first sentence carries the primary typographic weight and the second uses a quieter weight, creating editorial hierarchy without duplicating or rewriting content. Supporting copy, actions, context and trust points follow the same restrained reading sequence; this remains route-scoped and does not alter destinations, integrations or responsive media behavior.

The Office Suite / shared foundation / Member Suite relationship is treated as a caption for the hero artwork, not as overlaid image text. A solid white rail at the artwork's lower edge provides stable contrast and reinforces the left editorial plane on desktop; below 980px it follows the image as a full-width rail rather than competing with the mobile photograph. The three trust statements use one distributed desktop row and revert to a vertical list on phones.

The desktop hero deliberately leaves the global content shell and uses a 56/44 viewport split as its primary compositional axis. The 520px maximum copy block is centered inside the wider editorial plane with equal left and right gutters that respond to available width; the image remains visually dominant on the right while the suite rail anchors the editorial side. The wider measure, more open headline leading and stronger inter-sentence spacing prevent the mathematically balanced layout from feeling congested. Below 980px the page returns to the standard responsive shell and stacked reading order.

### Homepage motion approach — 2026-08-25

Motion on `/` is built from CSS keyframes and transitions plus one small `IntersectionObserver` controller (`src/components/site/home-motion.tsx`). No animation library was added, so the change costs no client dependency and no bundle growth beyond that component.

Motion is opt-in from the client rather than baked into the markup. The server renders the page with no hidden state, so a visitor without JavaScript sees the complete page; the controller sets `data-motion` on `.home-page` in the same synchronous block that hides the pending sections, and only attaches transitions a frame later so the hidden state never reads as a fade-out. Every rule lives inside `@media (prefers-reduced-motion: no-preference)`, which means reduced-motion visitors are left on the fully visible path by default rather than being animated and then corrected.

Arming waits for `window.load` and `document.fonts.ready`. Measuring the fold earlier, during hydration, classified sections far down the page as already on screen while layout was still settling, and those sections then never animated. Waiting costs a brief window in which the page is simply complete, which is the correct failure mode.

Travel is deliberately small — a 15px rise over 640ms with a 70ms stagger between grouped children — and each section reveals once. The hero is the only orchestrated load sequence; the rest of the page reveals on scroll. Hover and focus motion is confined to genuinely interactive elements. No content, copy, route, structured-data entry or CTA destination changed.

## Development demo policy — 2026-08-21

Until the client supplies and approves production content and assets, local development uses an explicit mock mode to demonstrate the complete proposed experience. Mock mode includes editorial content, module UI concepts, engagement, lead submissions, topic suggestions, admin records, workflows, and analytics. Every mock surface is labelled, operational writes are screen-only, and no submitted personal information is stored or emailed. The guard is disabled unconditionally in production; this demo data is not a production fallback.

## Implemented conservative defaults — 2026-08-14, retained where applicable

- Public comments are anonymous by name/email, pre-moderated, rate-limited, and publish no email address.
- Ratings use a one-to-five scale, a server-generated browser fingerprint, and rate limiting.
- Public content is read from Sanity and filtered to approved/published records; operational data remains behind Supabase server/RLS boundaries.
- Sanity manages content assets and editorial roles; Supabase Storage content workflows are legacy.
- Canonical editors accept either a site-relative path or a complete URL; rendered metadata normalizes these against `NEXT_PUBLIC_SITE_URL`.
- Source content fallback is development-only and covers modules, blogs, FAQs, and navigation. Empty testimonials/galleries stay empty.

## How to record a decision

Add a dated row or short section with the decision, owner/approver, affected routes/data/integrations, and follow-up work. Do not overwrite historical decisions without documenting why they changed.

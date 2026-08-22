# Requirements-to-demo matrix

Last reconciled: 2026-08-21.

This document separates what can be demonstrated now from what still requires client-approved material or production accounts. All current mock content and operational records are labelled development data and are blocked from production.

| Requirement area | Demo available now | Needed before staging/production |
| --- | --- | --- |
| Home | Responsive page, rotating development imagery with pause/reduced-motion behavior, introduction, challenge narrative, three product pillars, labelled testimonials, gallery/lightbox, and four recent blogs | Approved hero media, company copy, consented testimonials, and licensed gallery assets |
| About | Company/mission/vision/experience/digitization content structure and related-product presentation | Approved SBL/Church Govern/Familya relationship, history, mission, vision, and product links |
| Product overview | Office and Member suites with all 17 module routes, security/trust narrative, and demo/digitization CTAs | Approved feature wording, legal/security review, final suite positioning, and product assets |
| Module details | Banner, overview, benefits, features, workflow, two labelled UI concepts, two scoped FAQs, related modules, and CTA for every module | Genuine product screenshots, validated workflows/permissions, and approved module copy |
| Blogs | Search, category filtering, six article details, thumbnails, recent/popular presentation, ratings, comments, and topic suggestion flow | Approved articles (maximum 2,000 words), authors, thumbnails/inline images, moderation/retention rules, and final categories |
| FAQs | Ten global and 34 module-specific questions render in their correct contexts | Client-reviewed answers and support/implementation policy |
| Forms and leads | Demo, digitization, contact, and topic forms validate and show realistic confirmation/reference states without storing or emailing personal data | Approved fields/consent/retention/SLA, Supabase migration/RLS verification, Resend domain and recipients, and anti-spam decision |
| Comments and ratings | Public interaction states plus representative moderation records; writes are simulated locally | Applied engagement migration, abuse controls, identity/one-vote policy, moderation ownership, privacy and retention approval |
| Editorial CMS | Connected hosted Sanity Studio, structured schemas, provisional 51-document seed, SEO fields, navigation/footer, assets/galleries, and publication approval fields | Client/SBL-owned project, approved records/media, editor roles, private-dataset access decision, MFA/offboarding process |
| Operational admin | Responsive dashboard, lead queues/details, notes/status workflow, comment/topic moderation, audit records, and dedicated illustrative analytics | Live Supabase data, final role matrix, authenticated RLS test, export/retention policy, and production operator acceptance |
| SEO/discovery | Canonical/metadata models, structured data, sitemap, robots, blog/module routing, and Sanity SEO editors | Final domain, approved metadata/canonicals, GA4 and Search Console properties, consent verification |
| Accessibility/responsiveness | Semantic structure, keyboard-oriented interactions, visible focus, reduced-motion support, responsive layouts, and representative 390×844 overflow checks | Formal WCAG target/acceptance owner, screen-reader audit, full keyboard audit, device/browser matrix, performance budget |
| Hosting/operations | Hostinger Node.js runbook, health route, environment separation, and local production build path | SBL-owned Hostinger/domain/accounts, staging deployment, DNS/SSL, backups, monitoring, rollback and incident ownership |

## Demo safety boundary

- `USE_MOCK_CONTENT=true` is development-only. `NODE_ENV=production` disables it regardless of the flag.
- Mock submissions do not persist personal data and do not send email.
- Dashboard mutations are screen-only and reset on reload.
- UI concepts are not represented as genuine product screenshots.
- Testimonials are not represented as real endorsements.
- Security, privacy, DPDP and GDPR content is demonstrative structure, not a certification or legal claim.

## Suggested stakeholder walkthrough

1. Start at `/` and show the responsive hero, product pillars, testimonials, gallery, and recent blogs.
2. Open `/product`, then one Office and one Member module to show the repeatable 17-module detail pattern.
3. Open `/blogs`, search/filter, read an article, and demonstrate ratings/comments/topic suggestion behavior.
4. Complete a form on `/contact` and point out the safe demo confirmation message.
5. Open `/admin` and review leads, moderation, audit, and `/admin/manage/analytics`.
6. Open `/studio` to show the connected Sanity editorial workspace boundary.
7. Record every requested content, asset, workflow, legal, and account change before disabling mock mode.

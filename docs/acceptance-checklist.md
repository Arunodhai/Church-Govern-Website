# Acceptance checklist

This is an evidence record, not a promise. Leave an item unchecked until it has been verified in the named environment. Add the date, environment/URL, command or test, and reviewer next to completed items.

## Scope and content

- [ ] Complete launch scope and sitemap are approved; all required features have an acceptance owner.
- [ ] Contact-page behavior is approved.
- [ ] Security/Compliance placement is approved.
- [ ] All launch copy, module descriptions, company claims, and external links are owner-approved.
- [ ] Product security, DPDP, GDPR, backup, hosting, and reliability wording is product/legal-approved.
- [ ] Images/video are licensed, optimized, credited where needed, and have approved alt text.
- [ ] Testimonials have approved text, identity details, image, church affiliation, and permission to publish.
- [ ] No structural/provisional placeholders, starter assets, fake metrics, or invented content remain in production.

## Public routes and CMS

- [ ] Every approved sitemap route resolves and is reachable through intentional navigation/internal links.
- [ ] All included module cards link to complete module pages with approved overview, benefits, features, workflow, screenshots, FAQs, related modules, and demo CTA.
- [ ] Authorized roles can create/edit/publish/unpublish the contracted content types.
- [ ] Anonymous and unauthorized users cannot access CMS routes or mutations.
- [ ] Draft/unpublished records are absent from public pages, search, related content, sitemap, and cached responses.
- [ ] Slugs are unique; published slug changes create approved redirects.
- [ ] Media upload/replacement validates files and preserves intentional alt text/reference behavior.

## Blogs, FAQ, and search

- [ ] Blog title, slug, metadata, thumbnail, body, tags/categories, author, and publish date validation matches approved rules.
- [ ] The 2,000-word, two-inline-image, and thumbnail limits behave as approved.
- [ ] Search and category filtering return relevant published blogs only and have honest empty/error states.
- [ ] “Recent” and “Popular” definitions are approved and deterministic.
- [ ] FAQ category filter/sort behavior matches the approved interaction.
- [ ] Comments, ratings, and topic suggestions pass moderation, authorization, XSS, duplicate-vote, spam/rate-limit, retention, deletion, and privacy criteria.
- [ ] The administrator can review and action pending comments and topic suggestions, and material moderation actions are auditable.
- [ ] The custom analytics dashboard is role-protected and accurately reports approved page-view, lead, blog, and search metrics for the selected date range.

## Forms and leads

- [ ] Demo and digitization field lists/options are approved, including phone rules, location fields, record type, and page sizes.
- [ ] Required fields and formats are validated on both client and server.
- [ ] Rapid repeat submission does not create accidental duplicates.
- [ ] Successful submissions persist exactly once and are visible only to authorized operators.
- [ ] Approved recipients receive the correct notification; transient notification failure does not lose the lead.
- [ ] Failure messages preserve safe user input and provide an actionable retry path.
- [ ] Consent text/version and retention/deletion process are approved and recorded.
- [ ] Rate limiting and anti-abuse behavior are tested, including an accessible fallback.

## SEO and analytics

- [ ] Each indexable page has a unique title, description, canonical URL, one H1, valid heading hierarchy, OG metadata, and approved schema markup.
- [ ] Sitemap contains canonical published pages only; robots rules correctly separate preview/staging/production.
- [ ] Breadcrumbs and internal links are usable and structured where approved.
- [ ] GA4 and Search Console are client-owned and configured for the production domain.
- [ ] Consent behavior is approved and tested before optional analytics/Meta Pixel loads.
- [ ] Demo, digitization, blog search, and topic events fire once at the correct state transition.
- [ ] Analytics payload/network checks confirm no PII is sent.

## Accessibility, responsive behavior, and performance

- [ ] Accessibility target and exception process are approved.
- [ ] Keyboard navigation, visible focus, skip link, landmarks, headings, labels, error summaries, and status announcements are tested.
- [ ] Menus, dialogs/lightboxes, filters, and CMS interactions have correct focus behavior and Escape handling.
- [ ] Color contrast, zoom/reflow, touch targets, alt text, captions/posters, and reduced motion are tested.
- [ ] No horizontal overflow, clipped content, obscured controls, or inaccessible fixed elements at agreed mobile/tablet/desktop viewports.
- [ ] Current agreed Chrome, Safari, Firefox, and Edge versions pass the route and form smoke suite.
- [ ] Responsive images, lazy loading below the fold, and hero-media fallback are verified.
- [ ] Deployed Core Web Vitals/Lighthouse budgets pass under the agreed profile.

## Security and operations

- [ ] No secrets are committed or exposed in browser bundles/network responses.
- [ ] RLS is enabled and tested for anonymous, non-admin, editor/admin, and server-only paths.
- [ ] Inputs, uploads, and rendered user content pass validation/sanitization tests.
- [ ] CMS authentication, invitation, recovery, MFA decision, session expiry, and offboarding are verified.
- [ ] Dependency/security checks pass with findings reviewed.
- [ ] Production HTTPS, security headers, logs, rate limits, and monitoring are configured and verified.
- [ ] Backup owner, retention, RPO/RTO, media recovery, and staging restore drill are documented.
- [ ] Alert recipients and incident escalation are tested.

## Release evidence

The 2026-08-15 results below predate the Sanity/Resend/Hostinger migration and are historical only. Add a new dated evidence block after the current migration passes.

### Local migration evidence — 2026-08-21

- [x] `npm run check` — ESLint; generated Next route types plus strict TypeScript; 11 Vitest files/42 tests; Next.js 16.3.1 webpack production build and route collection all passed.
- [x] Local HTTP smoke — `/`, About, Product, one module, Blogs, FAQ, Contact, Security/Compliance, `/studio`, `/api/health`, robots, and sitemap returned HTTP 200 against `next dev`.
- [x] Browser smoke — public home visually checked at desktop and 390 by 844; `/studio` setup gate and `/admin` unauthenticated redirect/login rendered cleanly; no application console errors were observed.
- [ ] Protected `/admin` operational pages were not visually rechecked because the isolated Playwright browser had no authenticated session and credentials were not re-entered during this run.
- [ ] `npm audit --omit=dev` reports 9 Sanity CLI transitive findings (8 moderate, 1 high). The suggested automated fix is a breaking Sanity downgrade, so no forced fix was applied.
- [x] Sanity Studio deployment — SDK `2.20.0` reproduced a Vite JSX parse failure; resolved SDK `2.20.1` built successfully and deployed to <https://church-govern-development.sanity.studio>, 2026-08-21.
- [x] Hosted Studio configuration regression — reproduced `projectId: missing`, added the required `SANITY_STUDIO_*` Vite variables, rebuilt/redeployed successfully, and verified a clean browser reached Sanity authentication rather than the project-not-found screen, 2026-08-21.

### Live Sanity development evidence — 2026-08-21

- [x] Authenticated Sanity CLI access to project `vc24qe42` was verified; private dataset `development` was created.
- [x] The idempotent seed created or replaced 51 application documents. A second run completed and a GROQ count remained exactly 51: 7 pages, 2 suites, 17 modules, 6 blogs, 6 categories, 10 FAQs, navigation, footer settings, and site settings; no testimonials were created.
- [x] The Studio production bundle built, its schema manifest deployed, and the hosted URL completed Sanity's authenticated dashboard handoff.
- [x] After the local environment reload, `/studio` returned HTTP 307 to the hosted Studio and `/` returned HTTP 200.
- [x] Post-connection `npm run check` passed: ESLint, generated route types plus strict TypeScript, 12 Vitest files/45 tests, and the Next.js webpack production build.
- [ ] The private dataset has no website read token, all seeded editorial records remain provisional, and no approved Sanity record has yet been rendered publicly. Mock mode remains enabled for local testing.

### Complete development-demo evidence — 2026-08-21

- [x] Mock collections cover 7 pages, 17 modules, 6 blogs, 10 global plus 34 module-specific FAQs, navigation, 2 explicitly labelled testimonials, rotating hero media, a 2-image gallery/lightbox, comments, and ratings.
- [x] Mock mode is disabled unconditionally when `NODE_ENV=production`; `USE_MOCK_CONTENT=false` disables it locally.
- [x] Mock comment GET/POST and rating GET/POST returned expected 200/201 responses without Supabase persistence.
- [x] Demo leads and topic suggestions validate the complete public form UI and return explicit non-persistent/non-email confirmation states.
- [x] The operational dashboard contains labelled representative leads, moderation, audit, workflow notes/statuses, and a dedicated illustrative analytics workspace; demo edits are screen-only.
- [x] Every module includes benefits, features, workflow, two labelled UI concepts, two module-specific FAQs, related modules, and a CTA. Blog cards include thumbnails and ratings.
- [x] Desktop and 390-by-844 home views show the mock-data warning; page sections, testimonials, rotating hero, and gallery are present; the gallery dialog opens and closes with Escape.
- [x] A 36-route HTTP sweep passed for core/system routes, all 17 modules, all 6 blog details, `/admin`, and admin analytics.
- [x] At 390-by-844, home, module detail, blogs, contact, admin, and analytics had `scrollWidth === innerWidth`; no application console errors were reported.
- [x] Final post-expansion `npm run check` passed: ESLint, generated route types plus strict TypeScript, 12 Vitest files/45 tests, and the Next.js 16.3.1 webpack production build.

### Integrated staging-mode evidence — 2026-08-22

- [x] `APP_ENV=staging USE_MOCK_CONTENT=true USE_MOCK_OPERATIONS=false npm run check` passed: ESLint, generated route types plus strict TypeScript, 13 Vitest files/48 tests, and a Next.js 16.3.1 webpack production build.
- [x] Supabase migrations `202608210003` and `202608220004` were dry-run and applied. Anonymous operational-table reads returned zero rows, anonymous engagement RPC calls were denied, and service-role RPC calls succeeded.
- [x] Synthetic live contact, topic, comment, and rating API workflows persisted successfully; generated QA records and audit events were deleted after verification.
- [x] Authenticated `/admin` dashboard, lead, moderation, analytics, and audit routes were checked at desktop and 390 by 844 without horizontal overflow or application console errors.
- [x] Chrome mobile Lighthouse after accessibility fixes: performance 98, accessibility 100, best practices 100. SEO was 69 because staging deliberately emits `noindex,nofollow` and disallows crawlers.
- [x] Staging metadata, robots, and security-header behavior passed locally: non-production responses are no-index, robots disallow `/`, and the deployed-only CSP/header configuration is present in the production build.

- [x] `npm run lint` — passed locally through `npm run check`, 2026-08-15.
- [x] `npm run typecheck` — `next typegen && tsc --noEmit` passed locally through `npm run check`, 2026-08-15.
- [x] `npm test` — 7 files and 29 tests passed locally through `npm run check`, 2026-08-15.
- [x] `npm run build` — Next.js 16.3.1 webpack production build passed locally; CMS-backed public routes are dynamic, 2026-08-15.
- [ ] Staging browser/accessibility evidence — URL/date/reviewer:
- [x] Development migration/content evidence — `202608140001` and `202608140002` present in linked Supabase project; anonymous REST returned 17 modules, 6 blogs, 10 FAQs, 7 pages, and 10 navigation records, 2026-08-14.
- [ ] Production deployment — commit/URL/time/operator/approver:
- [ ] Post-release smoke and monitoring observation — result/date:

## Migration acceptance — 2026-08-21

- [ ] Sanity schemas, Studio navigation, validation, provisional/approved publishing, media, SEO, and editor access are verified in an SBL-owned non-production project.
- [x] The idempotent seed produces 7 pages, 2 suites, 17 modules, 6 blogs plus 6 categories, 10 FAQs, navigation/footer/settings, and no testimonial; rerunning it leaves 51 application documents with no duplicates.
- [ ] Approved Sanity content—not source fallback—renders on public routes, metadata, sitemap, search, related modules, gallery/lightbox, comments, and ratings.
- [x] Supabase migrations `202608210003` and `202608220004` are applied; anonymous and service-role engagement behavior is verified in the linked development project.
- [ ] Resend sender domain, notification recipient, successful delivery, and failure-after-persistence behavior are tested without exposing PII or secrets.
- [ ] Hostinger staging is deployed using Node 22; health, public routes, `/studio`, `/admin`, forms, assets, robots, headers, logs, and rollback are checked.
- [x] Admin `.admin-shell` typography/contrast fix is visually checked on dashboard, lead lists/details, moderation, analytics, and audit at desktop and 390 by 844.
- [ ] Studio and public views are checked at desktop and 390 by 844 for focus, contrast, clipping, overflow, and honest empty/error states.

## Integrated local browser evidence — 2026-08-14

- All 32 tested public routes returned HTTP 200: core pages, all 17 module details, all six seeded blog details, sitemap, and robots.
- Canonical link, `SoftwareApplication`, `BreadcrumbList`, and Storage-backed gallery output were present on the Church Dashboard response.
- Supabase Auth login succeeded for the configured super administrator; the dashboard and role-scoped navigation loaded live counts.
- Dedicated page, module, and blog editors loaded. A module save with a site-relative canonical succeeded.
- A public media upload succeeded through the authenticated media API, appeared in the CMS, was assigned to a module screenshot gallery, rendered publicly, and opened/closed with Escape in the lightbox.
- A synthetic rating persisted. A synthetic comment entered moderation, was approved in the CMS, appeared publicly, and did not expose its email. Both QA records were removed after verification.
- A synthetic demo lead persisted, appeared with complete details, changed status, and retained an internal note. It was removed after verification.
- CMS dashboard and public module page had no horizontal document overflow at 390 by 844 CSS pixels.
- Remaining unchecked items still require staging/production accounts, approved content/legal decisions, cross-browser/accessibility review, GA4/GSC, email, backups, monitoring, and operational acceptance.

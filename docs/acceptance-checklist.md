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

### Vercel Preview evidence — 2026-08-22

- [x] Vercel cloud build passed and the stable share URL <https://church-govern-staging.vercel.app> returns HTTP 200 without Vercel SSO.
- [x] All 38 deployed public/system routes returned expected 200/307 statuses; every module and blog detail was included.
- [x] Stable canonical, `noindex,nofollow`, disallow-all robots, health response, CSP, HSTS, and other security headers were verified on the deployed URL.
- [x] A deployed contact submission completed in explicit non-persistent mock mode; no PII was stored or emailed.
- [x] Deployed desktop 1440-by-1000 and mobile 390-by-844 browser checks showed no horizontal overflow or application error state. Vercel's optional feedback-toolbar script is intentionally blocked by CSP and may log a provider-only console error.
- [x] Live Vercel operations are active: contact, topic, moderated comment, and rating writes succeeded; exact QA records/audit entries were cleaned up and rate-limit counters were retained.
- [x] Deployed Supabase administrator authentication and all operations collections loaded at 390 by 844 without overflow or application error.
- [x] Resend accepted the synthetic contact notification and the API returned `notificationStatus: sent` to the temporary recipient configuration.
- [x] Approved-comment publication regression — an approved staging comment was verified in the database, public RPC/API, server-rendered article HTML, and visible mobile blog UI after commit `c9850bf`, 2026-08-22.
- [ ] The recipient must confirm inbox delivery. Rotate the Resend key because it was pasted into chat, then update the sensitive Vercel value.

### Pure-white editorial redesign evidence — 2026-08-22

- [x] Public presentation is isolated behind `.public-site`; the existing `.admin-shell` type scale and operational navigation do not inherit public typography or surfaces.
- [x] A pure-white visual system with charcoal typography/actions, cool neutral structure, a restrained cobalt interaction accent, compact headings, aligned cards, light footer, forms, article/community panels, gallery and loading states is implemented across every public template. No green or pink surface tint remains in the public design system.
- [x] The rejected floating hero labels and colored decorative geometry were removed; Home now uses a clean editorial image split and Product uses an aligned two-card suite comparison.
- [x] Product discovery provides an accessible Office/Member selector, visible search label, live result count, honest empty state and direct suite hashes. Contact provides one accessible, hash-addressable enquiry workspace instead of three simultaneous forms; switching intent preserves entered values.
- [x] FAQ filters use a named group and announce the visible count. Article and legal pages retain an `On this page` disclosure below 980px. Blog/module cards have unique accessible link names and full-card hit areas; rating controls expose selected state.
- [x] Mobile navigation locks document scroll, moves focus into the menu, traps Tab navigation, closes on Escape/backdrop, and restores focus to the trigger.
- [x] `npm run check` passed after the redesign: ESLint, generated Next.js route types plus strict TypeScript, 13 Vitest files/50 tests, and the Next.js 16.3.1 webpack production build.
- [x] Desktop browser checks covered Home, About, Product, one module, Blogs, one article, FAQ, Contact, Security/Compliance, Privacy, Terms, Accessibility and the authenticated operations dashboard at 1280 by 720 without horizontal overflow.
- [x] Playwright checks at 390 by 844 confirmed no horizontal overflow on Home, Product and Contact. The home first viewport contains the proposition, both CTAs and all three trust points; Product search, Contact hash/state retention, FAQ filtering/counts and mobile-menu focus/scroll behavior passed.
- [ ] The redesigned code has not yet been committed, pushed, or redeployed. The current Vercel Preview still shows the prior visual system until a new build is checked.
- [ ] Automated contrast tooling, screen-reader testing, 200% zoom/reflow, Safari/Firefox/Edge and post-redesign Lighthouse/Core Web Vitals remain release gates.

### Owner-approved chartreuse/mint palette evidence — 2026-08-22

- [x] Interim magenta, orange and institutional-blue accents were replaced with the supplied reference palette: chartreuse primary emphasis, mint secondary accents, near-black typography/navigation, white cards and cool-gray canvas.
- [x] Public Home, Product and Contact were visually inspected at desktop; Home was also inspected at 390 by 844 with the responsive navigation, actions, trust points and hero media aligned.
- [x] The operational dashboard and demo-lead workspace were visually inspected; demo-lead management was also checked at 390 by 844 with readable navigation, filters, statuses and record controls.
- [x] `npm run check` passed after the palette change: ESLint reported no errors (warnings come from installed Impeccable tool copies), generated route types and strict TypeScript passed, 13 Vitest files/50 tests passed, and the Next.js 16.3.1 webpack production build completed.
- [ ] The palette refresh is local only and has not been committed, pushed or redeployed.
- [x] The owner approved the homepage gradient composition for all public routes. Shared gradients now cover primary actions, hero atmospheres, selected controls, trust/security surfaces, testimonials and final CTA bands; admin styling remains isolated and unchanged.
- [x] Product, FAQ, Security/Compliance and Contact were visually checked at desktop; Product, Church Dashboard module detail, a blog article and FAQ were checked at 390 by 844.
- [x] `npm run check` passed after site-wide gradient adoption: ESLint reported no errors (warnings originate in installed Impeccable tool copies), generated route types/strict TypeScript passed, 13 Vitest files/50 tests passed, and the Next.js 16.3.1 webpack production build completed.
- [x] The owner-requested persistent “Demo content — pending client approval” banner was removed from the public layout. Development-only sections retain contextual provisional labels; desktop and 390-by-844 homepage renders were checked, and `npm run typecheck` passed.

### Institutional polish evidence — 2026-08-22

- [x] Shared public styling now uses a pure-white canvas, charcoal typography, cool neutral structure and a muted institutional-blue interaction accent; green/pink tint, gradients and decorative startup effects were not introduced.
- [x] Buttons, cards, suite panels, FAQs, forms, media and CTA geometry were tightened, while CMS page information changed from rounded cards to a compact editorial-rule treatment. Approved content, routes, interactions and integrations were preserved.
- [x] Desktop checks at 1440 by 1000 covered Home, Product, Church Dashboard, Blogs, FAQ, Contact and Privacy; every route reported `scrollWidth === clientWidth`.
- [x] Mobile checks at 390 by 844 covered Home, Product, Blogs, FAQ and Contact; every route reported `scrollWidth === clientWidth`. The mobile Home H1 reduced from about 198px to 139px tall.
- [x] The Product Office/Member suite control remained functional and switched to all seven Member Suite modules with the correct live result text.
- [x] `npm run check` exited successfully: ESLint reported no errors (warnings originate in installed Impeccable tool copies), generated route types and strict TypeScript passed, 13 Vitest files/50 tests passed, and the Next.js 16.3.1 webpack production build completed.
- [ ] This polish remains local until it is committed, pushed and verified on the Vercel Preview.

### Operations-console polish evidence — 2026-08-22

- [x] `/admin`, all seven operational workspaces, analytics, audit and `/admin/login` use a consistent white/slate/institutional-blue system with compact geometry, stronger secondary text and semantic workflow-status colors.
- [x] Desktop browser checks at 1440 by 1000 covered Overview, Demo requests, Digitization enquiries, Contact enquiries, Comment moderation, Topic suggestions, Analytics, Audit trail and Login; every route reported `scrollWidth === clientWidth`.
- [x] Mobile checks at 390 by 844 covered Overview, Demo requests, Comment moderation, Analytics, Audit trail and Login; every route reported `scrollWidth === clientWidth` and no visible actionable target below 44px.
- [x] Comment search reduced the rendered record list to one matching result, record details remained operable, and mobile navigation opened and closed with the expected `aria-expanded` state.
- [x] Post-polish `npm run check` exited successfully: ESLint reported no errors (warnings originate in installed Impeccable tool copies), generated route types and strict TypeScript passed, 13 Vitest files/50 tests passed, and the Next.js 16.3.1 webpack production build completed.
- [ ] Local development currently uses the authorized demo administrator path because Supabase environment variables are absent; this run did not revalidate live Supabase credential authentication or persistence.

### About-page editorial redesign evidence — 2026-08-22

- [x] `/about` was recomposed as an editorial institutional story rather than a sequence of equal card grids: a statement-led hero, purpose narrative, ruled principles index, honest FamilyaConnect identity placeholder, records feature, related-product index and pending mission/vision outlook.
- [x] Existing approved copy, the CMS page-section boundary, the `/contact#digitization` and `/product` destinations, metadata and final CTA were preserved; no company history, relationship, compliance, customer, pricing or scale claim was introduced.
- [x] Desktop inspection at 1440 by 1000 and mobile inspection at 390 by 844 covered the hero, CMS content, purpose, principles, partner, records and outlook sections. Both layouts reported `scrollWidth === innerWidth`.
- [x] The historical-records photograph keeps its descriptive alt text and now loads reliably in the offset desktop composition through an explicit eager, unoptimized local asset path.
- [x] Post-redesign `npm run check` passed: ESLint reported no errors (warnings originate in installed Impeccable tool copies), generated Next.js route types and strict TypeScript passed, 13 Vitest files/50 tests passed, and the Next.js 16.3.1 webpack production build completed.

### Homepage connected-narrative redesign evidence — 2026-08-22

- [x] `/` was recomposed as one connected institutional narrative: a statement-led hero, shared-suite bridge, editorial CMS strip, ruled responsibility index, dark platform foundation, product proof, trust boundary, editorial testimonials, gallery and asymmetric insights.
- [x] Approved copy, server-side content reads, structured data, hero rotation, gallery/lightbox, blogs, testimonials, routes and CTA destinations were preserved. Mock testimonials remain explicitly identified as development data.
- [x] Desktop inspection at 1440 by 1000 and mobile inspection at 390 by 844 covered representative upper and lower sections; both layouts reported `scrollWidth === innerWidth`. The rotating hero image selector changed the active image and accessible pressed state.
- [x] Hero captions no longer compete with media controls and testimonial cards were replaced with a restrained ruled layout. Both rotating hero assets render with `loading="eager"`; the initial slide also has `fetchpriority="high"`.
- [ ] Next.js development mode still emits an LCP loading warning for the initial hero despite the live image element carrying `loading="eager"` and `fetchpriority="high"`. Treat this as a framework-development diagnostic to recheck with production Lighthouse rather than as proof of a production performance defect.
- [x] Post-redesign `npm run check` passed: ESLint reported no errors (1,672 warnings originate in installed Impeccable tool copies), generated Next.js route types and strict TypeScript passed, 13 Vitest files/50 tests passed, and the Next.js 16.3.1 webpack production build completed.
- [ ] The homepage redesign is local only until it is committed, pushed and verified on the Vercel Preview.

### Owner-selected homepage hero artwork — 2026-08-22

- [x] The owner-supplied `main img.png` was copied to `public/images/church-govern-main-hero.png` and now renders as the homepage hero artwork in mock and non-mock content modes.
- [x] The desktop hero uses the artwork as a true edge-to-edge background immediately below the header. The approved heading and actions align to the shared content grid over the quiet left side while the people and interface imagery remain visible on the right; there is no centered card frame, radius, shadow or outer image gutter.
- [x] At 390 by 844 the copy and artwork stack, and the image uses a subject-focused square crop. At 1440 by 1000 and 390 by 844 the artwork loaded successfully, `scrollWidth === innerWidth`, and the browser reported no application errors or warnings.
- [x] Browser geometry confirmed the artwork spans exactly `0 → 1440px` on desktop and `0 → 390px` on mobile. Desktop copy begins at the same 140px shell edge as the header identity.
- [x] The desktop artwork is translated 7% toward the right and the left 30% is a solid-white reading field that transitions gradually into the photograph. Heading, supporting copy, actions and trust points no longer compete with the artwork's charts or people; mobile resets the translation and retains its focused crop.
- [x] The approved CMS heading now keeps its exact wording while using two visual voices: the opening promise carries the primary weight and the second sentence becomes a calmer supporting statement. The lede, action hierarchy, context label and trust points were tightened into one legible reading sequence.
- [x] Focused hero QA passed at 1440 by 1000, 1024 by 768 and 390 by 844. All three layouts kept the artwork loaded and the page within the viewport; fresh desktop and mobile checks reported no browser errors or warnings.
- [x] The Office Suite / shared foundation / Member Suite relationship is now anchored in a high-contrast white caption rail at the artwork's lower edge instead of floating over the bright table. Desktop aligns the rail with the left editorial plane; tablet and mobile attach it directly beneath the image.
- [x] The desktop suite rail is exactly half the hero width. At the reviewed 1440px viewport its measured width is 720px and its left edge remains at 0; the responsive mobile rail remains full-width.
- [x] At desktop widths the three trust points share one evenly distributed 520px row. The responsive phone layout intentionally returns them to one item per line to preserve legibility and touch-scale spacing.
- [x] The desktop hero now uses a viewport-based 56/44 editorial composition rather than mixing the centered site shell with viewport-positioned artwork. The wider copy plane prevents congested wrapping while retaining mathematically equal gutters: 32px at 1024px, about 143px at 1440px and about 278px at 1920px; the CTA row remains horizontal while mobile actions stack.
- [x] The headline line-height, tracking and inter-sentence spacing were opened, and the white-to-image transition was retuned around the wider editorial plane so the complete copy hierarchy remains on a quiet reading field. Browser checks at 1024 by 768, 1440 by 1000, 1920 by 1080 and 390 by 844 reported no horizontal overflow or console warnings.
- [x] The desktop image veil now begins fading after 36% and clears by 66%, revealing the priest, interface graphics and church interior earlier while preserving the fully white copy field. Mobile continues to render the unmasked photograph.
- [x] The fixed artwork supersedes the previous development-only rotating hero on `/`; the reusable rotation component remains in source but is not rendered by the current homepage.
- [x] `npm run check` passed after integration: ESLint reported no errors (1,672 warnings originate in installed Impeccable tool copies), generated Next.js route types and strict TypeScript passed, 13 Vitest files/50 tests passed, and the Next.js 16.3.1 webpack production build completed.
- [ ] The image remains provisional pending client approval and must pass the production content gate before launch.

### Product, Blogs, FAQ and Contact polish evidence — 2026-08-22

- [x] `/product`, `/blogs`, `/faq` and `/contact` now use route-scoped task-specific compositions while retaining the shared white, charcoal, chartreuse and mint design system. Product is a capability catalogue, Blogs is an editorial publication, FAQ is a topic-and-answer workspace, and Contact is a single-active-intent enquiry workspace.
- [x] The development-only “Designed to work together” CMS seed strip was removed from `/product` because it repeated the substantive connected-records section directly below it.
- [x] Existing server-side content reads, metadata, structured data, routes, module links, blog links, search/filtering, FAQ content, enquiry forms, validation and operational API behavior were preserved. No customer, pricing, compliance, security, scale or organizational claim was introduced.
- [x] Product suite switching updated the hash and showed the expected seven Member Suite modules; blog keyword search returned one matching article; the Security FAQ filter returned two questions and an answer expanded; Contact intent switching exposed the digitization assessment panel and updated the hash.
- [x] All four routes were inspected at 1440 by 1000 and 390 by 844, including populated workspace states. Each mobile route reported `scrollWidth === clientWidth`, and the fresh browser session reported no errors or warnings.
- [x] `npm run check` passed after the polish: ESLint reported no errors (1,672 warnings originate in installed Impeccable tool copies), generated Next.js route types and strict TypeScript passed, 13 Vitest files/50 tests passed, and the Next.js 16.3.1 webpack production build completed.
- [ ] This route polish is local only until it is committed, pushed and verified on the Vercel Preview.

### Focused Contact-page refinement evidence — 2026-08-22

- [x] `/contact` now presents its three enquiry paths as three spacious horizontal choices followed by a full-width active context banner and a centered form surface. The rejected three-column rail/context/form composition was removed; decorative numbering and repeated heading labels remain absent while all approved copy, fields, validation, hashes and operational API behavior were preserved.
- [x] The development-only “Every enquiry path is ready to review” CMS seed strip was removed from `/contact`; it was internal demo guidance rather than useful visitor content.
- [x] The tablist now supports Arrow keys plus Home and End with roving focus. Browser verification moved focus and selection from `#digitization` to `#general-enquiry` and kept the URL hash synchronized.
- [x] The active demonstration, digitization and general-enquiry layouts were inspected at 1440 by 1000, 1024 by 768 and 390 by 844. Tablet and mobile reported `scrollWidth === innerWidth`, with no horizontal overflow.
- [x] Focused `npm run typecheck` passed. Full `npm run check` then passed with no ESLint errors (1,672 warnings originate in installed Impeccable tool copies), generated route types and strict TypeScript, 13 Vitest files/50 tests, and the Next.js 16.3.1 webpack production build.
- [ ] This Contact refinement is local only until it is committed, pushed and verified on the Preview URL.

### Development-only page-strip removals — 2026-08-22

- [x] Visitor-irrelevant CMS seed strips were removed from `/`, `/contact`, `/product`, `/security-compliance`, `/blogs` and `/faq`. Each strip duplicated or described development behavior already covered by the real page content; functional sections, content reads, metadata and operational behavior remain intact.

### Focused Insights-page refinement — 2026-08-22

- [x] `/blogs` now uses a shorter editorial hero, a semantic topic index on wide screens, a clearly introduced insight library, stronger search/filter focus treatment, restrained image motion, and a more deliberate featured-story hierarchy.
- [x] The duplicate “Latest four / Popular four” lists were removed because every linked article was already present in the searchable library. Sanity reads, article routes, ratings, search, category filtering, the empty state and topic-suggestion workflow remain intact.
- [x] The topic index is omitted at tablet and phone widths where the category filter provides the same discovery path with less vertical congestion.
- [x] Populated browser checks passed at 1280 by 720, 820 by 900 and 390 by 844 with no horizontal overflow. Keyword search, category filtering and the no-results clear action restored the expected article set.
- [x] `npm run check` passed: ESLint reported no errors (1,672 warnings are confined to installed Impeccable copies), generated route types and strict TypeScript passed, 13 Vitest files/50 tests passed, and the Next.js 16.3.1 webpack production build completed.

### Focused FAQ-page refinement — 2026-08-22

- [x] `/faq` now presents a shorter decision-support hero, a clear “Find an answer” workspace, keyword search across questions and answers, topic filters with live counts, restrained accordion cards, and a light closing contact prompt. The oversized decorative question count and passive topic rail were removed.
- [x] Existing Sanity FAQ reads, approved wording, FAQPage structured data, metadata and contact destination remain unchanged; no product, pricing, security, compliance or organizational claim was introduced.
- [x] Browser interaction checks covered keyword search, Security filtering, answer expansion, no-results handling and clear-state recovery. The page reported no horizontal overflow at 1280 by 720 and 390 by 844; the secondary hero guide is intentionally omitted on phone and tablet widths.
- [x] `npm run check` passed after the refinement: ESLint reported no errors (1,672 warnings are confined to installed Impeccable copies), generated route types and strict TypeScript passed, 13 Vitest files/50 tests passed, and the Next.js 16.3.1 webpack production build completed.
- [ ] This FAQ refinement is local only until it is committed, pushed and verified on the Preview URL.

### Insights UI audit and polish — 2026-08-23

- [x] The `/blogs` audit identified a non-interactive “Explore by topic” hero rail, weak search recovery, and an overly containerized two-column card grid. These were resolved with a truthful editorial guide, working topic controls with live counts, a clear-search action, and a reference-inspired responsive 3/2/1 article grid with large bounded thumbnails, date/category context, concise summaries, ratings, read times, and a consistent circular reading action.
- [x] The card treatment intentionally omits an author portrait/name until the client supplies approved author identities; no fictional people or editorial attribution were introduced to imitate the visual reference.
- [x] Existing Sanity reads, article copy, routes, dates, read times, ratings, search semantics, topic suggestion workflow and empty-state recovery remain intact. No customer, security, compliance, pricing or performance claim was introduced.
- [x] Browser checks covered keyword search, clear-search recovery, Governance filtering, no-results recovery, populated article rendering, reduced-motion treatment and the 390-by-844 responsive composition. At 1280 pixels the six cards render as two equal rows of three; at 390 pixels they use one 358-pixel column, the metadata row does not overflow, and the circular action is 44 by 44 pixels. Desktop and mobile both reported `scrollWidth === clientWidth`; mobile replaces the wide topic controls with the existing labelled category select.
- [x] The targeted static Impeccable detector reported no route-specific finding in the Blogs components. Its six warnings point to earlier shared stylesheet rules outside the `/blogs` layer; URL scanning could not run because the optional Puppeteer dependency is not installed, so the live browser audit supplied the rendered evidence instead.
- [x] `npm run check` passed after the polish: ESLint reported no errors (1,672 warnings are confined to installed Impeccable copies), generated route types and strict TypeScript passed, 13 Vitest files/50 tests passed, and the Next.js 16.3.1 webpack production build completed.
- [ ] Promote repeated Blogs-specific neutral/chartreuse values into shared design tokens during a later design-system extraction; this does not block the current single-theme surface.
- [ ] This Insights refinement is local only until it is committed, pushed and verified on the Preview URL.

### Insight article redesign — 2026-08-23

- [x] Every `/blogs/[slug]` route now uses one scoped editorial template: compact navigation context, balanced article masthead, visible category and publication details, a stable responsive feature image, desktop and mobile contents navigation, a 68-character reading measure, restrained editorial qualification, reader rating, moderated comments and a consistent related-reading section.
- [x] Existing Sanity article fields, authors, dates, summaries, body sections, media and metadata remain intact. Supabase-backed ratings and moderated comments retain their existing API routes, validation, loading, success and error behavior; no article claim or identity was invented.
- [x] All six provisional article routes rendered their expected title and content sections in the live browser with no horizontal overflow. Representative checks passed at 1280 by 800, 820 by 900 and 390 by 844; the mobile table of contents opened with the expected section links, all five rating controls measured 44 by 44 pixels, and the comment fields met the 44-pixel minimum interaction height.
- [x] Browser inspection reported no console errors. `npm run check` passed after the redesign: ESLint reported no errors, generated route types and strict TypeScript passed, 13 Vitest files/50 tests passed, and the Next.js webpack production build completed.
- [ ] The article redesign is local only until it is committed, pushed and verified on the Preview URL.

### Homepage insights refinement — 2026-08-23

- [x] After rejecting the quieter feature-and-rail direction, the homepage insights area now uses a magazine-style composition: a compact indexed introduction, one wide image-and-chartreuse editorial spotlight, and three image-led supporting stories beneath it.
- [x] Existing Sanity article reads, ordering, images, dates, categories, summaries, read times, ratings, links and the truthful empty state remain unchanged. No author identity, customer claim or editorial fact was invented.
- [x] Browser inspection passed at 1440 by 900, 820 by 900 and 390 by 844. Desktop uses a full-width split spotlight followed by three equal stories; tablet retains the split spotlight above a two-column supporting layout; phone stacks the spotlight and renders compact supporting rows without horizontal overflow. All article actions measured 44 by 44 pixels on phone, and the fresh browser session reported no errors or warnings.
- [x] The section uses the established white/charcoal system with one deliberate chartreuse editorial panel, a restrained numerical index and strong image rhythm rather than a repetitive container wall.
- [x] `npm run check` passed after the refinement: ESLint reported no errors (1,672 warnings are confined to installed Impeccable copies), generated route types and strict TypeScript passed, 13 Vitest files/50 tests passed, and the Next.js 16.3.1 webpack production build completed.
- [ ] This homepage refinement is local only until it is committed, pushed and verified on the Preview URL.

### Homepage motion and polish — 2026-08-25

- [x] A scroll-reveal and page-load motion layer was added to `/` only, with no new dependencies: CSS transitions/keyframes in `src/app/(site)/site-theme.css` plus a client `IntersectionObserver` controller in `src/components/site/home-motion.tsx`. Content, copy, routes, structured data, server-side reads and CTA destinations are unchanged.
- [x] Motion is opt-in from the client. The server-rendered HTML carries no hidden state, so the page is complete without JavaScript; the hidden state is applied only once the controller sets `data-motion` on `.home-page`, and every rule sits inside `@media (prefers-reduced-motion: no-preference)`.
- [x] The reduced-motion path was checked in the browser: the page rendered fully visible and unanimated, with nothing hidden, offset or shifted.
- [x] Arming is deferred until `window.load` and `document.fonts.ready`. An earlier version measured the fold during hydration and classified 8 of 12 sections as already seen, so they never animated; after the fix 0 of 12 are revealed at rest and the first pending target sat at 1428px against a 748px fold.
- [x] At a true 390-by-844 layout viewport (`documentElement.clientWidth === 390`, DPR 2) the page reported `scrollWidth - clientWidth === 0` for both the document and body, and no element extended past the viewport edge. A prior pass had reported a 3px `home-hero__art` overhang, but that measurement ran at an unrequested 433px viewport and does not reproduce at the agreed width.
- [x] A stepped scroll to the document bottom at 390 by 844 (page 11050px, maximum scroll 10206px) revealed all 12 targets in document order with no gaps and no remaining transparent target. An earlier report of 11 of 12 with `home-outro` transparent was an artifact of a scroll loop that stopped at roughly 7600px, not a trigger defect.
- [x] The hero load sequence was measured from computed styles at 1440 by 1000 and runs in the intended order: first title line 0.06s, second title line 0.15s, lede 0.25s, actions 0.34s, context label 0.43s, suite rail 0.48s, its shared-foundation label 0.76s and its connecting rules 0.9s, with the artwork settling over 1.15s.
- [x] A CSS specificity defect was fixed in the same pass: the `animation` shorthand reset `animation-delay` on the second title line, so both lines rose together. The delay selector now matches the shorthand's depth and measures 0.15s.
- [x] The homepage `JsonLd` payload was changed from a top-level array to a single `@graph` with one shared `@context`. This removed a reproducible `r["@context"].toLowerCase is not a function` console `TypeError` raised by an external consumer of the markup; the error no longer appears. Both forms are valid structured data and the Organization and WebSite entries are unchanged.
- [x] `npm run check` stages were run individually and each exited 0: ESLint reported no errors and all 1,673 warnings resolve to installed agent-tool directories (`.agent`, `.agents`, `.claude`, `.cursor`, `.gemini`, `.hermes`, `.kiro`, `.opencode`, `.pi`, `.qoder`, `.vibe`) with zero findings in `src/`; generated route types and strict TypeScript passed; 13 Vitest files and 50 tests passed; the Next.js 16.3.1 webpack production build compiled successfully and collected all routes.
- [ ] Motion was verified in one Chromium-family browser only. Safari, Firefox and Edge behavior for the reveal layer, and post-change Lighthouse/Core Web Vitals, remain release gates.
- [ ] Screen-reader, automated contrast and 200% zoom/reflow testing were not repeated for this change.
- [ ] This motion polish is local only until it is committed, pushed and verified on the Preview URL.

- [x] `npm run lint` — passed locally through `npm run check`, 2026-08-15.
- [x] `npm run typecheck` — `next typegen && tsc --noEmit` passed locally through `npm run check`, 2026-08-15.
- [x] `npm test` — 7 files and 29 tests passed locally through `npm run check`, 2026-08-15.
- [x] `npm run build` — Next.js 16.3.1 webpack production build passed locally; CMS-backed public routes are dynamic, 2026-08-15.
- [x] Staging browser/accessibility evidence — Vercel Preview URL above; local Lighthouse plus deployed desktop/mobile route checks, 2026-08-22.
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

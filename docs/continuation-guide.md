# Continuation guide

Last reconciled: 2026-09-02.

## Start here

1. Read `AGENTS.md` and, when securely supplied by the owner, the ignored client source documents in `docs/source/`.
2. Read `docs/architecture.md`, `docs/hostinger-deployment.md`, `docs/decisions.md`, and `docs/acceptance-checklist.md`.
3. Inspect the tree, current branch, and environment before editing. The approved source remote is `https://github.com/Arunodhai/Church-Govern-Website.git`.
4. Read the relevant installed Next.js 16 documentation under `node_modules/next/dist/docs/` before framework changes.
5. Never copy administrator credentials, Sanity tokens, Supabase service-role keys, or Resend keys into source, fixtures, screenshots, or documentation.

## Revised architecture

The new proposal replaces the old custom Supabase content CMS and production Vercel hosting:

- Sanity-hosted Studio: editorial content, media, SEO, and Sanity-managed editor access. Website `/studio` redirects there.
- Supabase: leads, comments, ratings, topic suggestions, moderation, audit data, and operational analytics.
- Supabase Auth at `/admin`: operational staff access only; this is no longer a content editor.
- Resend: lead notification side effect after persistence.
- Hostinger Web Apps: Node.js 22 Next.js server hosting.
- Vercel Preview: temporary no-index stakeholder testing only.
- GA4/GSC and optional Meta: account/consent-dependent integrations.

The old Supabase content tables, seed, Storage relationships, and first two migrations remain legacy rollback/reference data. Do not build new editorial features on them.

## Implemented in this migration

- Sanity Studio configuration/deployment with a safe website configuration-required state and redirect at `/studio`.
- Structured schemas for pages, suites, 17 product modules, blog posts/categories/tags, FAQs, testimonials with publication consent, navigation, footer/site settings, galleries/assets, rich text, and complete per-entry SEO fields.
- GROQ queries restricted to approved/published content.
- Public repository changed from Supabase editorial tables to Sanity; comments/ratings still come from Supabase by blog slug.
- Idempotent Sanity source migration under `src/sanity/seed/` for 7 page shells, 2 suites, 17 modules, 6 blogs plus categories, 10 FAQs, header navigation, footer, and site settings. All editorial records remain provisional. No testimonial or unapproved image/claim is fabricated.
- Supabase migration `202608210003_sanity_blog_engagement.sql` for slug-based engagement.
- Custom Supabase page/module/blog/media editors removed. `/admin` retains leads, moderation, analytics, and audit.
- Admin typography/contrast isolated with `.admin-shell`; active navigation and compact headings corrected in code.
- Resend SDK notification integration with escaped HTML/plain text, saved-record idempotency, and non-destructive failure handling.
- Hostinger runbook and no-store `/api/health`; production robots now use `APP_ENV`.
- A scoped `.public-site` layer gives every public template a white-first editorial system with near-black typography, cool-neutral surfaces, chartreuse primary emphasis and restrained mint information accents, based on the owner-approved dashboard reference. Floating hero badges remain removed. `.admin-shell` remains isolated from the marketing scale and uses the same palette with a near-black rail.
- Product discovery switches/searches Office and Member suites with live counts and hashes. Contact shows one hash-addressable enquiry intent while keeping all forms mounted so entered values survive switching.
- Mobile navigation locks scrolling, moves/traps/restores focus and supports Escape/backdrop close. FAQ live counts, mobile article/legal contents disclosures, larger targets, selected rating state, full-card links and a route loading skeleton were added in the accessibility pass.
- A homepage-only motion layer: page-load keyframes for the hero sequence and scroll-reveal transitions for the twelve sections below it, driven by `src/components/site/home-motion.tsx` and scoped CSS in `src/app/(site)/site-theme.css`. No animation library was added. The server HTML has no hidden state, every rule sits inside `@media (prefers-reduced-motion: no-preference)`, and reduced-motion visitors get the complete unanimated page.

## Account-dependent setup

### Mock testing before account setup

Development uses `USE_MOCK_CONTENT=true` by default. The owner removed the persistent top demo banner; provisional mock sections and records still identify their development-only status in context. `USE_MOCK_OPERATIONS` is a separate boundary: local development defaults to simulated submissions and admin updates, while the Vercel staging configuration uses `false` so leads, topic suggestions, comments, and ratings use Supabase. Production rejects both mock modes regardless of flags.

Use `docs/requirements-demo-matrix.md` as the current scope map. The richer source-code demo intentionally exceeds the 51 provisional Sanity seed documents; it does not alter the connected private dataset or claim that those mock assets are approved.

### Sanity

The user's Sanity account is connected for development testing:

- Project: `Church Govern` (`vc24qe42`)
- Private dataset: `development`
- Hosted Studio: <https://church-govern-development.sanity.studio>
- Deployment app ID: `i3ky4ldedf8211d5dapzf3sy` (recorded in `sanity.cli.ts`)
- Seed: 51 application documents; a second idempotency run left the count at 51

The seed includes 7 pages, 2 suites, 17 modules, 6 blogs, 6 blog categories, 10 FAQs, navigation, footer settings, and site settings. It contains no testimonials or approved records. Sanity also creates its own system schema/retention records, so the dataset's raw total is higher than the 51 application documents.

Local `.env.local` contains the public project, dataset, API-version, and Studio URL values. It intentionally does not contain a Sanity read token. The private dataset is now connected to Vercel Preview through a server-only Viewer token that expires on 2026-10-02. Preview uses `USE_MOCK_CONTENT=false` and `SANITY_CONTENT_DEMO_MODE=true`, so published provisional records can be demonstrated without weakening the production approval filter. The token value is stored only as a sensitive Vercel variable and must never be documented or committed.

For another environment, set:

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `NEXT_PUBLIC_SANITY_API_VERSION`
- `NEXT_PUBLIC_SANITY_STUDIO_URL`
- `SANITY_STUDIO_PROJECT_ID`, `SANITY_STUDIO_DATASET`, and `SANITY_STUDIO_API_VERSION` for the standalone Vite-built Studio; keep them aligned with the matching website values
- `SANITY_API_READ_TOKEN` only for private-dataset reads/preview

Set `NEXT_PUBLIC_SITE_URL`, use `npm run sanity:dev` for local schema work, and deploy Studio with `npm run sanity:deploy`. Put its HTTPS URL in `NEXT_PUBLIC_SANITY_STUDIO_URL`. Sign in with an authorized Sanity user, then run `npm run sanity:seed`. The transaction uses stable IDs and `createOrReplace`, so it is idempotent. Editors must add approved blog thumbnails and review each provisional record before setting content approval to approved. Never document or commit a Sanity token.

### Supabase

The linked development project has migrations `202608140001`, `202608140002`, `202608210003`, and `202608220004` applied. The last two add stable Sanity blog slugs and explicitly restrict engagement RPC execution to the service role. Anonymous table/RPC checks and service-role RPC checks passed on 2026-08-22.

### Resend and Hostinger

Verify a client-owned Resend sender domain and set `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and `LEAD_NOTIFICATION_EMAIL`. Follow `docs/hostinger-deployment.md` for Node 22, build/start settings, environment separation, health checks, DNS, SSL, smoke tests, and rollback.

## Commands

```bash
npm install
cp .env.example .env.local
npm run dev
npm run lint
npm run typecheck
npm test
npm run build
npm run check
npm run sanity:seed
```

Do not run the seed against an account you do not own or without confirming the dataset. Do not claim live import, email, migration, deployment, or analytics success from local build evidence.

## Remaining launch blockers

1. Sanity is connected to the user's test project and Vercel Preview, but production SBL ownership is not established. Preview may render published provisional records for the explicitly approved client demo; production still requires approved media, reviewed/approved records, a client-owned least-privilege token, and removal of `SANITY_CONTENT_DEMO_MODE`.
2. Final Church Govern/FamilyaConnect/SBL relationship copy, mission/vision, legal/privacy language, product screenshots, testimonials/consent, and security/compliance assertions are not approved.
3. Resend sender/recipient configuration and live delivery need verification; an API key alone is not delivery evidence.
4. Hostinger staging and production deployments, DNS/SSL, logs, monitoring, backups, and rollback need evidence.
5. GA4/GSC properties, consent behavior, optional Meta decision, and no-PII network checks are pending.
6. Full screen-reader and Safari/Firefox/Edge checks remain pending. Chrome mobile Lighthouse and desktop/mobile browser sweeps passed locally.
7. Comments/ratings/topic and lead retention, moderation ownership, CMS role matrix, MFA/offboarding, and anti-spam choices require owner approval.

## Latest local verification — 2026-08-23

- The initially quiet homepage insights feature-and-rail was replaced after review with a more expressive magazine composition: compact indexed heading, full-width image-and-chartreuse lead story, and three image-led supporting stories. Sanity content, ordering, ratings and links remain unchanged. Browser checks at 1440 by 900, 820 by 900 and 390 by 844 reported no horizontal overflow; phone article actions measured 44 by 44 pixels and the browser reported no console errors. `npm run check` passed with 13 Vitest files/50 tests and the production build. The layout remains local until pushed and redeployed.
- Every `/blogs/[slug]` route now shares a clean editorial reading system rather than the earlier generic marketing-page treatment. The masthead, article media, desktop/mobile contents navigation, reading column, qualification note, rating panel, moderated comment thread/form and related-reading cards were redesigned without changing Sanity content, metadata or Supabase engagement behavior. All six current slugs rendered successfully in the browser; representative 1280-by-800, 820-by-900 and 390-by-844 checks had no horizontal overflow, the mobile contents disclosure worked, rating actions measured 44 pixels, and the browser reported no console errors. `npm run check` passed with 13 Vitest files/50 tests and the production build. These changes remain local until pushed and redeployed.
- On 2026-08-23, `/blogs` received a focused UI audit and reference-led card redesign. A decorative but non-interactive topic rail was replaced by a truthful editorial guide; the library now has working topic controls with live counts, search clearing, and a responsive 3/2/1 article grid with large bounded imagery, date/category context, summary, read time, rating and a consistent circular reading action. Author portraits/names were deliberately omitted because approved author identities have not been supplied. Search and Governance filtering passed in the live browser; 1280-pixel desktop rendered six equal cards in a 3-column grid, while 390-by-844 rendered one 358-pixel column, a non-overflowing metadata row and 44-pixel actions with no page overflow. `npm run check` passed ESLint with 0 errors, strict TypeScript, 13 Vitest files/50 tests and the Next.js production build. The remaining non-blocking audit debt is promotion of repeated route-local colors into shared tokens.
- `/faq` received a focused decision-support refinement: the oversized decorative question count and passive side rail were replaced by a shorter hero, keyword search across the full FAQ library, topic controls with live counts, contained accordion cards, an explicit empty state and a lighter contact prompt. Sanity reads, wording, FAQ structured data and contact routing remain intact. Search, Security filtering, answer expansion and empty-state recovery passed in the live browser; 1280-by-720 and 390-by-844 checks reported no horizontal overflow. `npm run check` passed with 13 Vitest files/50 tests and the webpack production build.
- `/blogs` received a focused editorial refinement: its hero is shorter, the searchable library has an explicit hierarchy, cards have more deliberate featured/secondary treatments, and the duplicate Latest/Popular lists were removed. The topic rail is wide-screen only because category discovery remains available in the responsive filter. Populated browser checks at 1280 by 720, 820 by 900 and 390 by 844 reported no horizontal overflow; search, category filtering and empty-state recovery passed. `npm run check` passed with 13 Vitest files/50 tests and the webpack production build.
- The development-only “A connected starting point” CMS strip was removed from `/`; the CMS-backed hero now flows directly into the real administration narrative.
- The development-only “Testing the FAQ workspace” CMS strip was removed from `/faq`; the published question count and searchable topic workspace remain intact.
- The development-only “Editorial workspace preview” CMS strip was removed from `/blogs`; visitors now move directly from the Insights hero into article search and filtering.
- The development-only “No certification is being claimed” CMS strip was removed from `/security-compliance`; the substantive implementation-status notice immediately below remains the single qualification shown to visitors.
- The development-only CMS seed strip between the `/product` hero and product introduction was removed after owner review. Its content repeated the substantive connected-records section immediately below; product data, module discovery, metadata and structured data remain unchanged.
- `/contact` received a focused Impeccable redesign after the interim three-column rail/context/form layout proved visually congested. The final decision layer uses three spacious horizontal choices, followed by a full-width gradient context banner and a centered form with its own generous reading width. Repeated labels and decorative tab numbering remain removed, and the development-only CMS seed strip was removed because it did not serve a visitor task. Copy, form fields, validation, hashes and `/api/leads` behavior were not changed.
- The enquiry tabs implement Arrow key, Home and End navigation with roving focus. Browser checks at 1440 by 1000, 1024 by 768 and 390 by 844 covered the demonstration, digitization and general-enquiry states; hash/focus synchronization passed, tablet/mobile had no horizontal overflow, and no application warnings or errors were emitted. The complete `npm run check` passed with 13 Vitest files/50 tests and the Next.js 16.3.1 webpack build; the existing 1,672 warnings remain confined to installed Impeccable tool copies.
- `/product`, `/blogs`, `/faq` and `/contact` received a coordinated Impeccable polish in route-scoped wrappers and the final `site-theme.css` layer. Product now presents a numbered two-column capability catalogue; Blogs promotes the first filtered result as an editorial lead story; FAQ separates category navigation with live counts from its answer column; Contact uses a vertical intent rail with one active enquiry panel. The work preserves content sources, structured data, metadata, links, hashes, forms, validation and API integrations.
- Browser checks at 1440 by 1000 and 390 by 844 covered all four route heroes and populated workspaces. Product suite switching, blog keyword search, FAQ filtering/expansion and Contact intent switching passed; each mobile route matched `scrollWidth` to `clientWidth`, and the browser reported no errors or warnings. Post-polish `npm run check` passed with no ESLint errors, generated route types and strict TypeScript, 13 Vitest files/50 tests, and a successful Next.js 16.3.1 webpack production build. The 1,672 lint warnings remain confined to installed Impeccable tool copies.
- The homepage hero received a focused hierarchy polish without changing CMS copy, destinations or behavior. Its two-sentence title is rendered in two block spans only when the sentence boundary exists, with a strong opening promise and a calmer second statement; the lede, CTA spacing, context rule and trust points were refined to support that hierarchy.
- The suite relationship label was moved off the photograph into an attached white caption rail with dark type and restrained chartreuse connectors. It now occupies the lower-left editorial plane on desktop and becomes a full-width rail immediately after the image below 980px. The three trust points share one desktop row and stack only on phone widths.
- The desktop suite rail width is fixed at exactly 50% of the hero viewport (verified as 720px inside a 1440px hero); below 980px it continues to use the full available width beneath the image.
- The desktop hero now owns a viewport-based 56/44 editorial grid instead of inheriting the narrower global shell. Its 520px maximum copy column is centered mathematically inside the wider text plane with equal responsive gutters; headline leading, tracking and sentence spacing are deliberately more open. The artwork uses the remaining plane while the suite rail reinforces the editorial side, and 1024px, 1440px, 1920px and 390px checks passed without overflow or console warnings.
- The final desktop image transition keeps the copy field solid white through 36%, then fades more quickly to transparent at 66%. This makes the priest and dashboard imagery visibly stronger near the editorial boundary without reducing text contrast; the mobile image remains unmasked.
- Browser checks at 1440 by 1000, 1024 by 768 and 390 by 844 confirmed the polished hero, loaded artwork and no horizontal overflow. Fresh desktop and mobile checks produced no application errors or warnings. The subsequent `npm run check` passed with no ESLint errors, generated route types and strict TypeScript, 13 Vitest files/50 tests, and a successful Next.js 16.3.1 webpack production build.
- The owner-supplied `main img.png` now ships from `public/images/church-govern-main-hero.png` and replaces the rotating development carousel on `/`. On desktop it is a true viewport-wide background immediately below the header, shifted 7% right behind a solid-white-to-transparent reading field so the approved copy remains clean and aligned to the content shell. Layouts below 980px reset the shift, stack the copy and use a full-width subject-focused crop. The source is marked provisional in code until the client approves it.
- Browser checks at 1440 by 1000 and 390 by 844 confirmed the image loaded, spans exactly from the left to right viewport edge, preserves the intended people/interface composition, and keeps `scrollWidth === innerWidth`; the fresh page emitted no browser errors or warnings. Post-integration `npm run check` passed with no ESLint errors, generated route types and strict TypeScript, 13 Vitest files/50 tests, and a successful Next.js 16.3.1 webpack production build.
- `/` now uses a route-scoped connected institutional narrative in `src/app/(site)/page.tsx` and `site-theme.css`: statement-led hero, shared-suite bridge, editorial content strip, ruled responsibilities, dark foundation, product proof, trust boundary, editorial testimonials, gallery and asymmetric insights. Existing copy, content sources, structured data, interactions, routes and integrations remain intact.
- The earlier rotating-hero verification below remains historical evidence for the superseded carousel, not the current `/` media behavior.
- Post-homepage-redesign `npm run check` passed with no ESLint errors, generated route types and strict TypeScript, 13 Vitest files/50 tests, and a successful Next.js 16.3.1 webpack production build. The 1,672 lint warnings come from installed Impeccable tool copies.
- `/about` now uses a route-scoped editorial composition in `src/app/(site)/site-theme.css`: statement-led hero, asymmetric purpose narrative, ruled principles index, factual FamilyaConnect placeholder, full-width historical-records feature, related-product index and pending mission/vision outlook. Approved copy, CMS rendering, links and integrations remain unchanged.
- Browser checks at 1440 by 1000 and 390 by 844 covered the complete About narrative without horizontal overflow. The offset records photograph was changed to an eager, unoptimized local `next/image` asset after wide-screen QA exposed a blank lazy/optimized render in the local browser.
- Post-About-redesign `npm run check` passed with no ESLint errors, generated route types and strict TypeScript, 13 Vitest files/50 tests, and a successful Next.js 16.3.1 webpack production build. Installed Impeccable tool copies still account for the existing lint warnings.
- The operational console was polished across Overview, lead workspaces, moderation, analytics, audit and login. Its final owner-selected palette uses a near-black navigation rail, chartreuse actions/selection, white cards, cool-gray canvas and mint analytics accents, with compact divided metrics, semantic status labels and 44px mobile actions while preserving all operational behavior.
- Authenticated-demo browser checks at 1440 by 1000 covered every `/admin` route; checks at 390 by 844 covered representative dashboard, lead, moderation, analytics, audit and login routes. No horizontal overflow or sub-44px visible actions were found; search, details disclosure and mobile-menu state passed. Live Supabase credential authentication was not revalidated because the current local environment entered explicit demo mode.
- Post-admin-polish `npm run check` passed: ESLint had no errors (installed Impeccable tool copies emit warnings), generated route types plus strict TypeScript passed, 13 Vitest files/50 tests passed, and the Next.js 16.3.1 webpack production build completed.
- Final palette inspection covered Home, Product, Contact, admin Overview and demo leads; Home and demo leads were also rendered at 390 by 844. A fresh `npm run check` passed with 13 Vitest files/50 tests and a successful production build.
- The owner approved the chartreuse/mint gradient language across all public routes. Shared gradients now style primary actions, page/module/article/legal heroes, selected controls, trust/security surfaces, testimonials and final CTA bands; the operational admin remains unchanged. Representative desktop and 390-by-844 templates were visually checked, and `npm run check` passed with 13 files/50 tests and the production build.
- Code-first institutional polish retained the white/charcoal public system, changed bright cobalt to muted institutional blue, strengthened supporting-text contrast, reduced generic card/CTA rounding, and converted CMS information panels to editorial rules. It did not change approved copy, routes, IA, integrations or behavior.
- Desktop browser checks at 1440 by 1000 covered Home, Product, Church Dashboard, Blogs, FAQ, Contact and Privacy; mobile checks at 390 by 844 covered Home, Product, Blogs, FAQ and Contact. All checked pages reported no horizontal overflow, and the Product suite selector still switched to the seven Member Suite modules.
- Post-polish `npm run check` passed: ESLint had no errors (installed Impeccable tool copies emit warnings), generated route types plus strict TypeScript passed, 13 Vitest files/50 tests passed, and the Next.js 16.3.1 webpack production build completed.
- White-theme redesign `npm run check` passed: ESLint, generated Next route types plus strict TypeScript, 13 Vitest files/50 tests, and a Next.js 16.3.1 webpack production build.
- Desktop browser checks covered every public template plus an authenticated operational dashboard at 1280 by 720. Public pages stayed within the viewport width; admin remained outside `.public-site` with its compact 30px dashboard H1.
- Playwright at 390 by 844 found no horizontal overflow on Home, Product or Contact. Home's H1 reduced from about 215px to 143px tall and its preview banner to about 38px; both CTAs and all trust points appear before the media panel.
- Product search returned the expected single Office result for `finance`; Contact retained `churchName` after switching tabs and restored `#request-demo`; FAQ filtering changed the live count from 10 to 2.
- Mobile menu verification confirmed document scroll locking, initial focus on the first navigation link, and Escape restoration of scrolling and trigger focus.
- This redesign is local only at this handoff. Do not describe <https://church-govern-staging.vercel.app> as visually updated until a new commit and deployment are checked.
- `APP_ENV=staging USE_MOCK_CONTENT=true USE_MOCK_OPERATIONS=false npm run check` passed: ESLint, generated route types plus strict TypeScript, 13 Vitest files/48 tests, and the Next.js 16.3.1 webpack production build.
- Migrations `202608210003` and `202608220004` were dry-run and applied. Anonymous operational tables returned zero rows, anonymous engagement RPC execution was denied, and service-role RPC calls succeeded.
- Synthetic live contact, topic, comment, and rating API workflows succeeded against Supabase; all generated QA records and audit events were removed afterward.
- A local staging route sweep and authenticated operational-admin browser sweep passed at desktop and 390-by-844 without horizontal overflow or application console errors.
- Chrome mobile Lighthouse after contrast/name fixes: performance 98, accessibility 100, best practices 100, SEO 69. The SEO score is expected because staging deliberately emits `noindex,nofollow` and disallows crawling.

## Latest local verification — 2026-08-25

- `/` received a motion and polish pass inside the existing owner-approved white-first system. Nothing about the palette, copy, content sources, routes, structured-data entries or CTA destinations changed; the work is presentation only.
- The hero now loads as one ordered sequence rather than appearing at once. Measured from computed styles at 1440 by 1000: first title line 0.06s, second title line 0.15s, lede 0.25s, actions 0.34s, context label 0.43s, suite rail 0.48s, its shared-foundation label 0.76s, its connecting rules 0.9s, with the artwork settling over 1.15s. The twelve sections below the hero fade and rise 15px as they enter the viewport, and grouped children stagger by 70ms.
- Motion is opt-in from the client. The server renders no hidden state, so the page is complete without JavaScript; `src/components/site/home-motion.tsx` applies `data-motion` to `.home-page` before any element is hidden, and all rules live inside `@media (prefers-reduced-motion: no-preference)`. The reduced-motion path was checked and showed a fully visible, unanimated page.
- Arming waits for `window.load` and `document.fonts.ready`. Measuring the fold during hydration classified eight of twelve sections as already seen so they never animated; after the fix zero of twelve are revealed at rest.
- A stepped scroll to the bottom at 390 by 844 (page 11050px, maximum scroll 10206px) revealed all twelve targets in document order. A 3px `home-hero__art` overhang and an unrevealed `home-outro` reported in earlier passes were both measurement artifacts — the first from a viewport that was 433px rather than the requested 390px, the second from a scroll loop that stopped near 7600px. Neither reproduces.
- Two real defects were fixed in the same pass. The `animation` shorthand was resetting `animation-delay` on the second title line, so both lines rose together; the delay selector now matches the shorthand's specificity. The homepage `JsonLd` payload moved from a top-level array to a single `@graph` with one shared `@context`, which removed a reproducible `r["@context"].toLowerCase is not a function` console `TypeError` raised by an external consumer of the markup.
- No migration, environment variable, dependency or package change was made. `.claude/launch.json` gained a local-tooling-only port 3001 development entry.
- Each `npm run check` stage was run separately and exited 0: ESLint with no errors and all 1,673 warnings resolving to installed agent-tool directories with zero findings in `src/`; generated route types plus strict TypeScript; 13 Vitest files and 50 tests; the Next.js 16.3.1 webpack production build with full route collection.
- Verification limits: one Chromium-family browser at 1440 by 1000 and 390 by 844 only. Safari, Firefox, Edge, screen-reader, automated contrast, 200% zoom/reflow and post-change Lighthouse/Core Web Vitals were not run for this change. The work is local and has not been committed, pushed or redeployed.

## Vercel Preview evidence — 2026-08-22

- Stable share URL: <https://church-govern-staging.vercel.app>; Vercel SSO protection is disabled for stakeholder access, while application metadata and `robots.txt` block indexing.
- Final Vercel cloud build passed for commit `69fe9e0`. A deployment-only ignore defect that excluded `src/lib/supabase` was reproduced, fixed in commit `dd4eace`, and the corrected build passed.
- All 38 deployed routes passed with their expected 200/307 statuses, including every module and blog detail, `/admin`, `/studio`, health, robots, and sitemap.
- The stable URL emits its own canonical, `noindex,nofollow`, CSP/security headers, and a disallow-all robots file. A non-persistent contact submission returned the explicit mock success response.
- The home page and representative public/admin-login routes were browser-checked at 1440 by 1000 and 390 by 844 without horizontal overflow or application error states. Vercel's optional feedback-toolbar script is blocked by CSP and produces a provider-only console message for Vercel-authenticated viewers.
- Live Preview integration was activated after explicit owner approval. `SUPABASE_SERVICE_ROLE_KEY`, `RATE_LIMIT_SECRET`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and `LEAD_NOTIFICATION_EMAIL` are sensitive Preview variables; `USE_MOCK_OPERATIONS=false`.
- A synthetic contact enquiry persisted with a real UUID and returned `notificationStatus: sent`. Synthetic topic, pending comment, and rating writes also succeeded. The exact QA records and matching audit entries were removed; rate-limit counters were intentionally retained. `sent` proves provider acceptance, not inbox delivery.
- Supabase administrator authentication succeeded on the deployed domain. Dashboard, three lead collections, comment/topic moderation, analytics, and audit all loaded at 390 by 844 without horizontal overflow or application error states.
- Approved-comment regression fixed in commit `c9850bf`: mock editorial content no longer forces mock engagement when staging operations are live. The affected approved comment was verified in Supabase, the public RPC/API, server-rendered blog HTML, and the visible 390-by-844 blog page after deployment.

- `npm run check` passed: ESLint, generated route types and strict TypeScript, 11 Vitest files/42 tests, and the Next.js 16.3.1 webpack production build.
- Twelve representative public/system routes returned HTTP 200 against `next dev`.
- Desktop and 390-by-844 home views, the Sanity setup gate, and the unauthenticated admin login were visually inspected without application console errors.
- Protected admin pages were not authenticated during this run.
- `npm audit --omit=dev` reports 9 transitive Sanity CLI advisories (8 moderate, 1 high); its suggested forced fix downgrades Sanity across a breaking boundary and was not applied.
- Sanity SDK `2.20.0` caused a Vite JSX parse failure during Studio deployment. Updating the resolved SDK to `2.20.1` fixed the build; the Studio deployment then completed successfully.
- The authenticated Sanity CLI created the private `development` dataset, seeded 51 application documents, and confirmed a second seed run remained at 51. The hosted Studio URL is live, and local `/studio` returns a 307 redirect to it.
- `npm run check` passed after the account connection and SDK patch: ESLint, generated route types plus strict TypeScript, 12 Vitest files/45 tests, and the Next.js webpack production build. Sanity's generated `dist/` is now excluded from lint and version control.
- Development mock mode was added and verified afterward: `npm run check` passed with 12 test files/45 tests; mock comments/ratings and responsive page/gallery behavior passed local HTTP and browser checks.
- The complete demo layer was expanded afterward: all 17 modules now have two clearly labelled UI concepts and two scoped FAQs; blogs have thumbnails/ratings; home media rotates with reduced-motion controls; lead/topic flows simulate safe success; and `/admin` provides representative leads, moderation, workflow, audit, and analytics without persistence.
- A 36-route local HTTP sweep passed, covering core/system routes, every module, every blog detail, `/admin`, and admin analytics. At 390-by-844 CSS pixels, home, module detail, blogs, contact, admin, and analytics had no horizontal overflow; the browser reported no application console errors.
- The hosted Studio initially rendered Sanity's `projectId: missing` error because its standalone Vite build could not expose `NEXT_PUBLIC_SANITY_*`. The config now accepts `SANITY_STUDIO_*`, the local bundle includes `vc24qe42`/`development`, and Studio was successfully redeployed. A clean browser reached Sanity authentication instead of the missing-project error. `npm run check` then passed again with 12 files/45 tests.

## Next safe task

The accumulated public/admin redesign and homepage motion work was committed as `4845c05`, pushed to `origin/main`, and deployed directly to Vercel Preview on 2026-09-02. Deployment `dpl_FEF79fhbsEPr6o31do3BExCM7noY` is assigned to <https://church-govern-staging.vercel.app>. The stable homepage and health endpoint returned HTTP 200, `/studio` returned a 307 to the configured hosted Studio, and the rendered homepage showed the expected hero with no browser console errors. The fourteen local agent-tool directories and local design captures are now ignored; the duplicate `main img.png` was not committed.

On 2026-09-02 the owner explicitly approved an end-to-end client CMS demo on the stable Vercel Preview. Commit `a0985ed` was pushed to `origin/main`, deployed as `dpl_CwgwriThVuVQoPFutdXeWe9mWigd`, and assigned to <https://church-govern-staging.vercel.app>. The private `development` dataset is read with one server-only Viewer token expiring 2026-10-02. `SANITY_CONTENT_DEMO_MODE=true` is guarded against `APP_ENV=production`, includes published provisional records only in staging, and disables Sanity caching so a browser refresh sees a published edit immediately. The safe `npm run sanity:prepare-demo` task fills only missing page hero/SEO fields and does not overwrite editor changes.

A reversible live test changed the published `page-home` hero summary, fetched the stable Vercel homepage and found the unique marker, restored the exact original value, and fetched again to confirm restoration. `/`, `/about`, `/product`, `/blogs`, `/faq`, `/contact`, `/security-compliance`, `/studio`, and `/api/health` all returned successfully. `/studio` completed the expected redirect into Sanity authentication. `npm run check` passed with no lint errors, generated route types and strict TypeScript, 13 Vitest files/51 tests, and the Next.js 16.3.1 webpack production build.

The next safe task is to invite each client tester's own email to project `vc24qe42` as Editor when they must create, edit, and publish test records. Do not distribute a shared Sanity username/password or Administrator access. Explain that only Sanity-modeled/rendered fields update the website; code-owned layout and decorative sections do not become editable automatically. Before 2026-10-02, rotate or replace the staging Viewer token if the demo continues.

The first manual page edit exposed a Studio schema defect: the shared `imageWithAlt` type required an image and alt text even when the containing hero image field was intentionally unused. This disabled Publish for a text-only homepage edit. The type now treats the image as optional and requires 3–180 character alternative text only when an asset is selected. The user's `Hello Testing` change remains autosaved in `drafts.page-home`. Dataset validation passed for all 53 application documents with zero errors, and the corrected Studio was redeployed successfully on 2026-09-02. Editors should refresh an already-open Studio tab before publishing.

Separately, confirm the QA notification arrived at the temporary recipient, rotate the Resend key because it was pasted into chat, and replace the sensitive Vercel value. When real material arrives, replace mock copy/media/testimonials and approve records in Sanity; then decide private-dataset access, disable editorial mock mode, verify public Sanity rendering, configure analytics, and run the full screen-reader/cross-browser suite before Hostinger staging. Establish SBL ownership before production.

Use exact evidence language: implemented means code exists; tested means named checks ran; deployed means a target URL was checked; production-ready requires every applicable release gate.

# Continuation guide

Last reconciled: 2026-08-22.

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

## Account-dependent setup

### Mock testing before account setup

Development uses `USE_MOCK_CONTENT=true` by default. A visible banner marks provisional editorial content. `USE_MOCK_OPERATIONS` is a separate boundary: local development defaults to simulated submissions and admin updates, while the Vercel staging configuration uses `false` so leads, topic suggestions, comments, and ratings use Supabase. Production rejects both mock modes regardless of flags.

Use `docs/requirements-demo-matrix.md` as the current scope map. The richer source-code demo intentionally exceeds the 51 provisional Sanity seed documents; it does not alter the connected private dataset or claim that those mock assets are approved.

### Sanity

The user's Sanity account is connected for development testing:

- Project: `Church Govern` (`vc24qe42`)
- Private dataset: `development`
- Hosted Studio: <https://church-govern-development.sanity.studio>
- Deployment app ID: `i3ky4ldedf8211d5dapzf3sy` (recorded in `sanity.cli.ts`)
- Seed: 51 application documents; a second idempotency run left the count at 51

The seed includes 7 pages, 2 suites, 17 modules, 6 blogs, 6 blog categories, 10 FAQs, navigation, footer settings, and site settings. It contains no testimonials or approved records. Sanity also creates its own system schema/retention records, so the dataset's raw total is higher than the 51 application documents.

Local `.env.local` contains the public project, dataset, API-version, and Studio URL values. It intentionally does not contain a Sanity read token. The dataset is private, so server-side website reads require `SANITY_API_READ_TOKEN`; alternatively the owner may explicitly change dataset visibility after reviewing that tradeoff. Keep `USE_MOCK_CONTENT=true` until that access decision is made and selected records are reviewed and approved.

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

1. Sanity is connected to the user's test project, but production SBL ownership is not established. The private dataset still needs a server-only read-token decision, approved media, and reviewed/approved records before public Sanity rendering can replace mock mode.
2. Final Church Govern/FamilyaConnect/SBL relationship copy, mission/vision, legal/privacy language, product screenshots, testimonials/consent, and security/compliance assertions are not approved.
3. Resend sender/recipient configuration and live delivery need verification; an API key alone is not delivery evidence.
4. Hostinger staging and production deployments, DNS/SSL, logs, monitoring, backups, and rollback need evidence.
5. GA4/GSC properties, consent behavior, optional Meta decision, and no-PII network checks are pending.
6. Full screen-reader and Safari/Firefox/Edge checks remain pending. Chrome mobile Lighthouse and desktop/mobile browser sweeps passed locally.
7. Comments/ratings/topic and lead retention, moderation ownership, CMS role matrix, MFA/offboarding, and anti-spam choices require owner approval.

## Latest local verification — 2026-08-22

- `APP_ENV=staging USE_MOCK_CONTENT=true USE_MOCK_OPERATIONS=false npm run check` passed: ESLint, generated route types plus strict TypeScript, 13 Vitest files/48 tests, and the Next.js 16.3.1 webpack production build.
- Migrations `202608210003` and `202608220004` were dry-run and applied. Anonymous operational tables returned zero rows, anonymous engagement RPC execution was denied, and service-role RPC calls succeeded.
- Synthetic live contact, topic, comment, and rating API workflows succeeded against Supabase; all generated QA records and audit events were removed afterward.
- A local staging route sweep and authenticated operational-admin browser sweep passed at desktop and 390-by-844 without horizontal overflow or application console errors.
- Chrome mobile Lighthouse after contrast/name fixes: performance 98, accessibility 100, best practices 100, SEO 69. The SEO score is expected because staging deliberately emits `noindex,nofollow` and disallows crawling.

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

Finish and verify the Vercel Preview deployment without weakening `noindex`. When real material arrives, replace mock copy/media/testimonials and approve records in Sanity; then decide private-dataset access, disable editorial mock mode, verify public Sanity rendering, configure Resend sender/recipient and analytics, and run the full screen-reader/cross-browser suite before Hostinger staging. Establish SBL ownership before production.

Use exact evidence language: implemented means code exists; tested means named checks ran; deployed means a target URL was checked; production-ready requires every applicable release gate.

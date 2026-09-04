<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Church Govern continuation guide

## Mission and source of truth

Build the public marketing and content-management website described by the client requirements and revised proposal. Local copies may exist under ignored `docs/source/`; they are intentionally excluded from the public repository. The implementation must be truthful, accessible, responsive, secure by default, and ready to hand to another team.

Use these sources in this order:

1. The client's approved clarifications and supplied content/assets.
2. The requirements document.
3. The architecture and delivery records in `docs/`.
4. Existing implementation and tests.

If the sources disagree, document the conflict instead of silently choosing. Never invent company history, testimonials, product screenshots, compliance certifications, security guarantees, pricing, customer counts, or operational metrics.

## Implemented architecture and pending client change

The bullet points below describe the currently working implementation from the revised proposal dated 2026-08-21. On 2026-09-04 the owner reported a newer client request: use WordPress as a headless CMS while retaining the Next.js frontend. The WordPress migration is **not implemented** in the current repository. Preserve the Sanity path as a rollback baseline until the WordPress adapter, content migration, media, SEO, preview, and publishing flows are verified. Read `HANDOFF.md` before starting that work and record resolved choices in `docs/decisions.md`.

- Next.js 16 App Router with React 19 and TypeScript.
- Sanity is the editorial CMS and media system. Sanity hosts Studio and manages access; the website `/studio` route redirects to its configured HTTPS URL.
- Supabase PostgreSQL stores operational data: leads, comments, ratings, topic suggestions, audit events, and aggregate analytics. Supabase Auth protects the separate `/admin` operations console.
- Resend sends transactional lead notifications after successful Supabase persistence.
- Vercel hosts the current no-index Preview environment. Hostinger Web Apps remains the proposal staging/production target.
- Server Components by default. Use Client Components only for browser-only state or interaction.
- Supabase Row Level Security is a required authorization boundary. UI hiding is not authorization.
- Public content should be rendered server-side or statically where practical for SEO. Administrative routes must be dynamic and authenticated.

Read the relevant files under `node_modules/next/dist/docs/` before changing framework code. This repository uses a newer Next.js version whose APIs may differ from remembered patterns.

## Project boundaries

- `src/app/`: routes, layouts, route handlers, metadata, and page composition.
- `src/components/`: reusable UI; keep domain-specific components grouped by feature.
- `src/lib/`: pure helpers and server/client integration boundaries.
- `src/sanity/`: Sanity schemas, GROQ queries, Studio structure, and idempotent seed/import tooling.
- `supabase/migrations/`: immutable, ordered operational-data migrations. Never edit an applied migration; add a new one.
- `public/`: approved static assets only. Do not treat starter assets as production content.
- `docs/`: architecture, operational procedures, decisions, acceptance evidence, and handoff notes.

Do not expose the Supabase service-role key, Sanity token, Resend secret, or any privileged credential to client bundles. Environment variables prefixed with `NEXT_PUBLIC_` are public by definition.

## Content and placeholder policy

- Clearly label provisional content in code or CMS seed data.
- Development-only placeholders may establish layout, but must not appear in a production deployment.
- Do not fabricate testimonials, people, church names, legal claims, product screens, or external URLs.
- Use neutral image placeholders with useful alt text until licensed assets are approved.
- Product security, DPDP, and GDPR copy must be supplied or explicitly approved by the product/legal owner before launch.
- Every launch candidate must pass the content gate in `docs/acceptance-checklist.md`.

## Security and data rules

- Validate all form input on the server even when client validation exists.
- Apply least privilege and explicit RLS policies to every exposed table and storage bucket.
- Public users may read only published content and create only narrowly scoped submissions.
- Public users must never list lead submissions, CMS drafts, profiles, or moderation queues.
- Privileged mutations belong in server-only code and must re-check authorization.
- Never send form-field PII to analytics.
- Blog comments, ratings, topic moderation, and the custom admin analytics dashboard are required launch scope. They must include moderation, abuse controls, privacy, retention, and role-based access rather than being shipped as unsecured UI-only features.

## Working agreement

Before editing:

1. Read this file and the relevant document in `docs/`.
2. Inspect the current tree and working state; preserve changes from other agents.
3. Identify whether the requirement is confirmed, provisional, or unresolved.

For implementation:

- Keep page composition thin and move reusable data/validation logic into typed modules.
- Use semantic HTML, keyboard-operable interactions, visible focus, labeled errors, and reduced-motion behavior.
- Add focused tests for pure validation, mapping, search, or authorization helpers.
- Do not claim a build, test, migration, deployment, or browser flow passed unless the command or flow actually ran.
- Record material architecture or scope choices in `docs/decisions.md`.

Before handoff:

1. Run the relevant lint, tests, type/build, and browser checks.
2. Update `docs/acceptance-checklist.md` with evidence and unresolved items.
3. Update `docs/continuation-guide.md` with current status, migrations, environment changes, and the next safe task.
4. State verification limits precisely.

## Current handoff snapshot — 2026-09-04

- Git source is published to the approved public repository `Arunodhai/Church-Govern-Website`. Client source documents, environment files, and provider linkage metadata are intentionally excluded.
- Vercel Preview is live at `https://church-govern-staging.vercel.app`. It is shareable without Vercel SSO, deliberately `noindex`, and uses live Supabase operations. Server-only Supabase, rate-limit, and Resend values are stored as sensitive Preview variables.
- The revised proposal replaces the custom Supabase editorial CMS and Vercel with Sanity Studio and Hostinger Web Apps. Public editorial reads go through `src/lib/content/repository.ts`; Supabase remains the operational data/auth boundary.
- The user's private Sanity development dataset is connected and has an idempotent 51-document provisional seed: 7 pages, 2 suites, 17 modules, 6 blogs, 6 categories, 10 FAQs, navigation, footer, and settings. It contains no fabricated testimonials. The owner explicitly approved exposing its published provisional content through the no-index Vercel staging demo.
- Development mock mode demonstrates the complete proposed experience while client material is pending: all public pages, 17 modules with UI concepts and FAQs, blogs with thumbnails/ratings, an owner-selected provisional homepage hero, gallery/lightbox, forms, engagement, representative operational records, workflows, moderation, audit, and illustrative analytics. The previous rotating hero component remains available in source but is superseded on `/` by `public/images/church-govern-main-hero.png`.
- Editorial mock mode is never available in production. Local mock operations are simulated; Vercel Preview now uses live Sanity editorial content plus live Supabase operations. `SANITY_CONTENT_DEMO_MODE=true` is staging-only and cannot bypass approval filters in production. See `docs/requirements-demo-matrix.md`.
- `/admin` is operational only. Its typography/contrast defect is fixed through an isolated `.admin-shell` treatment; representative public/admin routes have no horizontal overflow at 390-by-844.
- The public site now has a separate white-first editorial design system in `src/app/(site)/site-theme.css`: near-black typography, cool-neutral surfaces, chartreuse primary emphasis and restrained mint information accents, based on the owner-approved dashboard reference. Its code-first polish reduces generic card/CTA rounding and renders CMS information as editorial rules without changing content, routes or behavior. `/` uses a connected institutional narrative with a polished two-voice statement hero over the owner-selected full-bleed artwork, suite bridge, ruled content indexes, product proof and editorial testimonials; `/about` has its own institutional editorial composition with a reliable records image and truthful pending-content states. The site also includes Product suite/search discovery, a single-intent Contact workspace, mobile navigation focus management, mobile article/legal contents disclosures, FAQ live counts and a route loading skeleton.
- Latest post-polish verification on 2026-08-22: `npm run check` passed ESLint with no errors, generated route types/strict TypeScript, 13 Vitest files/50 tests and the webpack production build. Home, Product, Church Dashboard, Blogs, FAQ, Contact and Privacy were checked at 1440 by 1000; representative mobile pages were checked at 390 by 844 with no horizontal overflow. The local polish is not yet pushed or deployed.
- Latest About-page verification on 2026-08-22: the route-scoped editorial redesign passed desktop 1440-by-1000 and mobile 390-by-844 browser checks without horizontal overflow; the records photograph was verified loaded; `npm run check` passed with 13 Vitest files/50 tests and the webpack production build.
- The operational `/admin` console uses the same reference palette with a near-black navigation rail, chartreuse selection/actions, white cards, cool-gray canvas and mint analytics accents. It retains denser metric bands, semantic workflow statuses and 44px mobile actions. The palette refresh was checked on dashboard and lead-management views at desktop and 390 by 844. The local environment used explicit demo-administrator mode, so live Supabase credential authentication was not revalidated in that pass.
- Latest palette verification on 2026-08-22: `npm run check` passed ESLint with warnings only from installed Impeccable tool copies, generated route types/strict TypeScript, 13 Vitest files/50 tests and the webpack production build. Home, Product, Contact, admin dashboard and lead management were visually checked; Home and lead management were also checked at 390-by-844.
- The owner approved the homepage chartreuse/mint gradient trial for all public routes. Shared public gradients now cover primary actions, hero atmospheres, selected controls, trust/security surfaces, testimonials and final CTA bands; admin remains unchanged. Product, FAQ, Security/Compliance and Contact were checked at desktop, while Product, a module detail, an article and FAQ were checked at 390-by-844. A fresh `npm run check` passed with 13 files/50 tests and the production build.
- A homepage-only motion layer was added on 2026-08-25: an ordered hero load sequence and scroll reveals for the twelve sections below it, from CSS keyframes/transitions in `src/app/(site)/site-theme.css` plus `src/components/site/home-motion.tsx`. No dependency was added. The server HTML carries no hidden state, all rules sit inside `@media (prefers-reduced-motion: no-preference)`, and the reduced-motion path shows the complete unanimated page. The same pass fixed an `animation-delay` specificity defect on the second hero title line and converted the homepage JSON-LD from a top-level array to a single `@graph`, which removed a reproducible console `TypeError` from an external consumer of the markup.
- Latest motion verification on 2026-08-25: each `npm run check` stage exited 0 — ESLint with no errors and all 1,673 warnings resolving to installed agent-tool directories with zero findings in `src/`, generated route types plus strict TypeScript, 13 Vitest files/50 tests, and the Next.js 16.3.1 webpack production build. At a true 390-by-844 viewport the document and body both reported zero horizontal overflow with no element past the viewport edge, and a stepped scroll to the bottom revealed all twelve targets in order. Hero delays were measured from computed styles at 1440 by 1000. Only one Chromium-family browser was used; Safari, Firefox, Edge, screen-reader, contrast tooling, zoom/reflow and post-change Lighthouse were not run.
- The accumulated redesign was committed as `4845c05`, pushed to `origin/main`, deployed to Vercel Preview as `dpl_FEF79fhbsEPr6o31do3BExCM7noY`, and assigned to `https://church-govern-staging.vercel.app` on 2026-09-02. The stable URL returned HTTP 200, `/api/health` returned `status: ok`, `/studio` returned a 307 to the hosted Sanity Studio, and the homepage hero rendered without browser console errors.
- Latest verification on 2026-08-22: staging-mode `npm run check` passed ESLint, generated route types plus strict TypeScript, 13 Vitest files/48 tests, and the Next.js 16.3.1 webpack production build. A complete local route sweep and authenticated admin desktop/mobile checks passed. Mobile Lighthouse scored 98 performance, 100 accessibility, and 100 best practices; SEO is deliberately reduced by staging `noindex`.
- Migrations `202608210003` and `202608220004` are applied. Anonymous RLS checks returned no operational rows and denied both engagement RPCs; service-role RPC checks passed. Synthetic live lead/topic/comment/rating flows passed and their QA data was removed. Resend delivery, GA4/GSC, Hostinger production, approved content/media, backup/rollback, and full cross-browser audits remain unverified.
- The final Vercel cloud build passed. The stable URL passed 38 HTTP routes, health, security/no-index headers, canonical/robots checks, and a simulated contact submission. Desktop 1440-by-1000 and mobile 390-by-844 rendered without horizontal overflow. Vercel's optional feedback-toolbar script is blocked by CSP and may appear as a provider-only console message.
- A Supabase administrator account exists, but credentials must be obtained from the owner through a secure channel. Never add the email/password or service-role key to documentation, source, screenshots, or test fixtures.
- Latest deployed integration evidence: contact persistence returned a real UUID and `notificationStatus: sent`; topic, moderated comment, and rating writes also succeeded. The exact QA records and matching audit entries were removed, while rate-limit counters were preserved. Supabase administrator login and every operations route passed at 390-by-844. Resend inbox delivery still needs human confirmation.
- On 2026-09-02 commit `a0985ed` was pushed and deployed as `dpl_CwgwriThVuVQoPFutdXeWe9mWigd` to the stable Vercel staging URL. Preview uses one sensitive server-only Viewer token for private Sanity reads (expires 2026-10-02), `USE_MOCK_CONTENT=false`, and `SANITY_CONTENT_DEMO_MODE=true`. A reversible published homepage edit appeared immediately on the stable site and the exact original content was restored. Representative routes and health passed, and `npm run check` passed with 13 files/51 tests plus the production build.
- A text-only homepage edit initially could not publish because the reusable `imageWithAlt` schema incorrectly required an asset and alt text in every optional image slot. It now requires alt text only when an asset is selected. The existing `Hello Testing` homepage draft remains stored, all 53 documents passed error-level validation, and the corrected hosted Studio was redeployed on 2026-09-02. Refresh an already-open Studio tab to load the new schema.
- The newest client direction is WordPress as a headless CMS with the existing Next.js frontend. No WordPress code, instance, content model, plugin selection, API authentication, migration, or deployment has been completed. The safe next task is the staged adapter-first sequence in `HANDOFF.md`; do not delete Sanity first.
- If the Sanity-backed preview continues during migration, use individual least-privilege editor invitations rather than shared credentials. Before 2026-10-02, rotate or replace the staging Viewer token if it remains in use. Separately confirm the notification recipient and rotate any credential that was pasted into chat.

## Common commands

```bash
npm install
cp .env.example .env.local
npm run dev
npm run lint
npm run typecheck
npm test
npm run build
npm run check
```

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

## Confirmed architecture (revised proposal, 2026-08-21)

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

## Current handoff snapshot — 2026-08-22

- Git source is published to the approved public repository `Arunodhai/Church-Govern-Website`. Client source documents, environment files, and provider linkage metadata are intentionally excluded.
- The revised proposal replaces the custom Supabase editorial CMS and Vercel with Sanity Studio and Hostinger Web Apps. Public editorial reads go through `src/lib/content/repository.ts`; Supabase remains the operational data/auth boundary.
- The user's private Sanity development dataset is connected and has an idempotent 51-document provisional seed: 7 pages, 2 suites, 17 modules, 6 blogs, 6 categories, 10 FAQs, navigation, footer, and settings. It contains no fabricated testimonials and still requires an approved read-token/visibility decision.
- Development mock mode demonstrates the complete proposed experience while client material is pending: all public pages, 17 modules with UI concepts and FAQs, blogs with thumbnails/ratings, hero rotation, gallery/lightbox, forms, engagement, representative operational records, workflows, moderation, audit, and illustrative analytics.
- Editorial mock mode is visibly labelled and never available in production. Local mock operations are simulated; Vercel Preview is configured for mock editorial content with live Supabase operations. See `docs/requirements-demo-matrix.md`.
- `/admin` is operational only. Its typography/contrast defect is fixed through an isolated `.admin-shell` treatment; representative public/admin routes have no horizontal overflow at 390-by-844.
- Latest verification on 2026-08-22: staging-mode `npm run check` passed ESLint, generated route types plus strict TypeScript, 13 Vitest files/48 tests, and the Next.js 16.3.1 webpack production build. A complete local route sweep and authenticated admin desktop/mobile checks passed. Mobile Lighthouse scored 98 performance, 100 accessibility, and 100 best practices; SEO is deliberately reduced by staging `noindex`.
- Migrations `202608210003` and `202608220004` are applied. Anonymous RLS checks returned no operational rows and denied both engagement RPCs; service-role RPC checks passed. Synthetic live lead/topic/comment/rating flows passed and their QA data was removed. Resend delivery, GA4/GSC, Hostinger production, approved content/media, backup/rollback, and full cross-browser audits remain unverified.
- A Supabase administrator account exists, but credentials must be obtained from the owner through a secure channel. Never add the email/password or service-role key to documentation, source, screenshots, or test fixtures.
- Recommended next task: run the client walkthrough using mock mode, record feedback against the requirements matrix, and replace each labelled placeholder with approved Sanity content/assets before disabling demo mode.

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

# Developer handoff

Last updated: 2026-09-04.

This is the fastest safe entry point for the next developer and their coding agent. Read this file, then `AGENTS.md`, then `docs/continuation-guide.md` before changing code.

## What exists today

- A substantial Next.js 16 / React 19 / TypeScript demo website with responsive public routes, SEO helpers, forms, galleries, blog search/filtering, ratings, and moderated comments. Final client content and release acceptance are still pending.
- A separate Supabase-authenticated `/admin` operations console for leads, moderation, analytics, and audit. It is not the editorial CMS.
- Supabase PostgreSQL and Auth for operational data and access control.
- Resend integration for lead notification email.
- A working Sanity editorial integration, schemas, seed tooling, and hosted Studio. The current Vercel staging site reads published content from the private Sanity development dataset.
- Development mock content for working without external services.
- A no-index Vercel stakeholder preview at <https://church-govern-staging.vercel.app>.

The repository is functional in its current Sanity-backed state. Do not remove that path until a WordPress replacement has been built and verified end to end.

## New client direction: WordPress

On 2026-09-04 the owner reported that the client wants **WordPress as a headless CMS while retaining the existing Next.js frontend**. This is a new direction agreed in conversation; it is not implemented in this commit and has not yet been reconciled with the Sanity-based revised proposal.

Expected target boundary:

- Next.js remains the public frontend and integration layer.
- WordPress becomes the editorial system for pages, modules, blogs, FAQs, navigation, galleries/media, site settings, and SEO fields.
- Supabase continues to own leads, comments, ratings, topic suggestions, moderation, audit, analytics, and `/admin` authentication.
- Resend continues to send transactional lead notifications.
- Hosting ownership and the final production runtime remain client decisions; the current Vercel deployment is staging only.

Do not start by deleting `src/sanity/`. First record the WordPress API, field model, preview/publishing behavior, media/SEO plugin choices, webhook/revalidation design, authentication boundary, and migration/rollback plan in `docs/decisions.md`.

## First safe implementation sequence

1. Confirm where the WordPress staging instance will run and who owns it. A local instance is suitable for development; independent client testing requires a publicly reachable staging instance.
2. Inventory every public content method and type in `src/lib/content/`. Treat this typed repository as the migration seam.
3. Map the existing Sanity schemas in `src/sanity/schemaTypes/` to WordPress content types and fields. Preserve slugs because Supabase blog engagement is keyed by blog slug.
4. Add a WordPress adapter behind the existing repository interface. Keep Sanity available as a rollback path until route, metadata, sitemap, image, gallery, search, FAQ, comment, and rating checks pass.
5. Add server-only configuration and validation. Never place WordPress administrator credentials or application passwords in `NEXT_PUBLIC_*` variables.
6. Create idempotent migration/seed tooling for provisional content. Do not migrate unapproved claims or fabricate content.
7. Verify edit -> publish -> Next.js render on staging, including metadata and media. Then document the cutover and only afterward remove obsolete Sanity code.

## Clone and run

Prerequisites: Node.js 22 and npm.

```bash
git clone https://github.com/Arunodhai/Church-Govern-Website.git
cd Church-Govern-Website
npm install
cp .env.example .env.local
npm run dev
```

With the example development flags, the website can run using mock content and mock operations without private provider credentials. Open:

- Public website: <http://localhost:3000>
- Operations console: <http://localhost:3000/admin>
- Health endpoint: <http://localhost:3000/api/health>
- Current Sanity redirect/setup boundary: <http://localhost:3000/studio>

Provider credentials must be given privately by the owner and stored only in `.env.local` or the hosting provider's secret store. Never ask for or commit shared account passwords.

## Verification before a pull request or handoff

```bash
npm run check
```

This runs lint, generated Next.js route types plus strict TypeScript, Vitest, and a production build. For UI or integration changes, also test the affected route at desktop and 390-by-844, check keyboard behavior and horizontal overflow, and record the evidence in `docs/acceptance-checklist.md`.

## Important constraints

- Read the installed Next.js documentation under `node_modules/next/dist/docs/` before framework changes; this repository uses APIs newer than many model training snapshots.
- Preserve the white-first public visual system and the separate compact admin system unless the owner explicitly requests a redesign.
- Preserve the public routes and the Supabase operational boundary during the CMS migration.
- Do not expose tokens, service-role keys, Resend secrets, WordPress application passwords, or administrator credentials.
- Do not edit already-applied Supabase migrations. Add a new ordered migration if operational schema changes are required.
- Client source documents under `docs/source/` and local environment/provider metadata are intentionally ignored and are not available from the public clone.
- Final content, licensed media, testimonials/consent, legal/security claims, analytics, production ownership, backup, and cross-browser acceptance remain release gates.

## Documentation map

- `AGENTS.md`: mandatory coding-agent rules and current snapshot
- `docs/continuation-guide.md`: detailed implementation and verification history
- `docs/architecture.md`: current and proposed system boundaries
- `docs/codebase-map.md`: routes, APIs, repositories, and test ownership
- `docs/decisions.md`: decisions, conflicts, and unresolved questions
- `docs/acceptance-checklist.md`: evidence and launch gates
- `docs/requirements-demo-matrix.md`: requirements-to-demo coverage
- `.env.example`: public configuration contract with blank secret values

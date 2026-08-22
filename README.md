# Church Govern website

Church Govern is a public product, editorial, and lead-generation website for a church-administration platform. The revised architecture uses Next.js for the website, Sanity for editorial content and media, Supabase PostgreSQL for operational records, Resend for transactional notifications, and Hostinger Web Apps for hosting.

Client-supplied content and the detailed feature requirements remain the scope source. Content in this repository is provisional until the client approves it. Do not invent testimonials, product screenshots, compliance claims, customer data, or company history.

## Architecture

- Next.js 16 App Router, React 19, TypeScript, and Tailwind CSS
- Sanity-hosted Studio for pages, modules, blogs, FAQs, navigation, galleries, media, SEO, and site settings; `/studio` redirects editors there
- Supabase PostgreSQL for leads, comments, ratings, topic suggestions, audit records, and aggregate operational analytics
- Existing Supabase Auth only for the operational dashboard at `/admin`; Sanity manages Studio access
- Resend for server-side lead notification email
- Vercel Preview for the current private stakeholder test deployment; Hostinger Web Apps remains the proposal production target
- GA4 and Google Search Console boundaries, with optional Meta tracking only after consent approval

The old Supabase content tables and Storage model are retained as legacy rollback data, but public content reads must go through `src/lib/content/repository.ts` and Sanity. Do not add new editorial reads or writes to the old tables.

## Local setup

Use Node.js 22 and npm.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open the public website at <http://localhost:3000>, Sanity Studio at <http://localhost:3000/studio>, the operational dashboard at <http://localhost:3000/admin>, and the health check at <http://localhost:3000/api/health>.

Without Sanity identifiers and a hosted Studio URL, `/studio` shows a safe setup screen. Run `npm run sanity:dev` for local schema work. Public pages use development-only source content where available; production deliberately has no source-code fallback.

### Development mock content

Local development enables a clearly labelled, end-to-end demo by default. It covers all seven page shells, 17 complete module demonstrations, six blogs with thumbnails and ratings, ten global plus 34 module-specific FAQs, navigation, testimonials, rotating hero media, galleries/lightbox, comments, ratings, lead forms, topic suggestions, and the operational dashboard. `USE_MOCK_CONTENT` controls provisional editorial content separately from `USE_MOCK_OPERATIONS`. Local demo writes are simulated by default; staging uses mock editorial content with live Supabase operations. Production always rejects mock content and operations.

The demo is intended for stakeholder review before the client supplies final copy, branding, product screenshots, consented testimonials, legal/security claims, account ownership, and analytics/email configuration. A detailed requirement-to-demo map is available in [docs/requirements-demo-matrix.md](docs/requirements-demo-matrix.md).

## Environment boundaries

See `.env.example` for the complete contract. Important values are `APP_ENV`, `NEXT_PUBLIC_SITE_URL`, Sanity public identifiers, Supabase public identifiers and server-only service role, plus server-only Resend credentials and recipients. Never commit credentials. Any variable prefixed with `NEXT_PUBLIC_` is visible to browsers.

## Content migration

The Sanity schemas and idempotent seed live under `src/sanity/`. The current test project is `vc24qe42`, its private dataset is `development`, and its hosted Studio is <https://church-govern-development.sanity.studio>. Sign in to the Sanity CLI as an authorized project member before running the documented seed command; do not put a write token in the repository. Seeded records remain provisional until an editor approves them. Testimonials and unapproved legal/security claims are intentionally not created. Production ownership still needs to be transferred to or recreated under the approved SBL account.

Supabase migrations are immutable and ordered in `supabase/migrations/`. Migration `202608210003_sanity_blog_engagement.sql` changes comments and ratings to use stable Sanity blog slugs while keeping optional legacy post references. Migration `202608220004_lock_down_sanity_engagement_rpcs.sql` explicitly limits the new engagement RPCs to the service role.

## Verification

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run check
```

Do not claim deployment, live content import, email delivery, account configuration, or production analytics succeeded unless it was tested in that environment.

## Handoff documentation

- [Continuation guide](docs/continuation-guide.md)
- [Architecture](docs/architecture.md)
- [Hostinger deployment](docs/hostinger-deployment.md)
- [Database and security](docs/database-and-security.md)
- [Acceptance checklist](docs/acceptance-checklist.md)
- [Decisions](docs/decisions.md)
- [Codebase map](docs/codebase-map.md)

Contributors and coding agents must read [AGENTS.md](AGENTS.md) before editing.

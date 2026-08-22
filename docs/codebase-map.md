# Codebase map

Use this map after reading `AGENTS.md` and `continuation-guide.md`. It describes the current implementation, not a future proposal.

## Primary directories

| Path | Responsibility |
| --- | --- |
| `src/app/(site)/` | Public Server Component routes and public layout |
| `src/app/studio/` | Embedded Sanity Studio and configuration-required state |
| `src/app/admin/` | Supabase-authenticated operational dashboard for leads, moderation, analytics, and audit |
| `src/app/api/` | Validated public writes, engagement, health, and authenticated operational handlers |
| `src/components/site/` | Public navigation, forms, blog engagement, galleries/lightbox, and page components |
| `src/components/admin/` | Operational dashboard navigation and lead/moderation UI |
| `src/components/seo/` | Metadata and structured-data helpers |
| `src/lib/content/` | Typed Sanity public-content repository, mappers, and Supabase engagement join |
| `src/lib/email/` | Resend lead notifications and escaped text/HTML templates |
| `src/lib/supabase/` | Environment parsing, browser/server/admin clients, auth context, proxy, and database types |
| `src/sanity/` | Studio schemas/structure, GROQ queries, clients, and idempotent source migration |
| `src/lib/validation/` | Zod contracts, request-origin checks, fingerprints, rate limiting, and admin workflows |
| `src/content/site.ts` | Development fallback/source content; not a production database substitute |
| `supabase/migrations/` | Immutable schema, triggers, functions, RLS, and Storage policies |
| `supabase/seed.sql` | Legacy content baseline; not the forward editorial system |
| `docs/source/` | Original requirements and revised proposal source documents |

## Public routes

- `/`
- `/about`
- `/product`
- `/product/[slug]` for all 17 modules
- `/security-compliance`
- `/blogs`
- `/blogs/[slug]`
- `/faq`
- `/contact`
- `/privacy`
- `/terms`
- `/accessibility`
- `/sitemap.xml`, `/robots.txt`, and the web manifest

Public data entry points are exported by `src/lib/content/repository.ts`: page, module list/detail, blog list/detail, FAQ, testimonial, navigation, gallery, blog engagement, and full-site bundle reads.

## Public APIs

| Method and route | Purpose |
| --- | --- |
| `POST /api/leads` | Discriminated demo, digitization, and contact submissions |
| `POST /api/topic-suggestions` | Moderated editorial topic suggestion |
| `GET /api/blog/[slug]/comments` | Approved public comments only |
| `POST /api/blog/[slug]/comments` | Validated pre-moderated comment |
| `GET /api/blog/[slug]/ratings` | Safe aggregate rating data |
| `POST /api/blog/[slug]/ratings` | Rate-limited 1–5 rating |

Public-write behavior is validated in `src/lib/validation/forms.ts` and protected by the server boundary in `src/lib/validation/api.ts`. Do not replace these with anonymous direct table writes.

## Editorial and operational routes

- `/studio` — Sanity-managed editorial CMS and assets
- `/admin/login`
- `/admin`
- `/admin/manage/[collection]`
- `/admin/manage/[collection]/[id]`

The operational collection registry is `src/app/admin/collections.ts`. Current access groups:

- Leads: `demo-leads`, `digitization-leads`, `inquiries`
- Engagement: `comments`, `topic-suggestions`
- Insights: `analytics`, `audit`

Roles represented in code/database types are `super_admin`, `content_editor`, `seo_manager`, `lead_manager`, `moderator`, and `analyst`. Always enforce roles server-side and through RLS; navigation visibility is not authorization.

Authenticated mutation routes:

| Method and route | Purpose |
| --- | --- |
| `PATCH /api/admin/manage/[collection]/[id]` | Moderation and lead-workflow updates |

Editorial mutations and media uploads occur through Sanity Studio and Sanity's access boundary, not these APIs.

## Database domains

The migrations define:

- Administrator profiles/roles and audit events
- Media assets, public/private Storage buckets, galleries, and gallery items
- Content pages, product suites/modules, module screenshots, and related modules
- Blog posts, categories, tags, comments, ratings, and topic suggestions
- FAQs, testimonials, navigation, and site settings
- Demo requests, digitization requests, and general inquiries
- Analytics rollups and rate-limit state

Read all migrations before changing policies. Migration `202608210003` moves blog engagement identity to the Sanity slug while preserving optional legacy post references.

## Test inventory

| Test | Coverage focus |
| --- | --- |
| `src/content/site.test.ts` | Source content/module and relationship invariants |
| `src/lib/content/normalize.test.ts` | Legacy defensive normalization helpers |
| `src/lib/content/sanity-mappers.test.ts` | Sanity rich text, media, module, and blog mapping |
| `src/lib/supabase/config.test.ts` | Environment parsing and allowed local HTTP URL behavior |
| `src/lib/validation/forms.test.ts` | Form normalization, consent, honeypot, strictness, rating bounds |
| `src/lib/validation/admin.test.ts` | Admin create/update/workflow contracts |
| `src/app/admin/collections.test.ts` | Unique, protected, required CMS workspaces |
| `src/components/seo/metadata.test.ts` | Canonical and metadata behavior |

The test suite does not replace live Sanity role/publishing checks, Supabase RLS integration tests, browser accessibility checks, Resend delivery, analytics verification, or Hostinger smoke tests.

## Visual-system status

The operational dashboard now uses an `.admin-shell` typography/contrast boundary so public headings do not enlarge its records. This is implemented but still needs current desktop and 390-by-844 browser evidence. Sanity Studio provides its own visual system.

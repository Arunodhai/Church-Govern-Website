# Decisions and open questions

## Confirmed for implementation

| Decision | Status | Consequence |
| --- | --- | --- |
| Next.js App Router and TypeScript | Confirmed | Follow the installed Next.js 16 documentation and Server Component defaults. |
| Sanity editorial CMS and Assets | Confirmed, revised proposal | `/studio` replaces the custom content CMS; Sanity owns editorial content/media and editor access. |
| Supabase operational data/auth | Confirmed, narrowed | Supabase stores leads, engagement, moderation, audit, and analytics; RLS remains mandatory. `/admin` is operational only. |
| Resend transactional email | Confirmed, revised proposal | Notify after successful persistence; secrets remain server-only and failure must not lose the lead. |
| Hostinger Web Apps deployment | Confirmed, revised proposal | Use a Node.js 22 Next.js server and platform-neutral environment controls for production; Vercel is temporary Preview infrastructure only. |
| Complete requirements are launch scope | Confirmed | Comments, ratings, topic moderation, gallery, all 17 module pages, and custom admin analytics must be implemented and accepted. |
| Truthful placeholder policy | Confirmed | Unapproved claims/assets are tracked and blocked from production. |

“Confirmed” here reflects the current engineering direction supplied to the build team. Business scope and third-party account ownership still require client sign-off.

## Blocking or material client decisions

| Topic | Question | Safe state until answered |
| --- | --- | --- |
| Feature behavior | What are the approved identity, moderation, retention, metric-source, gallery placement, and hero-media rules for the required launch features? | Implement secure conservative behavior and keep the question visible; do not remove the feature. |
| Sitemap | Is Contact a page/form, and are Security/Compliance standalone pages or Product sections? | Keep routing/content model adaptable; avoid duplicate public URLs. |
| CMS workflow | Which roles can draft, publish, manage media/SEO, read/export leads, and manage users? | Least privilege; no broad editor access. |
| Content/assets | Who supplies and approves branding, mission/vision, product claims, screenshots, testimonials, imagery, blogs, FAQs, and external links? | Staging-only structural placeholders. |
| Forms | Exact field options, consent wording, recipients, acknowledgement, CRM, retention, and response SLA? | Validate/persist only approved fields; no live notifications. |
| Comments/ratings | Anonymous or authenticated, moderation owner, one-vote rule, anti-spam, edit/delete, retention? | Required for launch; default-deny privileged data/actions and require moderation while awaiting final policy. |
| Analytics/privacy | Jurisdictions, cookie/consent approach, GA4/GSC ownership, optional Meta Pixel, query analytics privacy? | Essential-only behavior; optional tracking disabled. |
| Hosting/operations | Account owners, regions, domains, environments, plan/budget, uptime, backups, RPO/RTO, monitoring? | No production readiness claim. |
| Quality targets | WCAG level, performance budgets, browsers/devices, launch date, acceptance owner? | Recommend WCAG 2.2 AA and current major browsers, but mark unapproved. |
| Language | English only, localization roadmap, and denomination-sensitive terminology? | English, denomination-neutral provisional content only. |

## Architecture revision — 2026-08-21

The client-approved proposal supersedes the old Supabase-content/Vercel decisions. Legacy content tables and Storage records remain for rollback/reference, but new editorial work belongs in Sanity. Comments and ratings use a stable Sanity blog slug in Supabase. SBL owns the paid production accounts and grants developer access.

## Stakeholder Preview deployment — 2026-08-22

The owner approved Vercel for immediate testing while Hostinger remains the proposal production target. The Vercel environment is `APP_ENV=staging`, uses clearly labelled provisional editorial data, uses live Supabase operational writes, and is blocked from indexing through metadata and robots. It must not be promoted to production or have indexing enabled until the content and release gates pass.

## Development demo policy — 2026-08-21

Until the client supplies and approves production content and assets, local development uses an explicit mock mode to demonstrate the complete proposed experience. Mock mode includes editorial content, module UI concepts, engagement, lead submissions, topic suggestions, admin records, workflows, and analytics. Every mock surface is labelled, operational writes are screen-only, and no submitted personal information is stored or emailed. The guard is disabled unconditionally in production; this demo data is not a production fallback.

## Implemented conservative defaults — 2026-08-14, retained where applicable

- Public comments are anonymous by name/email, pre-moderated, rate-limited, and publish no email address.
- Ratings use a one-to-five scale, a server-generated browser fingerprint, and rate limiting.
- Public content is read from Sanity and filtered to approved/published records; operational data remains behind Supabase server/RLS boundaries.
- Sanity manages content assets and editorial roles; Supabase Storage content workflows are legacy.
- Canonical editors accept either a site-relative path or a complete URL; rendered metadata normalizes these against `NEXT_PUBLIC_SITE_URL`.
- Source content fallback is development-only and covers modules, blogs, FAQs, and navigation. Empty testimonials/galleries stay empty.

## How to record a decision

Add a dated row or short section with the decision, owner/approver, affected routes/data/integrations, and follow-up work. Do not overwrite historical decisions without documenting why they changed.

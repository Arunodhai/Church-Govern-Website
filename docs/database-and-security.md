# Database, migrations, and security

> Architecture update, 2026-08-21: Sanity is now the editorial content and media system. This document's Supabase content, CMS-role, and Storage sections describe legacy schema retained for rollback/reference. Forward Supabase work is limited to operational data: leads, comments, ratings, topic suggestions, moderation, audit, and analytics. Sanity editor access and asset policies require a separate acceptance review.

## Environment isolation

Use separate Supabase projects for development/staging and production. Local development may use Supabase CLI when adopted. Preview deployments must never receive production service-role credentials or write to production data.

Record project ownership and access in [integrations-and-ownership.md](integrations-and-ownership.md), without placing secrets in documentation.

## Migration policy

1. Add each schema or policy change as a timestamped SQL file under `supabase/migrations/`.
2. Make the migration deterministic and safe for an empty database plus the currently deployed schema.
3. Apply it to local/development first.
4. Test anonymous, authenticated non-admin, editor/admin, and privileged server behavior as applicable.
5. Apply the exact committed migration to staging and run smoke tests.
6. Back up production and confirm rollback/forward-fix strategy before production promotion.
7. Never modify an applied migration. Correct it with a later migration.

Do not manually create production-only tables or policies through the dashboard. If an emergency dashboard change occurs, immediately capture the equivalent migration and reconcile all environments.

## RLS invariants

RLS must be enabled on every table reachable through Supabase APIs. Policies should be explicit per operation.

- Anonymous visitors may read approved published content from Sanity. Legacy Supabase content reads should be retired when rollback retention is no longer needed.
- Anonymous visitors may insert only validated fields into designated public-submission endpoints/tables. Prefer a reviewed server endpoint over broad direct table inserts.
- Anonymous and ordinary authenticated users may never select lead submissions, draft content, admin profiles, moderation queues, or audit records.
- Editors may manage only the content types and publication actions granted by the approved role matrix.
- Privileged mutations must verify the authenticated user and role server-side.
- A service-role operation bypasses RLS and therefore belongs only in a narrowly scoped server-only module.

An empty or overly broad policy is a release blocker. Test negative paths as well as allowed paths.

## Recommended security verification matrix

| Actor | Published content | Draft content | Create lead | Read leads | CMS mutation |
| --- | --- | --- | --- | --- | --- |
| Anonymous | Read | Deny | Via validated endpoint | Deny | Deny |
| Authenticated non-admin | Read | Deny | Via validated endpoint | Deny | Deny |
| Approved editor/admin | Read | Role-dependent | Allowed | Role-dependent | Role-dependent |
| Server-only trusted operation | Required scope only | Required scope only | Required scope only | Required scope only | Required scope only |

Replace “role-dependent” with the approved matrix before production.

## Authentication and operations access

- `/admin` operational routes require an active Supabase session and a server-side role check. `/studio` uses Sanity authentication and project roles.
- Authentication redirects are convenience behavior; they do not replace RLS.
- Define invitation, offboarding, password recovery, MFA, session lifetime, and emergency access before production.
- Avoid user enumeration in sign-in and recovery errors.
- Audit publication, deletion, role change, and lead-export actions when those features exist.

## Forms and PII

- Validate and normalize form data on the server.
- Apply rate limiting and an approved anti-abuse mechanism.
- Store only fields required for the declared purpose.
- Capture consent wording/version when required.
- Define retention, export, correction, and deletion ownership before launch.
- Never write email addresses, phone numbers, names, free-text comments, or church identifiers to analytics events or URLs.
- Sanitize user-supplied content before rendering; React escaping does not make raw HTML safe.

## Storage

- Separate public approved media from private or draft assets.
- Enforce MIME type and size limits; do not trust extensions.
- Strip unsafe metadata when the media pipeline supports it.
- Require alt text or a documented decorative-image choice.
- Deleting a media record must account for references from published content.

## Backup and recovery

“Daily backups” is not complete until the owner, retention, restore method, RPO, and RTO are approved. Before launch:

- Verify automated backups are active for the production plan.
- Record retention and point-in-time recovery availability.
- Perform and document a staging restore drill.
- Back up media/storage or document how it is recovered.
- Ensure an owner receives backup and availability alerts.

## Release evidence

Attach migration identifiers, policy test output, staging smoke-test date, backup/restore evidence, and reviewer name to [acceptance-checklist.md](acceptance-checklist.md). Never mark security controls complete solely because this document describes them.

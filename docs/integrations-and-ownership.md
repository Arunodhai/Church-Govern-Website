# Integrations and ownership

No integration is production-ready until the account owner, configuration owner, operational recipient, privacy basis, and offboarding path are recorded. Store credentials only in provider secret stores and Hostinger environment settings.

## Ownership register

| Capability | Expected system | Business owner | Technical owner | Required decision/evidence |
| --- | --- | --- | --- | --- |
| Domain and DNS | Client-approved registrar/DNS | SBL | TBD | Domain, access, renewal owner, DNS change procedure |
| Web hosting | Hostinger Web Apps | SBL | TBD | Record plan, application, Node 22 runtime, developer access, billing, logs, and rollback owner. |
| Stakeholder preview | Vercel Preview | Developer-owned temporary project | Arunodhai | No-index staging only; migrate or retire after Hostinger acceptance. |
| Editorial CMS/media | Sanity | SBL | TBD | SBL-owned organization/project/datasets, editors, publishers, billing, asset policy, and offboarding. |
| Operational database/auth | Supabase | SBL | TBD | Separate staging/production, region, plan, backups, RLS matrix, and operations administrators. |
| Transactional email | Resend | SBL | TBD | Verified sender domain, recipients, delivery/retry alerts, billing, and offboarding. |
| Analytics | Google Analytics 4 | TBD | TBD | Client-owned property, measurement ID, consent mode, access list |
| Search visibility | Google Search Console | TBD | TBD | Verified property and sitemap owner |
| Advertising | Meta Pixel, optional | TBD | TBD | Explicit approval, consent behavior, pixel ID |
| Anti-abuse | Turnstile/CAPTCHA, TBD | TBD | TBD | Vendor, privacy review, keys, accessibility fallback |
| Monitoring/errors | Provider TBD | TBD | TBD | Uptime target, alert recipients, log retention, escalation |
| Content approval | CMS plus agreed workflow | TBD | TBD | Editors, publishers, legal/security approvers, offboarding |

Do not put account IDs or secrets in this document if the repository will be public. Use the team's secure credential inventory and reference it by non-secret name.

The user confirmed that SBL owns production accounts and grants developer access. Under the revised proposal this includes Hostinger, Sanity, Supabase, Resend, the domain, and other paid integrations. This does not prove the accounts or controls are configured.

## Analytics boundary

The website may integrate GA4, Search Console, optional Meta Pixel, conversion events for demo and digitization requests, form funnel events, and blog search analytics.

- The client must own the production properties and grant least-privileged access.
- Consent behavior must be approved before loading non-essential analytics or advertising scripts.
- Do not send names, emails, phone numbers, church names, location details, free text, Supabase IDs, or full search strings that may contain PII.
- Use stable event names and document event parameters.
- A successful lead event fires once only after authoritative persistence succeeds.
- Search Console verification and sitemap submission are deployment steps, not code-only acceptance.
- The required custom admin dashboard must define its source, metrics, filters, freshness, and authorization. Provider APIs or internal rollups may supply data, but an external provider dashboard does not replace the launch requirement.

Suggested non-PII event contract, subject to implementation review:

| Event | Trigger | Safe parameters |
| --- | --- | --- |
| `demo_request_submitted` | Persisted demo request | page path, form version |
| `digitization_request_submitted` | Persisted digitization request | page path, form version |
| `blog_search` | Executed blog search | result-count bucket; query only if privacy-approved and sanitized |
| `topic_suggestion_submitted` | Persisted suggestion | page path |

## Email integration boundary

Email is a server-only side effect, not the lead system of record.

1. Validate and persist the submission.
2. Generate an idempotency/correlation identifier that contains no PII.
3. Ask an email adapter to notify approved recipients and, if required, send an acknowledgement.
4. Record delivery attempt state without logging message contents or secrets.
5. Retry transient failures or alert an owner; never tell a visitor that persistence failed merely because notification failed.

The selected provider is Resend. The client must still approve the sending domain, from/reply-to addresses, recipient groups, acknowledgement copy, retention, delivery SLA, and whether a CRM/webhook is also required.

## Forms and CRM

The requirements do not name a CRM. Until one is approved, Supabase may be the lead record if its schema, RLS, access, retention, export, and deletion rules are approved. Adding a CRM later should use a server-only adapter or queued integration rather than browser credentials.

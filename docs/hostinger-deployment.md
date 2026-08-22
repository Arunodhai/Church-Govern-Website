# Hostinger Web Apps deployment and architecture migration

Status: implementation handoff, researched 2026-08-21. This document describes the target in the 19 August 2026 proposal and the repository state observed on 21 August 2026. It is not evidence that a Hostinger deployment, production account, domain, or integration has been configured.

## Target architecture from the new proposal

The proposal changes the previous architecture as follows:

| Concern | Current repository | New approved proposal | Required change |
| --- | --- | --- | --- |
| Public application | Next.js 16.3.1, React 19, TypeScript, Tailwind | Same | Retain and verify on a conventional Node.js runtime. |
| CMS content | Custom `/admin` editors backed by Supabase | Sanity CMS and Sanity access controls | Define Sanity schemas, migrate approved content/media, replace public reads, and decide what becomes of the custom content-admin routes. |
| CMS media | Supabase Storage | Sanity assets | Migrate referenced media and preserve alt text, captions, attribution, dimensions, and document relationships. |
| Leads and community data | Supabase PostgreSQL | Supabase PostgreSQL | Retain forms/leads, comments, ratings, topic suggestions, RLS, and moderation data in Supabase. |
| CMS authentication | Supabase Auth | Sanity access system | Remove Supabase Auth only from content editing after deciding how lead, moderation, and analytics screens are authenticated. Do not silently make those screens public. |
| Email | Provider-neutral adapter variables; no live provider verified | Resend | Add a server-only Resend adapter, verified sending domain, recipients, delivery/error logging, and retry policy. |
| Hosting | Vercel-oriented code/docs; no Vercel deployment verified | Hostinger Web Apps | Remove Vercel-only runtime assumptions and validate dynamic SSR, route handlers, caching, image delivery, and process limits on Hostinger. |
| Analytics | GA4 boundary and local admin rollups | GA4, Search Console, optional Meta Pixel, basic analytics dashboard | Preserve consent and no-PII rules; confirm which dashboard data comes from GA4 versus Supabase. |

The proposal does **not** authorize moving leads, comments, ratings, or moderation records into Sanity. It also leaves CMS roles, comment identity/moderation, dashboard depth, form configurability, search scope, CRM/webhooks, and several content/brand questions unresolved.

## Hostinger eligibility and runtime

- Use a **Node.js Web App**, not a static front-end deployment. This application has Server Components, route handlers, authentication, dynamic reads, and form writes.
- Managed Node.js Web Apps are currently available on **Business Web Hosting** and **Cloud Startup, Cloud Professional, Cloud Enterprise, and Cloud Enterprise Plus** plans. VPS also supports Node.js but is a separately managed deployment model. See Hostinger's [Node.js Web App guide](https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/) and [Node.js hosting options](https://www.hostinger.com/support/node-js-hosting-options-at-hostinger/).
- Hostinger currently offers Node.js **18.x, 20.x, 22.x, and 24.x** in the managed deployment selector. Next.js 16 requires Node.js **20.9.0 or newer**, so Node 18 must not be selected. Select **Node.js 22.x** for this project as the conservative current LTS choice, then run the complete test/build suite under that exact major before release. Sources: Hostinger's [Node.js version selector](https://www.hostinger.com/support/how-to-select-the-node-js-version-for-your-application/) and Next.js [system requirements](https://nextjs.org/docs/app/getting-started/installation).
- Add a compatible `engines.node` range to `package.json` during implementation so Hostinger detects the intended runtime. This is not present at this handoff.

## Repository and GitHub prerequisites

1. Establish a client-owned GitHub repository. At the earlier handoff this folder had no Git history; verify again rather than assuming that is still true.
2. Commit source, `package-lock.json`, migrations, Sanity schema/configuration, and names-only environment documentation. Exclude `.env*` secrets, `.next`, `node_modules`, local browser artifacts, and generated analysis output.
3. Protect the production branch and require the project checks before merge.
4. In hPanel choose **Websites -> Add Website -> Deploy Web App -> GitHub**, authorize the client-owned GitHub account, select the repository and production branch, and confirm Next.js detection.
5. Hostinger states that GitHub deployments build automatically on every push. One hosting plan can be connected to only one GitHub account, and all Node.js websites on that plan use that account. Confirm this ownership constraint before connecting a developer's personal account. See [How to add a Node.js Web App](https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/).

Do not upload `node_modules`. Hostinger installs dependencies during deployment. GitHub is preferred over ZIP upload because it gives a reviewable commit and a repeatable redeploy source.

## Build and start settings

Use the repository root as the application root, with `package.json` at that root.

| Setting | Value |
| --- | --- |
| Framework | Next.js |
| Node.js | 22.x |
| Install | Hostinger-managed install from `package-lock.json` |
| Build command | `npm run build` |
| Start command | `npm run start` |
| Build output | `.next` when Hostinger requests an output directory |
| Application port | `3000` |

The current scripts resolve to `next build --webpack` and `next start`. Hostinger's troubleshooting guide requires valid build/start scripts and says the application must listen on port 3000: [Failed Node.js build guidance](https://www.hostinger.com/support/fix-failed-to-build-application-error-hostinger-node-js/). Do not replace this dynamic deployment with `next export`.

Before pushing a release candidate, run locally with Node 22:

```bash
npm ci
npm run check
npm run start
```

`npm run check` currently covers ESLint, generated route types plus strict TypeScript, Vitest, and the production webpack build. A successful local command is not proof that the Hostinger runtime works; inspect both Hostinger build and runtime logs after deployment.

## Environment variable contract

Configure production values in hPanel during deployment. Hostinger supports adding/editing variables under **Settings & Redeploy**, and changes require a rebuild/redeploy: [environment-variable guide](https://www.hostinger.com/support/how-to-edit-or-add-environment-variables-after-deployment/). Never commit real values.

The names below are the target contract. Sanity client files and a Resend lead-notification adapter are present in the active worktree, but the migration is still in progress and has not been verified as a complete production integration. Reconcile these names with the finished implementation and update `.env.example` before handoff; its earlier provider-neutral email names are stale for the Resend adapter.

### Application and deployment

| Variable | Exposure | Required | Purpose |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public | Yes | Exact canonical production origin, for example `https://www.example.com`, without a trailing slash. |
| `APP_ENV` | Server only | Yes | Explicit `production`/`staging` switch replacing Vercel-specific environment detection. |

`robots.ts` now checks the platform-neutral `APP_ENV` contract. Test `/robots.txt` with `APP_ENV=production` before DNS cutover. Production metadata must rely on the explicit `NEXT_PUBLIC_SITE_URL`.

### Sanity CMS and media

| Variable | Exposure | Required | Purpose |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Public | Yes | Sanity project identifier. |
| `NEXT_PUBLIC_SANITY_DATASET` | Public | Yes | Environment-specific dataset, normally separate staging and production datasets/projects. |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Public | Yes | Pinned API date used by every client/query. |
| `SANITY_API_READ_TOKEN` | Server only | Conditional | Required for private datasets, draft mode, or live/preview features; grant read-only Viewer access. Not required for anonymous published reads from a public dataset. |
| `SANITY_REVALIDATE_SECRET` | Server only | Yes for webhook invalidation | Shared secret checked by the Next.js revalidation webhook. This is an application-defined name. |
| `NEXT_PUBLIC_SANITY_STUDIO_URL` | Public | Conditional | Hosted Studio origin when preview/visual editing links are implemented. |

Sanity documents the first four client/token names and notes that project ID and dataset are public while tokens are secrets: [Configuring the Sanity client for Next.js](https://www.sanity.io/docs/nextjs/configure-sanity-client-nextjs). Avoid a write token in the website unless a reviewed server-only feature genuinely needs one; editors should write through Sanity Studio and its access system.

### Supabase dynamic data

| Variable | Exposure | Required | Purpose |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Yes | Supabase project URL. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Yes | Browser-safe key constrained by RLS. If the project adopts the newer publishable-key naming, update code and this contract together. |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Conditional | Privileged administrative operations only. Never use from a Client Component and never treat it as a substitute for authorization checks. |
| `RATE_LIMIT_SECRET` | Server only | Yes before public launch | Stable secret used by the current form/comment anti-abuse boundary; do not fall back to a random per-process value in production. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Public | Conditional | Browser key if Turnstile is approved. |
| `TURNSTILE_SECRET_KEY` | Server only | Conditional | Server verification key if Turnstile is approved. |

Hostinger can connect an existing Supabase project and retrieve required variables for the next deployment, but it does not modify application code: [Connecting Supabase to a Hostinger Node.js app](https://www.hostinger.com/support/connecting-a-supabase-database-to-a-hostinger-node-js-application/). Verify the imported names match this code instead of assuming the wizard did so.

### Resend notifications

| Variable | Exposure | Required | Purpose |
| --- | --- | --- | --- |
| `RESEND_API_KEY` | Server only | Yes | Restricted production API key. |
| `RESEND_FROM_EMAIL` | Server only | Yes | Address on a Resend-verified sending domain. |
| `LEAD_NOTIFICATION_EMAIL` | Server only | Yes | Approved recipient or distribution list. |
| `RESEND_REPLY_TO` | Server only | Optional | Approved monitored reply-to address. |

`RESEND_API_KEY` is Resend's documented environment-variable name: [Resend CLI and CI/CD configuration](https://resend.com/docs/cli). The other names are this application's proposed adapter contract. Never place lead fields or these values in `NEXT_PUBLIC_` variables.

### Analytics and search verification

| Variable | Exposure | Required | Purpose |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Public | Conditional | GA4 Measurement ID, enabled only after consent behavior and ownership are approved. |
| `GOOGLE_SITE_VERIFICATION` | Server/build input | Conditional | Search Console verification value used by root metadata. |
| `NEXT_PUBLIC_META_PIXEL_ID` | Public | Optional | Enable only if the client explicitly approves Meta Pixel and consent behavior. |

No form-field PII, email, phone, church name, free text, Supabase ID, or unfiltered search text may be sent to analytics.

## First Hostinger deployment

1. Create separate staging and production Sanity/Supabase data boundaries and a Resend test/live arrangement. Do not connect preview code to production data or recipients.
2. In Hostinger create a temporary-domain Node.js Web App from the protected GitHub production/staging branch.
3. Select Node 22.x and confirm the build/start settings above.
4. Add all variables for that environment. Do not copy local development secrets blindly.
5. Deploy and inspect the complete build log. Then inspect runtime logs and hPanel CPU, memory, process, traffic, and disk metrics.
6. Run the smoke suite below on the temporary domain. Fix platform and indexing behavior before connecting the public domain.
7. Obtain content, security/legal, form-recipient, CMS-role, and release approval.
8. Connect the custom domain only after the temporary deployment passes. Hostinger recommends testing before switching traffic in its [Vercel-to-Hostinger migration guide](https://www.hostinger.com/support/how-to-migrate-from-vercel-to-hostinger/).

## Health and smoke tests

There is no dedicated health route in the repository at this handoff. Add a minimal `GET /api/health` route before production that returns a non-sensitive status and separately checks required configuration and read-only connectivity without disclosing secret values. Do not make health depend on sending email or writing a lead.

Replace `$DEPLOY_URL` with the temporary or production origin:

```bash
curl -fsS "$DEPLOY_URL/api/health"
curl -fsSI "$DEPLOY_URL/"
curl -fsSI "$DEPLOY_URL/about"
curl -fsSI "$DEPLOY_URL/product"
curl -fsSI "$DEPLOY_URL/blogs"
curl -fsSI "$DEPLOY_URL/faq"
curl -fsSI "$DEPLOY_URL/contact"
curl -fsS "$DEPLOY_URL/sitemap.xml"
curl -fsS "$DEPLOY_URL/robots.txt"
curl -fsSI "$DEPLOY_URL/admin"
```

Release acceptance also requires browser checks, not only status codes:

- Public pages render approved Sanity content and media with JavaScript disabled where SEO requires server-rendered HTML.
- Draft Sanity content never appears publicly, in search, sitemap, metadata, or cached responses; publish and unpublish invalidate the intended routes.
- Canonical, Open Graph, structured data, sitemap, and robots use the real domain. Production robots allow public pages and disallow `/admin/` and `/api/`; staging disallows all indexing.
- Demo and digitization forms validate errors, create exactly one Supabase lead, do not expose submissions, and produce one Resend notification to a controlled recipient. Record delivery ID/failure status without logging PII.
- Comments, ratings, topic suggestions, moderation, lead workflow, and analytics remain authorization-protected and work against production-equivalent RLS.
- Sanity Studio sign-in, roles, content publishing, media use, and preview operate only for approved users.
- Consent blocks GA4/Meta until the approved choice; conversion events contain no PII. Search Console verification is present.
- Current Chrome, Safari, Firefox, and Edge plus agreed mobile/tablet sizes pass navigation, keyboard, focus, contrast, forms, and lightbox checks.

Use an approved synthetic lead and delete it through the normal audited workflow after evidence is captured. Do not run a real form-write smoke test without an approved recipient and production data-cleanup plan.

## Domain, DNS, HTTPS, and cutover

1. Keep the existing site online while the Hostinger temporary domain is tested.
2. In hPanel use **Connect domain** on the Node.js application, enter the canonical domain, and follow the DNS records shown for that specific account.
3. If DNS is hosted outside Hostinger, update the records at the authoritative DNS provider; do not guess record values from this document. Lower TTL ahead of the cutover if the owner approves it.
4. Hostinger says propagation can take up to 24 hours and installs SSL automatically after connection. Verify both apex and `www`, choose one canonical host, redirect the other, and confirm HTTPS before announcing completion. Source: [Connect a custom domain to a Node.js application](https://www.hostinger.com/support/how-to-connect-a-custom-domain-to-a-node-js-application/).
5. Update `NEXT_PUBLIC_SITE_URL`, Sanity CORS/preview origins, Resend domain/links, GA4 data stream, Search Console property, sitemap submission, and any webhook URLs; rebuild after environment changes.
6. Retain the former deployment until DNS, forms, content, logs, and monitoring are stable through the agreed observation window.

## Redeploy and rollback

Hostinger's documented redeploy flow is **Website Dashboard/Deployments -> Settings & Redeploy**. A GitHub redeploy pulls the latest code from the selected branch and permits changes to Node version, build command, start command, and environment variables: [Redeploy a Node.js application](https://www.hostinger.com/support/how-to-redeploy-a-node-js-application/).

The reviewed Hostinger documentation does not promise a one-click restore of an arbitrary earlier deployment. Therefore use a source-controlled rollback:

1. Identify the exact last-known-good commit and confirm whether the incident is web-only or includes data/schema changes.
2. Create and review a Git revert commit/PR on the deployment branch. Do not rewrite shared branch history.
3. Redeploy from hPanel and verify that Hostinger built the intended commit in its deployment log.
4. Run the health and smoke suite on the temporary/domain URL and monitor runtime/resource logs.
5. For an additive Supabase or Sanity schema defect, prefer a reviewed forward fix. Never edit an applied SQL migration. For suspected data corruption, stop writes, preserve evidence, and follow the separately approved backup/restore procedure.
6. Record incident, commit, build, configuration changes, operator, timestamps, checks, and outcome.

A process **Restart** is useful for a stuck server but is not a code rollback or rebuild.

## Hostinger limitations and release risks

- Managed Web/Cloud hosting is not a VPS: there is no root-level control. Hostinger says npm commands for these deployments are run automatically and cannot be run manually through SSH. Use deployment logs and hPanel controls, or choose VPS only if the approved design needs OS/runtime control.
- One hosting plan connects to one GitHub account for all Node.js websites. Use the client's organization/account and document offboarding.
- Environment-variable changes require redeployment. Treat key rotation as a release and smoke-test it.
- Hostinger explicitly warns that Vercel-native facilities such as Edge Functions or Vercel Blob require alternatives. This repository does not currently use Vercel Blob, but it has Vercel-specific URL/environment assumptions that must be removed. Test every dynamic route on Hostinger rather than assuming platform parity.
- Hostinger expects the application on port 3000. Do not hardcode a conflicting port or use a static deployment for this app.
- Plan resources and Node.js website counts vary by plan and account/market. Confirm actual hPanel entitlements and production CPU/RAM/process limits; do not choose a plan solely from marketing labels. See Hostinger's [plan parameters and limits](https://www.hostinger.com/support/6976044-parameters-and-limits-of-hosting-plans-in-hostinger/).
- Managed redeploy documentation does not establish zero-downtime deployment, immutable promotion between staging and production, or point-in-time rollback. Agree maintenance, rollback, uptime monitoring, backup retention, RPO/RTO, and escalation ownership before launch.
- Hostinger hosting does not replace Sanity or Supabase backup/export policies. Test content export and Supabase restore separately.

## Migration implementation checklist

- [x] Record the proposal as the new architecture decision and update the primary Vercel/custom-CMS references after implementation (2026-08-21).
- [ ] Create client-owned GitHub, Hostinger, Sanity, Supabase, Resend, GA4, Search Console, domain/DNS, and optional Meta accounts with delegated developer access.
- [ ] Add Node 22-compatible `engines.node`; run `npm ci` and `npm run check` on Node 22.
- [ ] Model Sanity documents for pages, product suites/modules, blogs/authors/categories, FAQs, testimonials, navigation/footer, SEO, and media; define validation, slug rules, publication/preview, roles, and audit expectations.
- [ ] Build typed Sanity queries and media helpers; keep public content server-rendered and draft-safe.
- [ ] Export approved Supabase CMS records/media, map stable IDs/slugs/references, import idempotently into a staging Sanity dataset, compare counts/URLs/content, then perform an approved production migration. Do not migrate leads/community data into Sanity.
- [ ] Decide whether `/admin` is retained for lead management, moderation, and analytics; replace/remove only content-editing screens after those workflows have an authenticated owner.
- [ ] Implement Resend notifications with server validation, verified domain/from address, test recipient, failure recording, retry, and no PII in logs/analytics.
- [ ] Replace `VERCEL_ENV`, `VERCEL_URL`, and `VERCEL_PROJECT_PRODUCTION_URL` behavior with explicit platform-neutral environment handling; add `/api/health`.
- [ ] Add Sanity publish webhooks with a server-only secret and narrow path/tag revalidation; verify publish/unpublish and draft isolation.
- [ ] Preserve Supabase RLS and test anonymous/admin negative authorization for leads, comments, ratings, topic suggestions, moderation, and any remaining admin APIs.
- [ ] Configure Hostinger staging on a temporary domain, run the full release gates, then connect DNS/SSL and re-test the canonical production domain.
- [ ] Define documented rollback, monitoring, alerting, backups, restore drill, retention, access review, and support ownership before acceptance.

## Official source index

- Hostinger: [Add a Node.js Web App](https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/)
- Hostinger: [Node.js hosting options](https://www.hostinger.com/support/node-js-hosting-options-at-hostinger/)
- Hostinger: [Select Node.js version](https://www.hostinger.com/support/how-to-select-the-node-js-version-for-your-application/)
- Hostinger: [Environment variables after deployment](https://www.hostinger.com/support/how-to-edit-or-add-environment-variables-after-deployment/)
- Hostinger: [Redeploy a Node.js application](https://www.hostinger.com/support/how-to-redeploy-a-node-js-application/)
- Hostinger: [Connect a custom domain](https://www.hostinger.com/support/how-to-connect-a-custom-domain-to-a-node-js-application/)
- Hostinger: [Migrate from Vercel](https://www.hostinger.com/support/how-to-migrate-from-vercel-to-hostinger/)
- Hostinger: [Connect Supabase](https://www.hostinger.com/support/connecting-a-supabase-database-to-a-hostinger-node-js-application/)
- Hostinger: [Troubleshoot deployment builds](https://www.hostinger.com/support/how-to-troubleshoot-a-failed-node-js-deployment-using-build-logs/)
- Hostinger: [Plan parameters and limits](https://www.hostinger.com/support/6976044-parameters-and-limits-of-hosting-plans-in-hostinger/)
- Next.js: [Installation and system requirements](https://nextjs.org/docs/app/getting-started/installation)
- Sanity: [Configure the Next.js client](https://www.sanity.io/docs/nextjs/configure-sanity-client-nextjs)
- Resend: [CLI and CI/CD environment setup](https://resend.com/docs/cli)

# Deployment runbook

The revised proposal uses Hostinger Web Apps, not Vercel. The complete current runbook is [hostinger-deployment.md](hostinger-deployment.md).

## Environment sequence

1. Local development with non-production Sanity and Supabase resources.
2. Hostinger staging/review application with staging datasets, test Resend recipients, and production analytics disabled.
3. Hostinger production application with SBL-owned production resources and approved content/consent configuration.

Use Node.js 22, `npm run build`, and `npm run start`. Set `APP_ENV=production` only in production. Verify `/api/health`, robots, public content, forms, Resend, `/studio`, `/admin`, headers, logs, SSL, and rollback on staging before DNS cutover.

The current stakeholder review environment uses a temporary Vercel Preview deployment with `APP_ENV=staging`, `USE_MOCK_CONTENT=true`, and `USE_MOCK_OPERATIONS=false`. It must remain `noindex` and is not the production target. No Hostinger staging or production deployment has been verified as of 2026-08-22.

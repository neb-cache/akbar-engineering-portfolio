# Phase 3.3 production operations

## Environment inventory

Required in every environment:

| Variable | Exposure | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Public | Browser-safe and RLS-protected access |
| `NEXT_PUBLIC_SITE_URL` | Public | Canonical origin used by metadata, sitemap, robots, and JSON-LD |
| `SUPABASE_SECRET_KEY` | Server only | Privileged database health check only |

Optional:

| Variable | Exposure | Purpose and fallback |
| --- | --- | --- |
| `NEXT_PUBLIC_VERCEL_ANALYTICS_ENABLED` | Public boolean | Enables Vercel Web Analytics and Speed Insights. Defaults to `false`. |
| `UPSTASH_REDIS_REST_URL` | Server only | Durable contact rate-limit/duplicate store |
| `UPSTASH_REDIS_REST_TOKEN` | Server only | Standard Upstash token; never expose it to the browser |
| `RESEND_API_KEY` | Server only | Sends a notification only after persistence succeeds |
| `CONTACT_NOTIFICATION_EMAIL` | Server only | Notification recipient |
| `CONTACT_FROM_EMAIL` | Server only | Verified Resend sender, including optional display name |

Use the new Supabase key model only. Do not add legacy anon/service-role environment names. The publishable key is intentionally public and remains constrained by RLS. The secret key bypasses RLS and must stay in the deployment platform's secret manager.

## Deployment setup

1. Create the production project and set the Node.js version supported by Next.js 16.
2. Configure every required environment variable for Production and Preview separately.
3. Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS custom-domain origin before the production build. Do not use a preview URL.
4. Add the production callback URL to Supabase Auth redirect URLs:
   `https://your-domain.example/auth/callback`.
5. Confirm migrations `001`, `002`, and `003` are already applied. Phase 3.3 adds no migration.
6. Configure the custom domain/DNS and wait for a valid TLS certificate.
7. Enable Vercel Web Analytics and Speed Insights in the project dashboard, then set `NEXT_PUBLIC_VERCEL_ANALYTICS_ENABLED=true` and redeploy. Leaving it false injects no analytics scripts and requires no cookie banner.
8. For durable serverless abuse control, create Upstash Redis and set both Upstash variables. Without them, the app uses a bounded per-instance in-memory fallback that cannot coordinate across instances or survive cold starts.
9. To enable contact notifications, verify a Resend sending domain and set all three notification variables. Missing or failed email delivery never discards a message already saved to Supabase.
10. Configure an external uptime monitor for `GET /api/health`. A healthy response is `200`; a database/configuration failure is `503`. The route is `no-store` and reveals no credentials.

## Caching and invalidation

- Public profile, projects, experience, skills, mentorship, and approved authority evidence use one-hour persistent caches.
- React `cache` still deduplicates repeated reads within a render.
- Admin mutations call `updateTag` for the affected public data and `revalidatePath` for relevant route shells.
- Admin/contact-message reads are never placed in the public cache.
- The public layout uses one-hour ISR. Dynamic project/list routes still reuse the tagged data cache.

## Contact reliability

- Supabase/RLS remains the source of truth.
- Controls: hidden honeypot, 3-second minimum completion time, 2-hour form-session ceiling, six-link maximum, five attempts per 15 minutes, and ten-minute duplicate suppression.
- Durable production control uses Upstash REST. The request identifier is SHA-256 hashed before it becomes a rate-limit key; raw IP/user-agent values are not stored or logged.
- Only Vercel-provided forwarding headers are trusted in Vercel production. Local/non-Vercel fallback is intentionally less precise.
- Resend receives a plain-text notification after a successful insert. Its API key, destination, and message body are never logged.

## Monitoring and privacy

- Server events are structured JSON with timestamp, category, action, optional safe code, and generated error ID. Contact bodies, emails, environment values, and provider messages are excluded.
- Vercel runtime logs are the baseline server monitor. No third-party error-monitoring SDK is claimed as configured.
- Vercel Analytics/Speed Insights are opt-in through one public boolean. Admin, auth, and API page views are excluded, and query strings/fragments are removed before page-view delivery.
- Custom events contain only controlled labels/slugs: project view, CTA target, resume download, contact success, and social target. No email/name/message is sent.

## Resume and social configuration

Configure these through **Admin → Settings**:

- Resume: an approved HTTPS PDF/document URL.
- GitHub and LinkedIn: canonical HTTPS profile URLs.
- Contact email: the professional public inbox.

When a resume is missing, the site renders a non-clickable “Resume unavailable” state. Missing social/email values are omitted rather than replaced with fake links. Verify the document opens without authentication and reflects the current professional identity.

## Rollback

1. Keep the previous known-good deployment available.
2. For an application regression, promote/redeploy the previous commit; do not run a database rollback.
3. Disable analytics immediately with `NEXT_PUBLIC_VERCEL_ANALYTICS_ENABLED=false` and redeploy.
4. Disable email notification by removing the Resend variables; Supabase persistence continues.
5. If Upstash is unavailable, remove both Upstash variables to use the documented in-memory fallback temporarily.
6. Rotate any server credential that may have been exposed. Never paste environment values into issue reports.
7. Phase 3.3 contains no migration, so application rollback does not require data reversal.

## Known limitations

- No automated test suite exists; validation currently consists of lint, TypeScript, production build, HTTP route/header checks, and manual browser/recruiter QA.
- Durable distributed contact limiting requires optional Upstash configuration.
- Email delivery requires optional Resend configuration and was not exercised during implementation to avoid sending a real notification.
- The latest stable Next.js 16.2.11 still installs `sharp@0.34.5`, which npm audit flags for 2026 libvips advisories. Do not force-downgrade Next or override outside its supported semver range; update when Next ships a compatible patched transitive dependency.
- Lighthouse was not measured because an interactive browser/Lighthouse runtime was unavailable. No score is claimed.
- Resume, social profiles, and public email are currently unconfigured in Supabase and must be completed before launch.

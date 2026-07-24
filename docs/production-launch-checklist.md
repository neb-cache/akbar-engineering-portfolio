# Production launch checklist

## Release candidate

- [ ] Review the diff and confirm Phase 3.1 content and Phase 3.2 interaction behavior remain intact.
- [ ] `npm install` completes.
- [ ] `npm run lint` passes.
- [ ] `npm run typecheck` passes.
- [ ] `npm run build` passes.
- [ ] Review `npm audit`; accept/document only the known Next/sharp residual advisory.
- [ ] Confirm no secret or `.env.local` value is staged.

## Environment and Supabase

- [ ] Set the final HTTPS `NEXT_PUBLIC_SITE_URL` before building.
- [ ] Set `NEXT_PUBLIC_SUPABASE_URL`.
- [ ] Set `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
- [ ] Set server-only `SUPABASE_SECRET_KEY`.
- [ ] Confirm no legacy anon/service-role variable is required.
- [ ] Confirm migrations 001–003 are applied and RLS is enabled.
- [ ] Re-run public-view checks for draft, archived, confidential, and unapproved-image records.
- [ ] Confirm the only privileged secret-key code path is server-only `/api/health`.
- [ ] Confirm the production Auth callback URL and Site URL in Supabase.

## Domain, SEO, and sharing

- [ ] Attach the custom domain and verify TLS.
- [ ] Verify canonical tags use the custom domain, not localhost or a preview URL.
- [ ] Open `/robots.txt`, `/sitemap.xml`, and `/manifest.webmanifest`.
- [ ] Confirm sitemap contains only public routes and published sanitized projects.
- [ ] Confirm admin/auth/API/preview routes are blocked from crawling.
- [ ] Validate homepage and project JSON-LD with a structured-data validator.
- [ ] Test homepage and at least two project OG/Twitter images in social debuggers.
- [ ] Verify favicon, generated icon, and Apple touch icon.

## Security

- [ ] Inspect production CSP violations in browser DevTools.
- [ ] Confirm HSTS, CSP, `nosniff`, frame denial, referrer, and permissions headers.
- [ ] Test admin login, logout, expired session, non-admin account, and direct protected URL access.
- [ ] Upload valid PNG/JPEG/WebP files and reject an oversized, wrong-MIME, and signature-mismatched file.
- [ ] Confirm unapproved/private media does not appear in public pages or public view queries.
- [ ] Confirm logs contain no contact content, email address, token, or environment value.

## Contact and observability

- [ ] Submit one real production contact message with permission.
- [ ] Confirm it exists in Supabase before checking notification delivery.
- [ ] Verify honeypot, too-fast submission, link ceiling, duplicate suppression, and rate limit.
- [ ] Configure Upstash for multi-instance production limiting.
- [ ] If notifications are enabled, verify the Resend domain and one real delivery; do not infer delivery from persistence.
- [ ] Enable Vercel Analytics/Speed Insights only after the dashboard features are active.
- [ ] Confirm analytics excludes admin/auth/API and does not contain PII.
- [ ] Configure uptime monitoring for `/api/health` and trigger a test alert through the monitor provider.

## Recruiter journey

- [ ] Desktop and mobile: homepage → selected project → related project → experience → about → contact.
- [ ] Keyboard-only: skip link, navigation, project gallery/dialog, forms, and error recovery.
- [ ] Reduced-motion mode: all content remains visible and usable.
- [ ] Verify every project live/source link and confidentiality badge.
- [ ] Upload and test the final resume URL without authentication.
- [ ] Configure and test GitHub, LinkedIn, and public email links.
- [ ] Verify no placeholder copy, broken image, horizontal overflow, or dead CTA remains.

## Go live and observe

- [ ] Record the release commit and previous known-good deployment.
- [ ] Deploy the reviewed release candidate.
- [ ] Smoke-test all public routes, one 404, admin login, health, metadata endpoints, and one project OG image.
- [ ] Watch platform errors, health checks, contact rows, and Core Web Vitals during the first release window.
- [ ] If a regression occurs, redeploy the previous commit. Do not automatically roll back migrations.

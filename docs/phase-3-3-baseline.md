# Phase 3.3 production baseline

Audit date: 2026-07-23

## Commands run before implementation

- `npm install`: completed; 449 packages audited.
- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm run build`: passed on Next.js 16.2.10.
- `npm audit --json`: reported two high-severity findings: a direct Next.js advisory inherited from `sharp`, and the transitive `sharp` advisory itself.
- No automated test script or test suite existed.

## Production issues discovered

1. The complete public layout used `force-dynamic`, making every public route request-time rendered even though its content is CMS-like and suitable for caching.
2. Public Supabase queries were deduplicated per render with React `cache`, but had no persistent cache policy or tag-based invalidation.
3. Root metadata used an outdated professional name/title and a generic description.
4. No generated Open Graph artwork, project-specific social cards, JSON-LD, manifest, or Apple icon existed.
5. The sitemap gave static pages a new `lastModified` timestamp on every generation instead of omitting an unknown timestamp.
6. Admin pages were blocked in `robots.txt` but did not emit an explicit `noindex` directive.
7. No privacy-friendly analytics, Core Web Vitals collector, or custom-event layer existed.
8. The contact form persisted through Supabase RLS and had a honeypot, but no rate limit, duplicate suppression, timing trap, link ceiling, or optional delivery notification.
9. Public/session Supabase code unnecessarily parsed the privileged secret-key environment schema even though it used only the publishable key.
10. Logging could include raw provider error messages and did not use a consistent safe event shape.
11. Upload validation trusted the browser MIME type and filename extension without checking file signatures.
12. No global root error boundary existed.
13. No production security-header or CSP configuration existed.
14. Proxy session work matched all application routes rather than only admin/auth routes.
15. The deployed-data audit found the resume, GitHub, LinkedIn, and contact email currently unconfigured; the UI handled this safely but launch content remains incomplete.
16. There was no consolidated launch checklist, environment inventory, observability runbook, or rollback plan.

## Security baseline

- The browser, public server reads, and RLS-protected server clients used `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
- `SUPABASE_SECRET_KEY` was imported only by the server-only privileged client used by `/api/health`.
- Public projects used `public_projects`; approved authority/media used the Phase 3.1 sanitized public views.
- Contact inserts used the RLS-protected publishable-key session client.
- Admin reads and mutations required a verified Supabase user whose `profiles.role` is `admin`.
- No Phase 3.3 database migration was necessary or executed.

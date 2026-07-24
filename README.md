# Akbar Engineering Portfolio

Production portfolio and internal CMS for Akbar A.R. Antapradja, built with the Next.js App Router and Supabase. The public experience includes confidential-safe project records, professional authority content, accessible diagrams/media, production SEO, intentional caching, privacy-friendly observability, and a hardened contact workflow.

## Local setup

1. Copy `.env.example` to `.env.local` and fill in the four required values. Optional integrations can remain unset locally.
2. Run migrations `001`, `002`, and `003` in numerical order in the Supabase SQL Editor.
3. Run `supabase/seed.sql` once on a new database, then run `supabase/phase_3_1_seed.sql` after migration 003.
4. Create the first user in Supabase Authentication, then confirm its `profiles.role` is `admin`.
5. Run `npm install` and `npm run dev`.

The application uses only Supabase's new API key model:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_SECRET_KEY=sb_secret_...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_VERCEL_ANALYTICS_ENABLED=false
```

`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` is browser-safe and protected by RLS. `SUPABASE_SECRET_KEY` bypasses RLS and is imported only from server-only code. Legacy `anon` and `service_role` environment variables are not supported or required.

## Commands

```bash
npm run dev
npm run lint
npm run typecheck
npm run build
npm run start
```

Detailed setup is in [docs/phase-1-setup.md](docs/phase-1-setup.md), [docs/phase-2-setup.md](docs/phase-2-setup.md), and [docs/phase-3-1-setup.md](docs/phase-3-1-setup.md).

Production operations and release readiness:

- [Phase 3.3 production operations](docs/phase-3-3-production.md)
- [Production launch checklist](docs/production-launch-checklist.md)
- [Phase 3.3 release report](docs/phase-3-3-release-report.md)

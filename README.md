# Akbar Engineering Portfolio

Production portfolio and internal CMS for Akbar Aulia Ramadhan, built with the Next.js App Router and Supabase. Phase 3.1 adds structured professional case studies, evidence-backed metrics, accessible architecture diagrams, explicitly approved media, mentorship records, authority settings, and recruiter-oriented positioning while preserving confidential-safe projections.

## Local setup

1. Copy `.env.example` to `.env.local` and fill in the four values.
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

# Akbar Engineering Portfolio

Production portfolio and internal CMS for Akbar Aulia Ramadhan, built with the Next.js App Router and Supabase. The public site includes a filterable project archive, confidential-safe case studies, experience and capability records, contact capture, responsive editorial design, and SEO metadata. The protected CMS provides Auth, CRUD workflows, media uploads, and message management.

## Local setup

1. Copy `.env.example` to `.env.local` and fill in the four values.
2. Run `supabase/migrations/001_initial_schema.sql` and then `supabase/migrations/002_phase_2_public_projects.sql` in the Supabase SQL Editor.
3. Run `supabase/seed.sql` once on a new database.
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

Detailed Supabase setup is in [docs/phase-1-setup.md](docs/phase-1-setup.md). Public-site configuration and launch checks are in [docs/phase-2-setup.md](docs/phase-2-setup.md).

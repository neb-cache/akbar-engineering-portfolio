# Akbar Engineering Portfolio

Next.js App Router portfolio foundation and internal CMS for Akbar Aulia Ramadhan. Phase 1 includes Supabase Auth, PostgreSQL/RLS, Storage uploads, typed services, server-side validation, admin CRUD, seed data, and a database health endpoint.

## Local setup

1. Copy `.env.example` to `.env.local` and fill in the four values.
2. Run `supabase/migrations/001_initial_schema.sql` in the Supabase SQL Editor.
3. Run `supabase/seed.sql`.
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

Detailed Supabase and security setup is in [docs/phase-1-setup.md](docs/phase-1-setup.md).

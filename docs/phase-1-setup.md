# Phase 1 setup

## Included foundation

The CMS contains protected dashboard, project CRUD with technologies/highlights and cover upload, experience CRUD, skill CRUD with category filtering, contact-message review/status management, Supabase Auth callback/session refresh, Zod validation, and typed service modules. `GET /api/health` checks database connectivity and returns HTTP 503 safely when unavailable.

## Requirements

- Node.js 20.9 or later
- npm
- A hosted Supabase project
- Dependencies from `package.json` (`next`, React, Supabase JS/SSR, Zod, React Hook Form, Tailwind CSS, and Lucide React)

## Environment

Copy `.env.example` to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key
SUPABASE_SECRET_KEY=sb_secret_your_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Find the publishable and secret keys in **Supabase Dashboard → Project Settings → API Keys**. Do not configure `NEXT_PUBLIC_SUPABASE_ANON_KEY` or `SUPABASE_SERVICE_ROLE_KEY`; this codebase intentionally uses the new key model only.

- The publishable key is embedded in browser bundles. RLS and grants are the security boundary.
- The secret key bypasses RLS. Store it in the deployment platform's secret manager and never prefix it with `NEXT_PUBLIC_`.
- Rotate the secret key immediately if it is logged, committed, or otherwise exposed.

## Create the database

1. Create a Supabase project.
2. Open **SQL Editor** and run `supabase/migrations/001_initial_schema.sql`.
3. Run `supabase/seed.sql` after the migration.
4. Review **Database → Advisors** and **Security Advisor** after applying the SQL.

The migration creates:

- `profiles`
- `projects`, `project_technologies`, `project_highlights`, `project_images`
- `experiences`, `experience_highlights`, `experience_technologies`
- `skills`
- `contact_messages`
- `site_settings`

It also enables RLS on every public table, adds indexed foreign-key access paths, creates reusable `updated_at` triggers, adds an auth-user profile trigger, and grants Data API privileges explicitly. These grants are separate from RLS and are included for projects where new SQL-created tables are not exposed automatically.

## Storage

The migration creates/updates the public `portfolio-media` bucket with:

- Public reads
- Admin-only insert, update, and delete through RLS
- PNG, JPEG, and WebP MIME types
- 5 MB file limit
- Object paths under `projects/{projectId}/{timestamp}-{sanitizedFilename}`

If your Supabase organization prevents bucket creation through SQL, create `portfolio-media` in **Storage**, configure it as public with the same restrictions, then rerun only the storage policies from the migration.

## Create the first admin

1. Disable public sign-ups in **Authentication → Providers → Email**. There is intentionally no public sign-up page.
2. Create a user in **Authentication → Users** after running the migration. The trigger creates its profile.
3. Verify:

```sql
select id, email, role from public.profiles;
```

4. If the Auth user existed before the migration, create its profile manually:

```sql
insert into public.profiles (id, full_name, email, role)
select id, raw_user_meta_data ->> 'full_name', email, 'admin'
from auth.users
where email = 'your-admin@example.com'
on conflict (id) do update set role = 'admin';
```

Admin authorization uses `profiles.role = 'admin'` in RLS and is checked again inside protected layouts and every mutation action.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000/admin/login`. The health endpoint is `http://localhost:3000/api/health`.

## Validation

```bash
npm run lint
npm run typecheck
npm run build
```

Database verification requires a linked/live Supabase project. After applying the migration, verify a publishable-key client can read only non-confidential published projects, cannot mutate CMS tables, and can insert a valid contact message. Verify an authenticated admin can perform CRUD and upload a supported image.

## Troubleshooting

- **Environment validation error:** confirm all four new-model variables exist in the project root `.env.local`; restart the dev server after changes.
- **401 using a secret key:** secret keys are intentionally rejected from browsers. Only the server health client uses it.
- **Admin redirect loop:** confirm the Auth user has a matching `profiles` row with `role = 'admin'`, and that the site URL/auth redirect URL includes `/auth/callback`.
- **Table inaccessible despite an RLS policy:** check Data API exposed schemas and the explicit `GRANT` statements in the migration.
- **Update affects zero rows:** ensure the user is an admin; PostgreSQL updates need both SELECT visibility and an UPDATE policy.
- **Upload fails:** confirm bucket/policies exist, the file is at most 5 MB, and MIME type is PNG, JPEG, or WebP.
- **Health returns 503:** validate the URL/secret key and confirm the migration created `site_settings`.

## Security notes

- Confidential projects are excluded by public parent and child-table policies.
- Secret-key code imports `server-only`; no client component reads `SUPABASE_SECRET_KEY`.
- Server Actions are directly callable endpoints, so they validate input and re-authorize the admin internally.
- Auth decisions use the database profile role, not user-editable metadata.
- Contact input has length limits and a honeypot. Add edge-level rate limiting before launching a public form.
- Keep email sign-up disabled unless the profile provisioning and role model are expanded beyond a single-admin CMS.

## Known Phase 1 limitations

- The public-facing portfolio and contact form are deferred; the validated contact submission action is ready for Phase 2.
- Project media UI manages the cover image. The schema already supports galleries, but gallery ordering/captions are deferred.
- CRUD child updates are coordinated by the service layer rather than a database RPC transaction.
- No automated browser or database integration suite is included yet.

## Recommended Phase 2

Build public project/case-study/experience pages from RLS-protected services, add the public contact form with rate limiting, add project galleries and SEO metadata, introduce automated RLS/integration tests, and complete the visual system, accessibility pass, observability, and production deployment hardening.

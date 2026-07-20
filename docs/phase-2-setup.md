# Phase 2 public portfolio setup

## Apply the public projection

Run `supabase/migrations/002_phase_2_public_projects.sql` in the Supabase SQL Editor after the Phase 1 schema. It creates `public.public_projects`, a narrow read-only projection for published work.

- Non-confidential records expose their public case-study fields.
- Confidential records keep the title, summary, role, company, type, dates, and publication flags, while description, client, media, and external URLs are returned as `null`.
- Child-table RLS continues to hide technologies, highlights, and images for confidential records.
- Only `select` is granted to `anon` and `authenticated`.

Until this migration is applied, the application intentionally falls back to the Phase 1 RLS query and shows only published, non-confidential projects.

## Configure public profile data

The site reads optional values from `site_settings`. Manage them from the database or the CMS when a settings screen is added. Example values:

```sql
insert into public.site_settings (key, value)
values
  ('hero', '{"name":"Akbar Aulia Ramadhan","title":"Principal Full-Stack & Systems Engineer","headline":"Building enterprise platforms across software, integration, automation, and infrastructure.","description":"Short public introduction."}'::jsonb),
  ('social_links', '{"github":"https://github.com/your-handle","linkedin":"https://www.linkedin.com/in/your-handle"}'::jsonb),
  ('contact', '{"email":"hello@example.com","location":"Bogor, Indonesia"}'::jsonb),
  ('availability', '{"message":"Available for remote and international opportunities"}'::jsonb),
  ('resume_url', '"https://example.com/resume.pdf"'::jsonb)
on conflict (key) do update set value = excluded.value;
```

Replace the example URLs and email before running the statement. Missing values degrade safely: social links and resume actions are omitted, while identity and location use local defaults.

## Launch checks

Set `NEXT_PUBLIC_SITE_URL` to the canonical production origin before building. Then run:

```bash
npm run lint
npm run typecheck
npm run build
```

Manually verify at 375, 768, 1024, and 1440 pixels:

1. `/` renders the hero, featured work, experience, capability index, delivery section, and contact CTA.
2. `/projects` supports search, type, technology, and featured filters using URL query parameters.
3. Public project pages show gallery, highlights, technologies, external links, and related work when available.
4. Confidential project pages never reveal the private description, client, media, child records, or external URLs.
5. `/experience`, `/about`, and `/contact` remain keyboard-accessible with visible focus states.
6. The mobile navigation opens, closes, and does not cause horizontal scrolling.
7. The contact form rejects invalid input and saves a valid message to the admin inbox. Do this only on a test record you are prepared to delete.
8. `/admin/login` and the protected CMS retain their light administrative theme.
9. `/robots.txt` blocks admin/auth/API paths and `/sitemap.xml` contains public routes and published project URLs.

## Security notes

- Browser and RLS-protected server reads use `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
- `SUPABASE_SECRET_KEY` is restricted to server-only privileged code and is never imported by public or client components.
- The public view is intentionally owner-privileged so it can expose the sanitized portion of confidential records. Keep its column list explicit and rerun a confidentiality audit whenever project fields are added.
- Treat `title`, `short_description`, `role`, `company`, `project_type`, and dates as public fields even when `confidential = true`.
- The honeypot reduces basic bot submissions. Add deployment-edge rate limiting and monitoring before a high-traffic launch.

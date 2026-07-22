# Phase 3.1 baseline audit

Recorded before Phase 3.1 implementation on 2026-07-22.

## Existing architecture

- Next.js 16.2.10 App Router with TypeScript, Tailwind CSS, Server Components, Server Actions, and route-level metadata.
- Supabase PostgreSQL, Auth, Storage, RLS, and explicit Data API grants.
- Browser-safe and public server reads use `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
- The privileged client is server-only and uses `SUPABASE_SECRET_KEY` for the database health check; public pages do not import it.
- Admin pages are protected by the existing session/profile role flow. Mutations call `requireAdmin()` and database policies reuse `private.is_admin()`.
- The public portfolio uses the Phase 2 editorial system and the sanitized `public.public_projects` view. Its compatibility fallback only reads published, non-confidential rows from the base table when migration 002 has not been applied.

## Existing content model

Migration 001 owns profiles, projects and their technologies/highlights/images, experiences and their children, skills, contact messages, site settings, authentication helpers, RLS, Storage, and grants. Migration 002 adds the sanitized project projection without weakening the Phase 1 project policy. Seeded projects use stable UUIDs ending in `0001` through `0006`.

The project editor currently manages the project record, technologies, highlights, and a cover upload. There are no existing equivalents for structured case-study sections, project metrics, structured diagrams, or mentorship records. The existing `project_images` table is the correct gallery table to extend.

## Security finding to address

The Phase 1 `project_images_public_read` policy exposes every image belonging to a published non-confidential project. Phase 3.1 introduces per-image approval, so migration 003 must replace that policy with one requiring `is_public = true`, while preserving the admin policy and existing rows. Existing rows must default to private.

## Baseline validation

- `npm install`: completed; npm reported two pre-existing high-severity dependency advisories.
- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm run build`: passed with all existing public and admin routes generated successfully.
- Git worktree: clean before implementation.

This file is an implementation audit, not a claim that migration 003 has been applied to the hosted database.

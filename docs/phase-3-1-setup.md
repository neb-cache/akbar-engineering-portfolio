# Phase 3.1 authority setup

## Apply in this order

Phase 1 and Phase 2 must already be present. In Supabase SQL Editor, run:

1. `supabase/migrations/003_phase_3_1_authority.sql`
2. `supabase/phase_3_1_seed.sql`

The seed depends on the tables, columns, policies, and views created by migration 003. Do not run the seed first. Neither file has been applied automatically by Codex.

## What migration 003 changes

It creates `project_case_study_sections`, `project_metrics`, `project_diagrams`, and `mentorship_records`; adds `image_category` and private-by-default `is_public` to `project_images`; adds updated-at triggers and query indexes; enables RLS; grants base-table CRUD only to the authenticated role behind admin policies; and publishes five narrow read-only views.

The migration deliberately removes the Phase 1 anonymous base-table image read policy and revokes anonymous `project_images` access. Public media is available only through `public_project_images`, and only when both the project is published and the individual image is approved.

The public views are owner-privileged sanitized projections by design. They expose an explicit column list and an explicit `is_public`/published-parent predicate. Re-audit their select lists whenever authority tables gain columns.

## Seed ownership

The Phase 3.1 seed uses existing project UUIDs and deterministic keys. It controls:

- case-study rows identified by `(project_id, section_key)`;
- metrics identified by `(project_id, metric_key)`;
- diagrams identified by `(project_id, diagram_key)`;
- mentorship records identified by `record_key`;
- `professional_identity`, `hero`, `social_links`, `resume`, `authority_framework`, and `contact_profile` settings.

It does not delete project technology, highlight, media, or manually authored authority rows. One exact Phase 1 seed highlight containing an unsupported `80%` claim is replaced through a narrowly targeted update.

## Configure resume and contact details

Open `/admin/settings` after migration 003. Set the approved resume HTTPS URL, professional email, GitHub, and LinkedIn. When the resume URL is empty, the public site shows an accessible unavailable state rather than a broken link. No fake resume is generated.

## Admin authoring

- Edit a project at `/admin/projects/{id}/edit` to manage case-study sections, evidence-backed metrics, structured diagrams, and gallery evidence.
- Every authority child and gallery image starts private. Publishing the parent project does not publish its child evidence.
- Open `/admin/mentorship` for public-safe candidate assessment, mentorship, and intern-development records.
- Diagram JSON must contain `groups`, `nodes`, and `edges`; IDs use lowercase slug format, all edges must reference existing nodes, and a text alternative is mandatory.

## Verification SQL

Use the publishable-key client for application-level verification. In SQL Editor, inspect the projection shape with:

```sql
select * from public.public_projects order by sort_order;
select * from public.public_project_case_study_sections order by project_id, sort_order;
select * from public.public_project_metrics order by project_id, sort_order;
select * from public.public_project_diagrams order by project_id, sort_order;
select * from public.public_project_images order by project_id, sort_order;
select * from public.public_mentorship_records order by sort_order;
```

Then verify:

1. A confidential published parent exposes only the already-sanitized project fields plus child rows explicitly marked public.
2. Private sections, metrics, diagrams, and images never appear in their public views.
3. Draft and archived parents never expose child content through the public project views.
4. Anonymous direct selects from the four new base tables and `project_images` are denied.
5. An authenticated non-admin cannot read or mutate authority base rows.
6. An authenticated admin can create, edit, publish, reorder, and delete each authority record type.

## Local validation

```powershell
npm install
npm run lint
npm run typecheck
$env:NODE_OPTIONS='--max-old-space-size=768 --max-semi-space-size=16'; npm run build
```

The explicit memory options are only needed on machines with low available Windows commit space. The repository also limits Next build workers to one to keep local builds reliable; this changes build time, not runtime behavior.

## Known limitations

- Migration and seed application remain a manual Supabase step because this repository has no linked Supabase CLI or direct database credentials.
- Uploaded Storage objects are not deleted when a gallery database record is removed, preventing accidental loss when the same asset is referenced elsewhere. Clean unused objects deliberately in Storage.
- No fake screenshots or resume file are included. Visual evidence appears only after approved media is uploaded and explicitly published.
- Dependency installation currently reports two high-severity npm advisories; evaluate the upgrade path separately rather than applying a breaking forced update inside Phase 3.1.

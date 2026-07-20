-- Intentionally security-definer: this view is a narrow, sanitized public projection.
-- Confidential rows expose only approved portfolio metadata; sensitive columns are nulled.
create or replace view public.public_projects
with (security_barrier = true)
as
select
  id,
  slug,
  title,
  short_description,
  case when confidential then null else description end as description,
  role,
  company,
  case when confidential then null else client_name end as client_name,
  project_type,
  status,
  year_start,
  year_end,
  featured,
  confidential,
  case when confidential then null else cover_image_url end as cover_image_url,
  case when confidential then null else live_url end as live_url,
  case when confidential then null else github_url end as github_url,
  case when confidential then null else case_study_url end as case_study_url,
  sort_order,
  created_at,
  updated_at
from public.projects
where status = 'published';

revoke all on public.public_projects from public, anon, authenticated;
grant select on public.public_projects to anon, authenticated;

comment on view public.public_projects is
  'Sanitized published-project projection. Confidential descriptions, clients, media, and external URLs are withheld.';

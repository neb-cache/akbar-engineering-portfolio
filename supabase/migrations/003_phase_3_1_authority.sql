-- Phase 3.1: structured professional authority content.
-- Additive and safe for a populated Phase 1/2 database.

do $$
begin
  if to_regclass('public.public_projects') is null then
    raise exception 'Phase 3.1 requires migration 002 and public.public_projects.';
  end if;
end $$;

create table if not exists public.project_case_study_sections (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  section_key text not null,
  section_type text not null check (section_type in ('summary','context','challenge','constraint','responsibility','architecture','approach','decision','tradeoff','coordination','outcome','lesson','confidentiality','custom')),
  title text not null,
  content text not null,
  is_public boolean not null default false,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint project_case_study_sections_project_key_unique unique (project_id, section_key)
);

create table if not exists public.project_metrics (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  metric_key text not null,
  label text not null,
  value text not null,
  context text,
  is_public boolean not null default false,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint project_metrics_project_key_unique unique (project_id, metric_key)
);

create table if not exists public.project_diagrams (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  diagram_key text not null,
  title text not null,
  description text,
  diagram_type text not null default 'flow' check (diagram_type in ('flow','layered','integration','architecture','sequence-summary')),
  diagram_data jsonb not null check (
    jsonb_typeof(diagram_data) = 'object'
    and jsonb_typeof(diagram_data -> 'nodes') = 'array'
    and jsonb_typeof(diagram_data -> 'edges') = 'array'
    and jsonb_typeof(diagram_data -> 'groups') = 'array'
  ),
  text_alternative text not null,
  is_public boolean not null default false,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint project_diagrams_project_key_unique unique (project_id, diagram_key)
);

create table if not exists public.mentorship_records (
  id uuid primary key default gen_random_uuid(),
  record_key text unique not null,
  title text not null,
  category text not null check (category in ('candidate-assessment','private-mentorship','intern-development','referral','team-formation','technical-guidance')),
  summary text not null,
  method text,
  outcome text,
  is_public boolean not null default false,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.project_images
  add column if not exists image_category text,
  add column if not exists is_public boolean not null default false;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'project_images_image_category_check'
      and conrelid = 'public.project_images'::regclass
  ) then
    alter table public.project_images
      add constraint project_images_image_category_check
      check (image_category is null or image_category in ('interface','mobile','architecture','workflow','infrastructure','report','code','documentation','other'));
  end if;
end $$;

create index if not exists project_case_study_sections_project_order_idx on public.project_case_study_sections (project_id, sort_order);
create index if not exists project_metrics_project_order_idx on public.project_metrics (project_id, sort_order);
create index if not exists project_diagrams_project_order_idx on public.project_diagrams (project_id, sort_order);
create index if not exists mentorship_records_public_order_idx on public.mentorship_records (sort_order) where is_public = true;
create index if not exists project_images_public_project_order_idx on public.project_images (project_id, sort_order) where is_public = true;

drop trigger if exists project_case_study_sections_updated_at on public.project_case_study_sections;
create trigger project_case_study_sections_updated_at before update on public.project_case_study_sections for each row execute function private.set_updated_at();
drop trigger if exists project_metrics_updated_at on public.project_metrics;
create trigger project_metrics_updated_at before update on public.project_metrics for each row execute function private.set_updated_at();
drop trigger if exists project_diagrams_updated_at on public.project_diagrams;
create trigger project_diagrams_updated_at before update on public.project_diagrams for each row execute function private.set_updated_at();
drop trigger if exists mentorship_records_updated_at on public.mentorship_records;
create trigger mentorship_records_updated_at before update on public.mentorship_records for each row execute function private.set_updated_at();

alter table public.project_case_study_sections enable row level security;
alter table public.project_metrics enable row level security;
alter table public.project_diagrams enable row level security;
alter table public.mentorship_records enable row level security;

drop policy if exists project_case_study_sections_admin_all on public.project_case_study_sections;
create policy project_case_study_sections_admin_all on public.project_case_study_sections for all to authenticated
using ((select private.is_admin())) with check ((select private.is_admin()));
drop policy if exists project_metrics_admin_all on public.project_metrics;
create policy project_metrics_admin_all on public.project_metrics for all to authenticated
using ((select private.is_admin())) with check ((select private.is_admin()));
drop policy if exists project_diagrams_admin_all on public.project_diagrams;
create policy project_diagrams_admin_all on public.project_diagrams for all to authenticated
using ((select private.is_admin())) with check ((select private.is_admin()));
drop policy if exists mentorship_records_admin_all on public.mentorship_records;
create policy mentorship_records_admin_all on public.mentorship_records for all to authenticated
using ((select private.is_admin())) with check ((select private.is_admin()));

-- Phase 1 allowed all images for public non-confidential projects. Phase 3.1
-- makes explicit per-image approval the only public media path.
drop policy if exists project_images_public_read on public.project_images;
revoke select on public.project_images from anon;

revoke all on public.project_case_study_sections, public.project_metrics, public.project_diagrams, public.mentorship_records from public, anon, authenticated;
grant select, insert, update, delete on public.project_case_study_sections, public.project_metrics, public.project_diagrams, public.mentorship_records to authenticated;
grant select, insert, update, delete on public.project_images to authenticated;

create or replace view public.public_project_case_study_sections
with (security_barrier = true)
as select s.id, s.project_id, s.section_key, s.section_type, s.title, s.content, s.sort_order
from public.project_case_study_sections s
join public.projects p on p.id = s.project_id
where p.status = 'published' and s.is_public = true;

create or replace view public.public_project_metrics
with (security_barrier = true)
as select m.id, m.project_id, m.metric_key, m.label, m.value, m.context, m.sort_order
from public.project_metrics m
join public.projects p on p.id = m.project_id
where p.status = 'published' and m.is_public = true;

create or replace view public.public_project_diagrams
with (security_barrier = true)
as select d.id, d.project_id, d.diagram_key, d.title, d.description, d.diagram_type, d.diagram_data, d.text_alternative, d.sort_order
from public.project_diagrams d
join public.projects p on p.id = d.project_id
where p.status = 'published' and d.is_public = true;

create or replace view public.public_project_images
with (security_barrier = true)
as select i.id, i.project_id, i.image_url, i.alt_text, i.caption, i.image_category, i.sort_order
from public.project_images i
join public.projects p on p.id = i.project_id
where p.status = 'published' and i.is_public = true;

create or replace view public.public_mentorship_records
with (security_barrier = true)
as select id, record_key, title, category, summary, method, outcome, sort_order
from public.mentorship_records
where is_public = true;

revoke all on public.public_project_case_study_sections, public.public_project_metrics, public.public_project_diagrams, public.public_project_images, public.public_mentorship_records from public, anon, authenticated;
grant select on public.public_project_case_study_sections, public.public_project_metrics, public.public_project_diagrams, public.public_project_images, public.public_mentorship_records to anon, authenticated;

comment on view public.public_project_case_study_sections is 'Sanitized public case-study projection; only explicitly approved rows of published projects.';
comment on view public.public_project_metrics is 'Sanitized public metric projection; only evidence-backed rows explicitly approved for published projects.';
comment on view public.public_project_diagrams is 'Sanitized public diagram projection containing validated non-executable JSON and accessible alternatives.';
comment on view public.public_project_images is 'Sanitized public media projection; existing and new images remain private until explicitly approved.';
comment on view public.public_mentorship_records is 'Sanitized public mentorship projection without private identities or hiring feedback.';

drop policy if exists site_settings_public_read on public.site_settings;
create policy site_settings_public_read on public.site_settings for select to anon, authenticated
using (key in ('hero','social_links','resume_url','contact','availability','professional_identity','resume','authority_framework','contact_profile'));

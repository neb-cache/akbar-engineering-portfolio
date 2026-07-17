create extension if not exists pgcrypto;
create schema if not exists private;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  role text not null default 'admin' check (role in ('admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  short_description text not null,
  description text not null,
  role text,
  company text,
  client_name text,
  project_type text,
  status text not null default 'published' check (status in ('draft', 'published', 'archived')),
  year_start integer check (year_start between 1990 and 2100),
  year_end integer check (year_end between 1990 and 2100),
  featured boolean not null default false,
  confidential boolean not null default false,
  cover_image_url text,
  live_url text,
  github_url text,
  case_study_url text,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint projects_year_range check (year_end is null or year_start is null or year_end >= year_start)
);

create table public.project_technologies (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  name text not null,
  category text,
  sort_order integer not null default 0 check (sort_order >= 0)
);

create table public.project_highlights (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  content text not null,
  sort_order integer not null default 0 check (sort_order >= 0)
);

create table public.project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  image_url text not null,
  alt_text text,
  caption text,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now()
);

create table public.experiences (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  title text not null,
  employment_type text,
  location text,
  work_mode text check (work_mode is null or work_mode in ('remote', 'hybrid', 'on-site')),
  start_date date not null,
  end_date date,
  is_current boolean not null default false,
  summary text,
  company_url text,
  company_logo_url text,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint experiences_date_range check (end_date is null or end_date >= start_date),
  constraint experiences_current_end_date check (not is_current or end_date is null)
);

create table public.experience_highlights (
  id uuid primary key default gen_random_uuid(),
  experience_id uuid not null references public.experiences(id) on delete cascade,
  content text not null,
  sort_order integer not null default 0 check (sort_order >= 0)
);

create table public.experience_technologies (
  id uuid primary key default gen_random_uuid(),
  experience_id uuid not null references public.experiences(id) on delete cascade,
  name text not null,
  sort_order integer not null default 0 check (sort_order >= 0)
);

create table public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  proficiency integer check (proficiency is null or proficiency between 0 and 100),
  years_experience numeric check (years_experience is null or years_experience >= 0),
  featured boolean not null default false,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint skills_name_category_unique unique (name, category)
);

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  email text not null check (char_length(email) <= 254),
  company text check (char_length(company) <= 160),
  subject text not null check (char_length(subject) between 3 and 200),
  message text not null check (char_length(message) between 10 and 5000),
  status text not null default 'new' check (status in ('new', 'read', 'replied', 'archived')),
  source text not null default 'portfolio',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.site_settings (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  value jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index projects_public_sort_idx on public.projects (sort_order, created_at desc) where status = 'published' and confidential = false;
create index project_technologies_project_idx on public.project_technologies (project_id, sort_order);
create index project_highlights_project_idx on public.project_highlights (project_id, sort_order);
create index project_images_project_idx on public.project_images (project_id, sort_order);
create index experiences_order_idx on public.experiences (is_current desc, start_date desc, sort_order);
create index experience_highlights_experience_idx on public.experience_highlights (experience_id, sort_order);
create index experience_technologies_experience_idx on public.experience_technologies (experience_id, sort_order);
create index skills_category_order_idx on public.skills (category, sort_order, name);
create index contact_messages_status_created_idx on public.contact_messages (status, created_at desc);

create or replace function private.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles for each row execute function private.set_updated_at();
create trigger projects_updated_at before update on public.projects for each row execute function private.set_updated_at();
create trigger experiences_updated_at before update on public.experiences for each row execute function private.set_updated_at();
create trigger skills_updated_at before update on public.skills for each row execute function private.set_updated_at();
create trigger contact_messages_updated_at before update on public.contact_messages for each row execute function private.set_updated_at();
create trigger site_settings_updated_at before update on public.site_settings for each row execute function private.set_updated_at();

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (new.id, new.raw_user_meta_data ->> 'full_name', new.email, 'admin')
  on conflict (id) do nothing;
  return new;
end;
$$;

revoke all on function private.handle_new_user() from public, anon, authenticated;
create trigger on_auth_user_created after insert on auth.users for each row execute function private.handle_new_user();

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;

revoke all on function private.is_admin() from public, anon;
grant usage on schema private to authenticated;
grant execute on function private.is_admin() to authenticated;

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.project_technologies enable row level security;
alter table public.project_highlights enable row level security;
alter table public.project_images enable row level security;
alter table public.experiences enable row level security;
alter table public.experience_highlights enable row level security;
alter table public.experience_technologies enable row level security;
alter table public.skills enable row level security;
alter table public.contact_messages enable row level security;
alter table public.site_settings enable row level security;

create policy "profiles_select_self_or_admin" on public.profiles for select to authenticated
using (id = (select auth.uid()) or (select private.is_admin()));
create policy "profiles_admin_update" on public.profiles for update to authenticated
using ((select private.is_admin())) with check ((select private.is_admin()));

create policy "projects_public_read" on public.projects for select to anon, authenticated
using (status = 'published' and confidential = false);
create policy "projects_admin_all" on public.projects for all to authenticated
using ((select private.is_admin())) with check ((select private.is_admin()));

create policy "project_technologies_public_read" on public.project_technologies for select to anon, authenticated
using (exists (select 1 from public.projects p where p.id = project_id and p.status = 'published' and not p.confidential));
create policy "project_technologies_admin_all" on public.project_technologies for all to authenticated
using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "project_highlights_public_read" on public.project_highlights for select to anon, authenticated
using (exists (select 1 from public.projects p where p.id = project_id and p.status = 'published' and not p.confidential));
create policy "project_highlights_admin_all" on public.project_highlights for all to authenticated
using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "project_images_public_read" on public.project_images for select to anon, authenticated
using (exists (select 1 from public.projects p where p.id = project_id and p.status = 'published' and not p.confidential));
create policy "project_images_admin_all" on public.project_images for all to authenticated
using ((select private.is_admin())) with check ((select private.is_admin()));

create policy "experiences_public_read" on public.experiences for select to anon, authenticated using (true);
create policy "experiences_admin_all" on public.experiences for all to authenticated
using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "experience_highlights_public_read" on public.experience_highlights for select to anon, authenticated using (true);
create policy "experience_highlights_admin_all" on public.experience_highlights for all to authenticated
using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "experience_technologies_public_read" on public.experience_technologies for select to anon, authenticated using (true);
create policy "experience_technologies_admin_all" on public.experience_technologies for all to authenticated
using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "skills_public_read" on public.skills for select to anon, authenticated using (true);
create policy "skills_admin_all" on public.skills for all to authenticated
using ((select private.is_admin())) with check ((select private.is_admin()));

create policy "contact_messages_public_insert" on public.contact_messages for insert to anon, authenticated
with check (status = 'new' and source = 'portfolio');
create policy "contact_messages_admin_select" on public.contact_messages for select to authenticated
using ((select private.is_admin()));
create policy "contact_messages_admin_update" on public.contact_messages for update to authenticated
using ((select private.is_admin())) with check ((select private.is_admin()));

create policy "site_settings_public_read" on public.site_settings for select to anon, authenticated
using (key in ('hero', 'social_links', 'resume_url', 'contact', 'availability'));
create policy "site_settings_admin_all" on public.site_settings for all to authenticated
using ((select private.is_admin())) with check ((select private.is_admin()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('portfolio-media', 'portfolio-media', true, 5242880, array['image/png', 'image/jpeg', 'image/webp'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create policy "portfolio_media_public_read" on storage.objects for select to anon, authenticated
using (bucket_id = 'portfolio-media');
create policy "portfolio_media_admin_insert" on storage.objects for insert to authenticated
with check (bucket_id = 'portfolio-media' and (storage.foldername(name))[1] = 'projects' and (select private.is_admin()));
create policy "portfolio_media_admin_update" on storage.objects for update to authenticated
using (bucket_id = 'portfolio-media' and (select private.is_admin()))
with check (bucket_id = 'portfolio-media' and (select private.is_admin()));
create policy "portfolio_media_admin_delete" on storage.objects for delete to authenticated
using (bucket_id = 'portfolio-media' and (select private.is_admin()));

grant usage on schema public to anon, authenticated;
grant select on public.projects, public.project_technologies, public.project_highlights, public.project_images,
  public.experiences, public.experience_highlights, public.experience_technologies, public.skills, public.site_settings to anon;
grant insert on public.contact_messages to anon;
grant select, insert, update, delete on all tables in schema public to authenticated;

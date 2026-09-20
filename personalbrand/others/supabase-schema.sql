-- ============================================
-- Multi-Tenant Doctor Portfolio Platform
-- Supabase Schema + RLS
-- Run this in the Supabase SQL Editor
-- ============================================

-- enable extension for case-insensitive emails
create extension if not exists citext;

-- ---------- Core: doctors (profiles) ----------
-- Each row = one doctor account (maps to a Clerk user)
create table if not exists public.doctors (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text not null unique,
  slug text not null unique,
  display_name text not null default '',
  email text,
  is_onboarded boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- Core: site_settings (per doctor) ----------
create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  doctor_id uuid not null references public.doctors(id) on delete cascade,
  site_name text,
  tagline text,
  hero_headline text,
  hero_subtitle text,
  theme_colors jsonb default '{}'::jsonb,
  social_links jsonb default '{}'::jsonb,
  contact_email text,
  logo_url text,
  -- Doctor profile fields
  doctor_name text,
  doctor_title text,
  doctor_qualifications text,
  doctor_photo_url text,
  doctor_about text,
  doctor_services jsonb default '[]'::jsonb,
  doctor_bmdc_id text,
  doctor_location text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists site_settings_doctor_idx on public.site_settings (doctor_id);

-- ---------- Core: posts (per doctor) ----------
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  doctor_id uuid not null references public.doctors(id) on delete cascade,
  title text not null,
  slug text not null,
  html_content text not null default '',
  excerpt text,
  featured_image text,
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists posts_doctor_slug_idx on public.posts (doctor_id, slug);

-- ---------- Core: portfolio_items (per doctor) ----------
create table if not exists public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  doctor_id uuid not null references public.doctors(id) on delete cascade,
  type text not null check (type in ('own','client')),
  title text not null,
  description text,
  tech_stack text[] default '{}'::text[],
  url text,
  image text,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------- Core: education_links (per doctor) ----------
create table if not exists public.education_links (
  id uuid primary key default gen_random_uuid(),
  doctor_id uuid not null references public.doctors(id) on delete cascade,
  title text not null,
  description text,
  url text,
  image text,
  sort_order int default 0,
  created_at timestamptz not null default now()
);

-- ---------- Core: media (per doctor) ----------
create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  doctor_id uuid not null references public.doctors(id) on delete cascade,
  title text not null,
  type text not null check (type in ('youtube','video','audio','reel')),
  embed_url text,
  thumbnail text,
  sort_order int default 0,
  created_at timestamptz not null default now()
);

-- ---------- Core: hospital_affiliations (per doctor) ----------
create table if not exists public.hospital_affiliations (
  id uuid primary key default gen_random_uuid(),
  doctor_id uuid not null references public.doctors(id) on delete cascade,
  name text not null,
  status text not null default 'current' check (status in ('current','past')),
  sort_order int default 0,
  created_at timestamptz not null default now()
);

-- ---------- Global: subscribers (cross-tenant) ----------
create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email citext not null unique,
  status text not null default 'active' check (status in ('active','unsubscribed','bounced')),
  lead_magnet_id uuid,
  created_at timestamptz not null default now()
);

-- ---------- Global: tags ----------
create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

-- ---------- Global: post_tags (join) ----------
create table if not exists public.post_tags (
  post_id uuid not null references public.posts(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  primary key (post_id, tag_id)
);

-- ---------- Global: lead_magnets ----------
create table if not exists public.lead_magnets (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  file_url text,
  download_count int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- Global: messages (contact form, per doctor) ----------
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  doctor_id uuid references public.doctors(id) on delete cascade,
  name text not null,
  email text not null,
  message text not null,
  status text not null default 'new' check (status in ('new','read','archived')),
  created_at timestamptz not null default now()
);

-- ---------- Global: email_analytics ----------
create table if not exists public.email_analytics (
  id uuid primary key default gen_random_uuid(),
  subscription_id uuid references public.subscribers(id) on delete cascade,
  event text not null check (event in ('open','click','bounce')),
  occurred_at timestamptz not null default now()
);

-- ============================================
-- RLS POLICIES
-- Service-role key bypasses RLS for server ops.
-- RLS protects client-side queries.
-- ============================================

-- ---------- enable RLS ----------
alter table public.doctors enable row level security;
alter table public.site_settings enable row level security;
alter table public.posts enable row level security;
alter table public.portfolio_items enable row level security;
alter table public.education_links enable row level security;
alter table public.media enable row level security;
alter table public.hospital_affiliations enable row level security;
alter table public.subscribers enable row level security;
alter table public.tags enable row level security;
alter table public.post_tags enable row level security;
alter table public.lead_magnets enable row level security;
alter table public.messages enable row level security;
alter table public.email_analytics enable row level security;

-- ---------- doctors ----------
-- Public can look up a doctor by slug (for subdomain routing)
drop policy if exists "doctors public read by slug" on public.doctors;
create policy "doctors public read by slug" on public.doctors
  for select using (true);
-- Owner can update their own profile
drop policy if exists "doctors owner all" on public.doctors;
create policy "doctors owner all" on public.doctors
  for all using (
    auth.uid()::text = clerk_user_id
  ) with check (
    auth.uid()::text = clerk_user_id
  );

-- ---------- site_settings ----------
-- Public can read all (for public site rendering)
drop policy if exists "settings public read" on public.site_settings;
create policy "settings public read" on public.site_settings
  for select using (true);
-- Owner can manage their own settings
drop policy if exists "settings owner all" on public.site_settings;
create policy "settings owner all" on public.site_settings
  for all using (
    doctor_id in (select id from public.doctors where clerk_user_id = auth.uid()::text)
  ) with check (
    doctor_id in (select id from public.doctors where clerk_user_id = auth.uid()::text)
  );

-- ---------- posts ----------
-- Public reads only published posts
drop policy if exists "posts public read published" on public.posts;
create policy "posts public read published" on public.posts
  for select using (is_published = true);
-- Owner manages their own posts
drop policy if exists "posts owner all" on public.posts;
create policy "posts owner all" on public.posts
  for all using (
    doctor_id in (select id from public.doctors where clerk_user_id = auth.uid()::text)
  ) with check (
    doctor_id in (select id from public.doctors where clerk_user_id = auth.uid()::text)
  );

-- ---------- portfolio_items ----------
-- Public reads only published
drop policy if exists "portfolio public read published" on public.portfolio_items;
create policy "portfolio public read published" on public.portfolio_items
  for select using (is_published = true);
-- Owner manages their own
drop policy if exists "portfolio owner all" on public.portfolio_items;
create policy "portfolio owner all" on public.portfolio_items
  for all using (
    doctor_id in (select id from public.doctors where clerk_user_id = auth.uid()::text)
  ) with check (
    doctor_id in (select id from public.doctors where clerk_user_id = auth.uid()::text)
  );

-- ---------- education_links ----------
-- Public reads all
drop policy if exists "education public read" on public.education_links;
create policy "education public read" on public.education_links for select using (true);
-- Owner manages their own
drop policy if exists "education owner all" on public.education_links;
create policy "education owner all" on public.education_links
  for all using (
    doctor_id in (select id from public.doctors where clerk_user_id = auth.uid()::text)
  ) with check (
    doctor_id in (select id from public.doctors where clerk_user_id = auth.uid()::text)
  );

-- ---------- media ----------
-- Public reads all
drop policy if exists "media public read" on public.media;
create policy "media public read" on public.media for select using (true);
-- Owner manages their own
drop policy if exists "media owner all" on public.media;
create policy "media owner all" on public.media
  for all using (
    doctor_id in (select id from public.doctors where clerk_user_id = auth.uid()::text)
  ) with check (
    doctor_id in (select id from public.doctors where clerk_user_id = auth.uid()::text)
  );

-- ---------- hospital_affiliations ----------
-- Public reads all
drop policy if exists "hospitals public read" on public.hospital_affiliations;
create policy "hospitals public read" on public.hospital_affiliations for select using (true);
-- Owner manages their own
drop policy if exists "hospitals owner all" on public.hospital_affiliations;
create policy "hospitals owner all" on public.hospital_affiliations
  for all using (
    doctor_id in (select id from public.doctors where clerk_user_id = auth.uid()::text)
  ) with check (
    doctor_id in (select id from public.doctors where clerk_user_id = auth.uid()::text)
  );

-- ---------- subscribers ----------
drop policy if exists "subscribers admin select" on public.subscribers;
create policy "subscribers admin select" on public.subscribers
  for select using (auth.uid() is not null);
drop policy if exists "subscribers admin update" on public.subscribers;
create policy "subscribers admin update" on public.subscribers
  for update using (auth.uid() is not null) with check (auth.uid() is not null);
drop policy if exists "subscribers admin delete" on public.subscribers;
create policy "subscribers admin delete" on public.subscribers
  for delete using (auth.uid() is not null);

-- ---------- tags / post_tags ----------
drop policy if exists "tags public read" on public.tags;
create policy "tags public read" on public.tags for select using (true);
drop policy if exists "tags admin all" on public.tags;
create policy "tags admin all" on public.tags
  for all using (auth.uid() is not null) with check (auth.uid() is not null);
drop policy if exists "post_tags public read" on public.post_tags;
create policy "post_tags public read" on public.post_tags for select using (true);
drop policy if exists "post_tags admin all" on public.post_tags;
create policy "post_tags admin all" on public.post_tags
  for all using (auth.uid() is not null) with check (auth.uid() is not null);

-- ---------- lead_magnets ----------
drop policy if exists "magnets public read" on public.lead_magnets;
create policy "magnets public read" on public.lead_magnets for select using (true);
drop policy if exists "magnets admin all" on public.lead_magnets;
create policy "magnets admin all" on public.lead_magnets
  for all using (auth.uid() is not null) with check (auth.uid() is not null);

-- ---------- messages ----------
-- Owner reads messages sent to them
drop policy if exists "messages owner read" on public.messages;
create policy "messages owner read" on public.messages
  for select using (
    doctor_id in (select id from public.doctors where clerk_user_id = auth.uid()::text)
  );
-- Anyone can insert (contact form uses service key, but RLS allows anon inserts)
drop policy if exists "messages public insert" on public.messages;
create policy "messages public insert" on public.messages
  for insert with check (true);
-- Owner can update status
drop policy if exists "messages owner update" on public.messages;
create policy "messages owner update" on public.messages
  for update using (
    doctor_id in (select id from public.doctors where clerk_user_id = auth.uid()::text)
  ) with check (
    doctor_id in (select id from public.doctors where clerk_user_id = auth.uid()::text)
  );

-- ---------- email_analytics ----------
drop policy if exists "analytics admin select" on public.email_analytics;
create policy "analytics admin select" on public.email_analytics
  for select using (auth.uid() is not null);
drop policy if exists "analytics admin delete" on public.email_analytics;
create policy "analytics admin delete" on public.email_analytics
  for delete using (auth.uid() is not null);

-- ============================================
-- TRIGGERS
-- ============================================

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_posts_updated on public.posts;
create trigger trg_posts_updated before update on public.posts
  for each row execute function public.set_updated_at();

drop trigger if exists trg_settings_updated on public.site_settings;
create trigger trg_settings_updated before update on public.site_settings
  for each row execute function public.set_updated_at();

drop trigger if exists trg_doctors_updated on public.doctors;
create trigger trg_doctors_updated before update on public.doctors
  for each row execute function public.set_updated_at();

-- ============================================
-- HELPER: auto-create doctor profile on signup
-- ============================================

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.doctors (clerk_user_id, slug, display_name, email)
  values (
    new.id,
    lower(replace(replace(replace(new.raw_user_meta_data ->> 'first_name', ' ', '-'), '.', ''), '''', '')) || '-' || left(new.id::text, 8),
    coalesce(new.raw_user_meta_data ->> 'first_name', '') || ' ' || coalesce(new.raw_user_meta_data ->> 'last_name', ''),
    new.email
  );
  return new;
end;
$$;

-- This trigger fires when a new Clerk user is created via the webhook
-- (Clerk → Supabase webhook must be configured in Clerk dashboard)
-- For now, we'll handle doctor creation in our API routes.

-- ============================================
-- STORAGE BUCKETS
-- ============================================

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

insert into storage.buckets (id, name, public)
values ('lead-magnets', 'lead-magnets', false)
on conflict (id) do nothing;

-- media: public read
drop policy if exists "media public read" on storage.objects;
create policy "media public read"
  on storage.objects for select
  using (bucket_id = 'media');

-- media: authenticated upload/update/delete
drop policy if exists "media auth write" on storage.objects;
create policy "media auth write"
  on storage.objects for all
  using (bucket_id = 'media' and auth.uid() is not null)
  with check (bucket_id = 'media' and auth.uid() is not null);

-- lead-magnets
drop policy if exists "magnets auth select" on storage.objects;
create policy "magnets auth select"
  on storage.objects for select
  using (bucket_id = 'lead-magnets' and auth.uid() is not null);

drop policy if exists "magnets auth write" on storage.objects;
create policy "magnets auth write"
  on storage.objects for all
  using (bucket_id = 'lead-magnets' and auth.uid() is not null)
  with check (bucket_id = 'lead-magnets' and auth.uid() is not null);

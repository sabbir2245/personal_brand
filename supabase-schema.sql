-- ============================================
-- Personal Branding & Publishing Portal
-- Supabase Schema + RLS
-- Run this in the Supabase SQL Editor
-- ============================================

-- ---------- Core: site_settings (singleton) ----------
create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  site_name text,
  tagline text,he 
  hero_headline text,
  hero_subtitle text,
  theme_colors jsonb default '{}'::jsonb,
  social_links jsonb default '{}'::jsonb,
  contact_email text,
  logo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
-- keep a single row
create unique index if not exists site_settings_singleton on public.site_settings ((true));

-- ---------- Core: posts ----------
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  html_content text not null default '',
  excerpt text,
  featured_image text,
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- Core: portfolio_items ----------
create table if not exists public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('own','client')),
  title text not null,
  description text,
  tech_stack text[] default '{}'::text[],
  url text,
  image text,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------- Core: subscribers ----------
create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email citext not null unique,
  status text not null default 'active' check (status in ('active','unsubscribed','bounced')),
  lead_magnet_id uuid,
  created_at timestamptz not null default now()
);

-- ---------- Supporting: tags ----------
create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

-- ---------- Supporting: post_tags (join) ----------
create table if not exists public.post_tags (
  post_id uuid not null references public.posts(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  primary key (post_id, tag_id)
);

-- ---------- Supporting: education_links ----------
create table if not exists public.education_links (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  url text,
  image text,
  sort_order int default 0,
  created_at timestamptz not null default now()
);

-- ---------- Supporting: media ----------
create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  type text not null check (type in ('youtube','video','audio','reel')),
  embed_url text,
  thumbnail text,
  sort_order int default 0,
  created_at timestamptz not null default now()
);

-- ---------- Supporting: lead_magnets ----------
create table if not exists public.lead_magnets (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  file_url text,
  download_count int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- Supporting: messages (contact form) ----------
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  status text not null default 'new' check (status in ('new','read','archived')),
  created_at timestamptz not null default now()
);

-- ---------- Supporting: email_analytics ----------
create table if not exists public.email_analytics (
  id uuid primary key default gen_random_uuid(),
  subscription_id uuid references public.subscribers(id) on delete cascade,
  event text not null check (event in ('open','click','bounce')),
  occurred_at timestamptz not null default now()
);

-- FK: subscribers -> lead_magnets
alter table public.subscribers
  add constraint subscribers_lead_magnet_fk
  foreign key (lead_magnet_id) references public.lead_magnets(id) on delete set null;

-- ---------- enable RLS on all tables ----------
alter table public.site_settings enable row level security;
alter table public.posts enable row level security;
alter table public.portfolio_items enable row level security;
alter table public.subscribers enable row level security;
alter table public.tags enable row level security;
alter table public.post_tags enable row level security;
alter table public.education_links enable row level security;
alter table public.media enable row level security;
alter table public.lead_magnets enable row level security;
alter table public.messages enable row level security;
alter table public.email_analytics enable row level security;

-- ---------- RLS POLICIES ----------
-- Public (anon) can only SELECT published content / general info.
-- Admin writes go through authenticated API routes (service key).
-- Unauthenticated direct SELECTs use the anon key.

-- posts: public reads only published
create policy "posts public read published" on public.posts
  for select using (is_published = true);
create policy "posts admin all" on public.posts
  for all using (auth.uid() is not null) with check (auth.uid() is not null);

-- portfolio_items: public reads only published
create policy "portfolio public read published" on public.portfolio_items
  for select using (is_published = true);
create policy "portfolio admin all" on public.portfolio_items
  for all using (auth.uid() is not null) with check (auth.uid() is not null);

-- site_settings: public reads display fields
create policy "settings public read" on public.site_settings
  for select using (true);
create policy "settings admin update" on public.site_settings
  for all using (auth.uid() is not null) with check (auth.uid() is not null);

-- subscribers: NO public writes. Admin manages; API inserts use service key.
create policy "subscribers admin select" on public.subscribers
  for select using (auth.uid() is not null);
create policy "subscribers admin update" on public.subscribers
  for update using (auth.uid() is not null) with check (auth.uid() is not null);
create policy "subscribers admin delete" on public.subscribers
  for delete using (auth.uid() is not null);

-- tags / post_tags: public read, admin all
create policy "tags public read" on public.tags for select using (true);
create policy "tags admin all" on public.tags
  for all using (auth.uid() is not null) with check (auth.uid() is not null);
create policy "post_tags public read" on public.post_tags for select using (true);
create policy "post_tags admin all" on public.post_tags
  for all using (auth.uid() is not null) with check (auth.uid() is not null);

-- education_links / media: public read, admin all
create policy "education public read" on public.education_links for select using (true);
create policy "education admin all" on public.education_links
  for all using (auth.uid() is not null) with check (auth.uid() is not null);
create policy "media public read" on public.media for select using (true);
create policy "media admin all" on public.media
  for all using (auth.uid() is not null) with check (auth.uid() is not null);

-- lead_magnets: public read (filename/download), admin all
create policy "magnets public read" on public.lead_magnets for select using (true);
create policy "magnets admin all" on public.lead_magnets
  for all using (auth.uid() is not null) with check (auth.uid() is not null);

-- messages: no public reads/writes (contact form via API service key), admin manages
create policy "messages admin all" on public.messages
  for all using (auth.uid() is not null) with check (auth.uid() is not null);

-- email_analytics: owned by subscribers indirectly; no public access
create policy "analytics admin select" on public.email_analytics
  for select using (auth.uid() is not null);
create policy "analytics admin delete" on public.email_analytics
  for delete using (auth.uid() is not null);

-- ---------- helper: trigger to set updated_at on posts & settings ----------
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
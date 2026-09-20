-- Hospital Affiliations Table
-- Run this in Supabase > SQL Editor

create table if not exists hospital_affiliations (
  id          uuid        primary key default gen_random_uuid(),
  name        text        not null,
  status      text        not null check (status in ('current', 'visiting', 'former')),
  sort_order  int         not null default 0,
  created_at  timestamptz not null default now()
);

alter table hospital_affiliations enable row level security;

create policy "Public read hospital_affiliations"
  on hospital_affiliations for select
  to anon using (true);

create policy "Admin all hospital_affiliations"
  on hospital_affiliations for all
  to authenticated using (true) with check (true);

-- DankPass Loyalty Program Database Schema
-- Run this in your Supabase SQL editor

-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create custom types
do $$ begin
  create type receipt_status as enum ('pending','approved','denied');
  create type receipt_kind   as enum ('dispensary','restaurant','unknown');
  create type redeem_status  as enum ('pending','fulfilled','cancelled');
exception when duplicate_object then null; end $$;

-- Users profiles (extends auth.users)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  city text,
  is_plus boolean default false,
  created_at timestamptz default now()
);

-- Partners (dispensary + restaurant)
create table if not exists partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  kind text check (kind in ('dispensary','restaurant')) not null,
  url text,
  logo_url text,
  match_keywords text[] default '{}',
  is_featured boolean default false,
  city text,
  state text,
  created_at timestamptz default now()
);

-- Campaigns (optional promos)
create table if not exists campaigns (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid references partners(id) on delete cascade,
  name text not null,
  starts_at timestamptz,
  ends_at timestamptz,
  bonus_points int default 0,
  multiplier numeric default 1.0,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Receipts
create table if not exists receipts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  storage_path text not null,
  kind receipt_kind default 'unknown',
  matched_partner_id uuid references partners(id),
  status receipt_status default 'pending',
  vendor text,
  total_amount_cents int,
  receipt_date date,
  image_hash text,
  deny_reason text,
  created_at timestamptz default now(),
  approved_at timestamptz
);

-- Points ledger
create table if not exists points_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  delta int not null,
  reason text check (reason in ('receipt','combo','bonus','redeem','admin')) not null,
  ref_id uuid,
  created_at timestamptz default now()
);

-- Redemptions
create table if not exists redemptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  reward_code text check (reward_code in ('SHOUTOUT','BONUS_CLIP','STICKERS')) not null,
  points_cost int not null,
  status redeem_status default 'pending',
  created_at timestamptz default now(),
  fulfilled_at timestamptz
);

-- Points rules configuration
create table if not exists points_rules (
  code text primary key,
  points int not null,
  window_hours int default 0,
  details jsonb default '{}'
);

-- Agent events for observability
create table if not exists agent_events (
  id uuid primary key default gen_random_uuid(),
  receipt_id uuid references receipts(id),
  event_type text not null,
  details jsonb default '{}',
  created_at timestamptz default now()
);

-- Seed points rules
insert into points_rules (code, points) values ('RECEIPT_DISP',10) on conflict do nothing;
insert into points_rules (code, points) values ('RECEIPT_REST',8) on conflict do nothing;
insert into points_rules (code, points, window_hours) values ('COMBO48',15,48) on conflict do nothing;

-- Create indices for performance
create index if not exists idx_receipts_user_created on receipts(user_id, created_at desc);
create index if not exists idx_receipts_status on receipts(status);
create index if not exists idx_receipts_hash on receipts(image_hash);
create index if not exists idx_partners_featured on partners(is_featured);
create index if not exists idx_points_user_created on points_ledger(user_id, created_at desc);
create index if not exists idx_redemptions_user_created on redemptions(user_id, created_at desc);

-- Enable Row Level Security
alter table profiles enable row level security;
alter table receipts enable row level security;
alter table points_ledger enable row level security;
alter table redemptions enable row level security;
alter table partners enable row level security;
alter table campaigns enable row level security;
alter table agent_events enable row level security;

-- RLS Policies

-- Profiles: user reads own, admins can read all
create policy "profile self" on profiles for select using (auth.uid() = id);
create policy "profile upsert self" on profiles for insert with check (auth.uid() = id);
create policy "profile update self" on profiles for update using (auth.uid() = id);

-- Receipts: user reads/creates own; service role/agent updates
create policy "receipts self read" on receipts for select using (auth.uid() = user_id);
create policy "receipts self insert" on receipts for insert with check (auth.uid() = user_id);

-- Points: user reads own
create policy "points self read" on points_ledger for select using (auth.uid() = user_id);

-- Redemptions: user reads own; inserts own
create policy "redemptions self read" on redemptions for select using (auth.uid() = user_id);
create policy "redemptions self insert" on redemptions for insert with check (auth.uid() = user_id);

-- Partners/campaigns: public read (showcase), admin writes (handled via service role)
create policy "partners public read" on partners for select using (true);
create policy "campaigns public read" on campaigns for select using (true);

-- Agent events: service role only
create policy "agent events service" on agent_events for all using (false);

-- Create storage bucket for receipts
insert into storage.buckets (id, name, public) values ('receipts', 'receipts', false) on conflict (id) do nothing;

-- Storage policies for receipts bucket
create policy "receipts upload" on storage.objects for insert with check (bucket_id = 'receipts' and auth.role() = 'authenticated');
create policy "receipts select" on storage.objects for select using (bucket_id = 'receipts' and auth.role() = 'authenticated');

-- Seed some example partners
insert into partners (name, kind, match_keywords, is_featured, city, state) values 
('High Society Seeds', 'dispensary', ARRAY['HIGH SOCIETY','HSS','HIGHSOCIETY'], true, 'Denver', 'CO'),
('Tivoli''s Pizza', 'restaurant', ARRAY['TIVOLI','TIVOLIS','TIVOLI PIZZA'], true, 'Denver', 'CO'),
('Green Dragon', 'dispensary', ARRAY['GREEN DRAGON','GREENDRAGON'], false, 'Denver', 'CO'),
('Burger Palace', 'restaurant', ARRAY['BURGER PALACE','BURGERPALACE'], false, 'Denver', 'CO')
on conflict do nothing;

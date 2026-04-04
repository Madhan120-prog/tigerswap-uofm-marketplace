-- ============================================================
-- TigerSwap — Supabase Schema (Epic 4)
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ----------------------------------------------------------------
-- 1. PROFILES table (mirrors auth.users)
-- ----------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  name        text not null default '',
  items_listed int not null default 0,
  items_given  int not null default 0,
  created_at  timestamptz not null default now()
);

-- RLS
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can update their own profile"
  on public.profiles for update using (auth.uid() = id);

-- Auto-create profile row on new user signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name)
  values (
    new.id,
    initcap(replace(split_part(new.email, '@', 1), '.', ' '))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ----------------------------------------------------------------
-- 2. LISTINGS table
-- ----------------------------------------------------------------
create table if not exists public.listings (
  id          uuid primary key default gen_random_uuid(),
  seller_id   uuid not null references public.profiles(id) on delete cascade,
  title       text not null,
  description text not null default '',
  type        text not null check (type in ('free', 'sell', 'trade')),
  status      text not null default 'available' check (status in ('available', 'reserved', 'completed')),
  price       numeric(10, 2),  -- null for free/trade
  category    text not null,
  condition   text not null check (condition in ('New', 'Like New', 'Good', 'Fair', 'Poor')),
  created_at  timestamptz not null default now()
);

-- RLS
alter table public.listings enable row level security;

create policy "Listings are viewable by everyone"
  on public.listings for select using (true);

create policy "Authenticated users can insert listings"
  on public.listings for insert with check (auth.uid() = seller_id);

create policy "Sellers can update own listings"
  on public.listings for update using (auth.uid() = seller_id);

create policy "Sellers can delete own listings"
  on public.listings for delete using (auth.uid() = seller_id);


-- ----------------------------------------------------------------
-- 3. LISTING_IMAGES table
-- ----------------------------------------------------------------
create table if not exists public.listing_images (
  id            uuid primary key default gen_random_uuid(),
  listing_id    uuid not null references public.listings(id) on delete cascade,
  image_url     text not null,
  display_order int not null default 0
);

-- RLS
alter table public.listing_images enable row level security;

create policy "Listing images are viewable by everyone"
  on public.listing_images for select using (true);

create policy "Authenticated users can insert listing images"
  on public.listing_images for insert with check (
    auth.uid() = (
      select seller_id from public.listings where id = listing_id
    )
  );

create policy "Sellers can delete own listing images"
  on public.listing_images for delete using (
    auth.uid() = (
      select seller_id from public.listings where id = listing_id
    )
  );


-- ----------------------------------------------------------------
-- 4. STORAGE BUCKET
-- Run separately in the Supabase Dashboard: Storage → New Bucket
--   Name: listing-images
--   Public: YES
-- Or use the SQL below:
-- ----------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('listing-images', 'listing-images', true)
on conflict (id) do nothing;

-- Storage RLS: anyone can view images (public bucket)
create policy "Public images are viewable"
  on storage.objects for select using (bucket_id = 'listing-images');

-- Only authenticated sellers can upload
create policy "Authenticated users can upload listing images"
  on storage.objects for insert with check (
    bucket_id = 'listing-images' and auth.role() = 'authenticated'
  );

-- Sellers can delete their own uploads
create policy "Authenticated users can delete own listing images"
  on storage.objects for delete using (
    bucket_id = 'listing-images' and auth.uid()::text = (storage.foldername(name))[1]
  );

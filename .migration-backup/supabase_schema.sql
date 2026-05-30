-- SQL Schema for Sharing It (Secure File Sharing Platform)
-- Run this in your Supabase project's SQL Editor to set up the database tables, triggers, and Row Level Security (RLS) policies.

-- 1. Create Profiles Table (Linked to Supabase Auth)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  avatar_url text,
  welcome_sent_at timestamp with time zone null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Profiles
alter table public.profiles enable row level security;

-- Profiles Policies (Drop if they exist before creating)
drop policy if exists "Public profiles are viewable by everyone." on public.profiles;
create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

drop policy if exists "Users can update their own profile." on public.profiles;
create policy "Users can update their own profile." on public.profiles
  for update using (auth.uid() = id);

-- 1b. Email preferences / unsubscribe registry
create table if not exists public.email_unsubscribes (
  email text primary key,
  source text default 'welcome' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.email_unsubscribes enable row level security;

drop policy if exists "Anyone can record email unsubscribes" on public.email_unsubscribes;
create policy "Anyone can record email unsubscribes" on public.email_unsubscribes
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Users can read unsubscribe state" on public.email_unsubscribes;
create policy "Users can read unsubscribe state" on public.email_unsubscribes
  for select
  to anon, authenticated
  using (true);

-- 2. Create Files Table
create table if not exists public.files (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade null, -- null for anonymous guest uploads
  name text not null,
  size bigint not null,
  type text not null,
  storage_path text not null, -- Supabase storage path inside bucket
  slug text unique not null, -- Short code for sharing link
  password text null, -- Plaintext or hashed passkey for access gating
  expires_at timestamp with time zone null, -- Link expiry timestamp
  downloads_count integer default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Files
alter table public.files enable row level security;

-- Files Policies (Drop if they exist before creating)
drop policy if exists "Anyone can view files by slug if not expired" on public.files;
create policy "Anyone can view files by slug if not expired" on public.files
  for select using (expires_at is null or expires_at > now());

drop policy if exists "Anyone can insert files (allows guest uploads)" on public.files;
create policy "Anyone can insert files (allows guest uploads)" on public.files
  for insert with check (true);

drop policy if exists "Anyone can update files (allows download count increments)" on public.files;
create policy "Anyone can update files (allows download count increments)" on public.files
  for update using (true);

drop policy if exists "Owners can delete their own files" on public.files;
create policy "Owners can delete their own files" on public.files
  for delete using (auth.uid() = user_id);

-- 3. Automatic Profile Creation Trigger on Sign Up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'User'),
    coalesce(
      new.raw_user_meta_data->>'avatar_url',
      'https://api.dicebear.com/7.x/initials/svg?seed=' || coalesce(new.id::text, 'User')
    )
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = coalesce(excluded.full_name, public.profiles.full_name),
    avatar_url = coalesce(excluded.avatar_url, public.profiles.avatar_url);
  return new;
end;
$$ language plpgsql security definer;

-- Recreate trigger cleanly
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 4. Storage Bucket + Policies
-- This fixes: StorageApiError: Bucket not found.
-- Run the full script in Supabase SQL Editor, then uploads can target this bucket.
insert into storage.buckets (id, name, public, file_size_limit)
values ('sharing-it-files', 'sharing-it-files', false, 1073741824)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit;

drop policy if exists "Anyone can upload sharing files" on storage.objects;
create policy "Anyone can upload sharing files" on storage.objects
  for insert
  to anon, authenticated
  with check (bucket_id = 'sharing-it-files');

drop policy if exists "Anyone can read sharing files" on storage.objects;
create policy "Anyone can read sharing files" on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'sharing-it-files');

drop policy if exists "Owners can update sharing files" on storage.objects;
create policy "Owners can update sharing files" on storage.objects
  for update
  to authenticated
  using (bucket_id = 'sharing-it-files' and owner = auth.uid())
  with check (bucket_id = 'sharing-it-files' and owner = auth.uid());

drop policy if exists "Owners can delete sharing files" on storage.objects;
create policy "Owners can delete sharing files" on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'sharing-it-files' and owner = auth.uid());

-- Auth email setup note:
-- SQL cannot disable hosted Supabase Auth email confirmation. To avoid the default confirmation blocker,
-- go to Authentication -> Sign In / Providers -> Email and turn OFF "Confirm email".
-- If you keep confirmation ON, set the Confirm signup email template to include {{ .Token }};
-- the app now lets users paste that code or open the email link.

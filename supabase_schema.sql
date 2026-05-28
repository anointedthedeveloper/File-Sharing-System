-- SQL Schema for Sharing It (Secure File Sharing Platform)
-- Run this in your Supabase project's SQL Editor to set up the database tables, triggers, and Row Level Security (RLS) policies.

-- 1. Create Profiles Table (Linked to Supabase Auth)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Profiles
alter table public.profiles enable row level security;

-- Profiles Policies
create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

create policy "Users can update their own profile." on public.profiles
  for update using (auth.uid() = id);

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

-- Files Policies
create policy "Anyone can view files by slug if not expired" on public.files
  for select using (expires_at is null or expires_at > now());

create policy "Anyone can insert files (allows guest uploads)" on public.files
  for insert with check (true);

create policy "Anyone can update files (allows download count increments)" on public.files
  for update using (true);

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
      'https://api.dicebear.com/7.x/initials/svg?seed=' || encodeURIComponent(coalesce(new.raw_user_meta_data->>'full_name', new.email))
    )
  );
  return new;
end;
$$ language plpgsql security definer;

-- Recreate trigger cleanly
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 4. Storage Bucket Setup Instructions
-- Go to Supabase Dashboard -> Storage and create a public bucket named "sharing-it-files".
-- Set up the following storage RLS policies for the "sharing-it-files" bucket:
--   - Select policy: "Allow public read access" -> Using `true` (so downloaded links work)
--   - Insert policy: "Allow anyone to upload files" -> Using `true`
--   - Delete policy: "Allow owners to delete files" -> Using `auth.uid() = owner` or `true` for general management.

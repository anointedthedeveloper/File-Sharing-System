-- Sharing It production schema, storage bucket, and RLS policies.
-- This migration mirrors supabase_schema.sql so it can be pushed with Supabase CLI.

create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  avatar_url text,
  welcome_sent_at timestamp with time zone null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;

drop policy if exists "Public profiles are viewable by everyone." on public.profiles;
create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

drop policy if exists "Users can update their own profile." on public.profiles;
create policy "Users can update their own profile." on public.profiles
  for update using (auth.uid() = id);

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

create table if not exists public.files (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade null,
  name text not null,
  size bigint not null,
  type text not null,
  storage_path text not null,
  slug text unique not null,
  password text null,
  expires_at timestamp with time zone null,
  downloads_count integer default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.files enable row level security;

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

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

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

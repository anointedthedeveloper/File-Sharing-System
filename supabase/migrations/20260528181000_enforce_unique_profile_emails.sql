-- Keep profile emails unique case-insensitively.
-- Supabase Auth already enforces one account per email, but this protects app tables too.

create unique index if not exists profiles_email_lower_unique
on public.profiles (lower(email));

create unique index if not exists email_unsubscribes_email_lower_unique
on public.email_unsubscribes (lower(email));

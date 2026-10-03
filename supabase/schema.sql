-- ==============================================================================
-- Siddaganga Institute of Technology, Tumakuru
-- Department of Chemical Engineering — Student Profiles Schema
-- ==============================================================================
-- Run this script in your Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)

-- 1. Create the student_profiles table
create table if not exists public.student_profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  usn text unique not null,
  full_name text not null default 'SIT Student',
  institution text not null default 'Siddaganga Institute of Technology, Tumakuru',
  department text not null default 'Chemical Engineering',
  dept_code text not null default 'CH',
  semester integer not null default 3,
  section text not null default 'A',
  academic_year text not null default '2024–2025',
  email text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create index on USN for quick lookups
create index if not exists idx_student_profiles_usn on public.student_profiles(usn);

-- 3. Enable Row Level Security (RLS)
alter table public.student_profiles enable row level security;

-- 4. RLS Policies: Students can only view, insert, and update their own profile
drop policy if exists "Students can view own profile" on public.student_profiles;
create policy "Students can view own profile"
  on public.student_profiles
  for select
  using (auth.uid() = id);

drop policy if exists "Students can insert own profile" on public.student_profiles;
create policy "Students can insert own profile"
  on public.student_profiles
  for insert
  with check (auth.uid() = id);

drop policy if exists "Students can update own profile" on public.student_profiles;
create policy "Students can update own profile"
  on public.student_profiles
  for update
  using (auth.uid() = id);

-- 5. Trigger function to automatically create student_profile on auth.users registration
create or replace function public.handle_new_student_profile()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  raw_usn text;
  raw_full_name text;
  raw_semester integer;
begin
  raw_usn := coalesce(new.raw_user_meta_data->>'usn', upper(split_part(new.email, '@', 1)));
  raw_full_name := coalesce(new.raw_user_meta_data->>'full_name', 'SIT Student');
  raw_semester := coalesce((new.raw_user_meta_data->>'semester')::integer, 3);

  insert into public.student_profiles (
    id,
    usn,
    full_name,
    institution,
    department,
    dept_code,
    semester,
    section,
    academic_year,
    email,
    created_at,
    updated_at
  )
  values (
    new.id,
    raw_usn,
    raw_full_name,
    'Siddaganga Institute of Technology, Tumakuru',
    'Chemical Engineering',
    'CH',
    raw_semester,
    'A',
    '2024–2025',
    new.email,
    now(),
    now()
  )
  on conflict (id) do update set
    usn = excluded.usn,
    full_name = excluded.full_name,
    updated_at = now();

  return new;
end;
$$;

-- 6. Attach trigger to auth.users table
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_student_profile();

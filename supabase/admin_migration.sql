-- ==============================================================================
-- Siddaganga Institute of Technology, Tumakuru
-- Department of Chemical Engineering — Safe Admin Migration
-- File: supabase/admin_migration.sql
-- ==============================================================================
-- SAFE FOR EXISTING DATABASES:
-- • DOES NOT drop student_profiles table
-- • DOES NOT delete or alter existing student records
-- • DOES NOT modify existing student credentials or passwords
-- • Idempotent: can be run safely multiple times
-- ==============================================================================

-- 1. Safely add the 'role' column to student_profiles if it does not already exist
do $$
begin
  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'student_profiles'
      and column_name = 'role'
  ) then
    alter table public.student_profiles
      add column role text not null default 'student';
  end if;
end $$;

-- Ensure check constraint on role values exists safely
do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'chk_student_profiles_role'
  ) then
    alter table public.student_profiles
      add constraint chk_student_profiles_role
      check (role in ('student', 'faculty_admin', 'super_admin'));
  end if;
end $$;

-- Backfill any existing null roles to 'student'
update public.student_profiles
set role = 'student'
where role is null;

-- Ensure column default is set to 'student'
alter table public.student_profiles
  alter column role set default 'student';

-- 2. Add required indexes safely
create index if not exists idx_student_profiles_usn
  on public.student_profiles(usn);

create index if not exists idx_student_profiles_role
  on public.student_profiles(role);

-- 3. Create or replace the is_admin() security-definer helper function
-- Must run with security definer to safely evaluate the requesting user's role without recursion
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.student_profiles
    where id = auth.uid()
      and role in ('faculty_admin', 'super_admin')
  );
$$;

-- Grant execution permission to authenticated users
grant execute on function public.is_admin() to authenticated, anon;

-- 4. Create or replace the role escalation protection trigger
-- Primary protection: compares OLD and NEW row state directly without subqueries.
-- Only authorized administrators can modify the 'role' column.
create or replace function public.prevent_self_role_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- If role column is being changed and user is not an authorized administrator:
  if (new.role is distinct from old.role) and not public.is_admin() then
    raise exception 'Unauthorized: Only department administrators can modify user roles.';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_prevent_role_escalation on public.student_profiles;
create trigger trg_prevent_role_escalation
  before update on public.student_profiles
  for each row execute procedure public.prevent_self_role_escalation();

-- 5. Safely update the auth user creation trigger function
-- Guarantees that any new student registration ALWAYS defaults to 'student' role
create or replace function public.handle_new_student_profile()
returns trigger
language plpgsql
security definer
set search_path = public
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
    role,
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
    'student', -- ALWAYS defaults to 'student', ignores client metadata tampering
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

-- Ensure trigger is active on auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_student_profile();

-- 6. Create academic_resources table if it does not exist
create table if not exists public.academic_resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subject_code text not null,
  subject_name text not null,
  semester integer not null default 3,
  resource_type text not null check (resource_type in ('notes', 'question_paper', 'lab_manual')),
  description text default '',
  file_link text not null,
  file_size text default '2.5 MB',
  author_faculty text default '',
  date_added date not null default current_date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_academic_resources_type
  on public.academic_resources(resource_type);

create index if not exists idx_academic_resources_subject
  on public.academic_resources(subject_code);

-- 7. Create department_announcements table if it does not exist
create table if not exists public.department_announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default 'Circular',
  priority text not null default 'normal' check (priority in ('normal', 'high')),
  content text not null,
  author text not null default 'Department Office',
  attachment_name text,
  pinned boolean default false,
  date date not null default current_date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_department_announcements_pinned
  on public.department_announcements(pinned);

-- 8. Enable Row Level Security (RLS) on all tables
alter table public.student_profiles enable row level security;
alter table public.academic_resources enable row level security;
alter table public.department_announcements enable row level security;

-- 9. Row Level Security Policies for student_profiles

-- Policy A: Students can view their OWN profile
drop policy if exists "Students can view own profile" on public.student_profiles;
create policy "Students can view own profile"
  on public.student_profiles
  for select
  using (auth.uid() = id);

-- Policy B: Admins can view ALL student profiles
drop policy if exists "Admins can view all student profiles" on public.student_profiles;
create policy "Admins can view all student profiles"
  on public.student_profiles
  for select
  using (public.is_admin());

-- Policy C: Users can insert their own profile ONLY with 'student' role
drop policy if exists "Students can insert own profile" on public.student_profiles;
create policy "Students can insert own profile"
  on public.student_profiles
  for insert
  with check (auth.uid() = id and role = 'student');

-- Policy D: Users can update their own profile; admins can update any profile
-- NON-RECURSIVE: uses direct row authorization without subqueries on student_profiles.
-- Any unauthorized attempt to modify the 'role' column is intercepted and aborted
-- by the 'trg_prevent_role_escalation' trigger.
drop policy if exists "Students can update own profile" on public.student_profiles;
create policy "Students can update own profile"
  on public.student_profiles
  for update
  using (auth.uid() = id or public.is_admin())
  with check (auth.uid() = id or public.is_admin());

-- 10. Row Level Security Policies for academic_resources

-- Read: Students and public can view all academic resources
drop policy if exists "Anyone can read academic resources" on public.academic_resources;
create policy "Anyone can read academic resources"
  on public.academic_resources
  for select
  using (true);

-- Insert: ONLY authorized admins can add notes, question papers, or manuals
drop policy if exists "Admins can insert academic resources" on public.academic_resources;
create policy "Admins can insert academic resources"
  on public.academic_resources
  for insert
  with check (public.is_admin());

-- Update: ONLY authorized admins can edit resources
drop policy if exists "Admins can update academic resources" on public.academic_resources;
create policy "Admins can update academic resources"
  on public.academic_resources
  for update
  using (public.is_admin());

-- Delete: ONLY authorized admins can delete resources
drop policy if exists "Admins can delete academic resources" on public.academic_resources;
create policy "Admins can delete academic resources"
  on public.academic_resources
  for delete
  using (public.is_admin());

-- 11. Row Level Security Policies for department_announcements

-- Read: Students and public can view all circulars
drop policy if exists "Anyone can read department announcements" on public.department_announcements;
create policy "Anyone can read department announcements"
  on public.department_announcements
  for select
  using (true);

-- Insert: ONLY authorized admins can publish circulars
drop policy if exists "Admins can insert announcements" on public.department_announcements;
create policy "Admins can insert announcements"
  on public.department_announcements
  for insert
  with check (public.is_admin());

-- Update: ONLY authorized admins can edit announcements
drop policy if exists "Admins can update announcements" on public.department_announcements;
create policy "Admins can update announcements"
  on public.department_announcements
  for update
  using (public.is_admin());

-- Delete: ONLY authorized admins can delete announcements
drop policy if exists "Admins can delete announcements" on public.department_announcements;
create policy "Admins can delete announcements"
  on public.department_announcements
  for delete
  using (public.is_admin());

-- ==============================================================================
-- Siddaganga Institute of Technology, Tumakuru
-- Department of Chemical Engineering — Complete Security & Admin Schema
-- ==============================================================================
-- Run this in your Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)

-- 1. Create or update student_profiles with role support
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
  role text not null default 'student' check (role in ('student', 'faculty_admin', 'super_admin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index on USN and Role
create index if not exists idx_student_profiles_usn on public.student_profiles(usn);
create index if not exists idx_student_profiles_role on public.student_profiles(role);

-- 2. Helper function to check if the requesting user has Admin privileges
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
    where id = auth.uid() and role in ('faculty_admin', 'super_admin')
  );
$$;

-- 3. Row Level Security on student_profiles
alter table public.student_profiles enable row level security;

drop policy if exists "Students can view own profile" on public.student_profiles;
create policy "Students can view own profile"
  on public.student_profiles
  for select
  using (auth.uid() = id);

drop policy if exists "Admins can view all student profiles" on public.student_profiles;
create policy "Admins can view all student profiles"
  on public.student_profiles
  for select
  using (public.is_admin());

drop policy if exists "Students can insert own profile" on public.student_profiles;
create policy "Students can insert own profile"
  on public.student_profiles
  for insert
  with check (auth.uid() = id and role = 'student');

-- Non-recursive update policy: trigger enforces that only admins can modify the role column
drop policy if exists "Students can update own profile" on public.student_profiles;
create policy "Students can update own profile"
  on public.student_profiles
  for update
  using (auth.uid() = id or public.is_admin())
  with check (auth.uid() = id or public.is_admin());

-- 4. Trigger to prevent privilege escalation on role column
create or replace function public.prevent_self_role_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
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
    'student',
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

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_student_profile();

-- 6. Academic Resources Table (Notes, Question Papers, Lab Manuals)
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

alter table public.academic_resources enable row level security;

-- Everyone can read academic resources
drop policy if exists "Anyone can read academic resources" on public.academic_resources;
create policy "Anyone can read academic resources"
  on public.academic_resources
  for select
  using (true);

-- Only admins can insert, update, or delete resources
drop policy if exists "Admins can insert academic resources" on public.academic_resources;
create policy "Admins can insert academic resources"
  on public.academic_resources
  for insert
  with check (public.is_admin());

drop policy if exists "Admins can update academic resources" on public.academic_resources;
create policy "Admins can update academic resources"
  on public.academic_resources
  for update
  using (public.is_admin());

drop policy if exists "Admins can delete academic resources" on public.academic_resources;
create policy "Admins can delete academic resources"
  on public.academic_resources
  for delete
  using (public.is_admin());

-- 7. Department Announcements Table
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

alter table public.department_announcements enable row level security;

-- Everyone can view announcements
drop policy if exists "Anyone can read department announcements" on public.department_announcements;
create policy "Anyone can read department announcements"
  on public.department_announcements
  for select
  using (true);

-- Only admins can manage announcements
drop policy if exists "Admins can insert announcements" on public.department_announcements;
create policy "Admins can insert announcements"
  on public.department_announcements
  for insert
  with check (public.is_admin());

drop policy if exists "Admins can update announcements" on public.department_announcements;
create policy "Admins can update announcements"
  on public.department_announcements
  for update
  using (public.is_admin());

drop policy if exists "Admins can delete announcements" on public.department_announcements;
create policy "Admins can delete announcements"
  on public.department_announcements
  for delete
  using (public.is_admin());

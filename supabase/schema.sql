create extension if not exists pgcrypto;

create type public.app_role as enum ('admin', 'officer', 'viewer');
create type public.fir_status as enum ('draft', 'pending', 'under_investigation', 'closed');
create type public.criminal_record_status as enum ('pending', 'approved', 'rejected');
create type public.case_priority as enum ('low', 'medium', 'high');
create type public.case_status as enum ('open', 'in_progress', 'pending_review', 'closed');

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.user_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  full_name text not null,
  badge_number text unique,
  role public.app_role not null default 'viewer',
  is_active boolean not null default true,
  station_name text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create or replace function public.current_role()
returns public.app_role
language sql
stable
security definer
set search_path = public
as $$
  select role
  from public.user_profiles
  where id = auth.uid();
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_role() = 'admin', false);
$$;

create or replace function public.is_officer()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_role() = 'officer', false);
$$;

create or replace function public.can_write_records()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_role() in ('admin', 'officer'), false);
$$;

create table if not exists public.firs (
  id uuid primary key default gen_random_uuid(),
  fir_number text not null unique,
  title text not null,
  description text not null,
  incident_date timestamptz not null,
  location text not null,
  complainant_name text not null,
  status public.fir_status not null default 'pending',
  assigned_officer_id uuid,
  created_by uuid,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint firs_assigned_officer_id_fkey
    foreign key (assigned_officer_id) references public.user_profiles (id) on delete set null,
  constraint firs_created_by_fkey
    foreign key (created_by) references public.user_profiles (id) on delete set null
);

create table if not exists public.criminal_records (
  id uuid primary key default gen_random_uuid(),
  suspect_name text not null,
  national_id text not null,
  offense_summary text not null,
  status public.criminal_record_status not null default 'pending',
  version integer not null default 1,
  last_reviewed_by uuid,
  created_by uuid,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint criminal_records_last_reviewed_by_fkey
    foreign key (last_reviewed_by) references public.user_profiles (id) on delete set null,
  constraint criminal_records_created_by_fkey
    foreign key (created_by) references public.user_profiles (id) on delete set null
);

create table if not exists public.criminal_record_versions (
  id uuid primary key default gen_random_uuid(),
  criminal_record_id uuid not null references public.criminal_records (id) on delete cascade,
  version integer not null,
  snapshot jsonb not null,
  decision text,
  note text,
  changed_by uuid references public.user_profiles (id) on delete set null,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.cases (
  id uuid primary key default gen_random_uuid(),
  case_number text not null unique,
  fir_id uuid,
  title text not null,
  summary text not null,
  priority public.case_priority not null default 'medium',
  status public.case_status not null default 'open',
  lead_officer_id uuid,
  created_by uuid,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint cases_fir_id_fkey
    foreign key (fir_id) references public.firs (id) on delete set null,
  constraint cases_lead_officer_id_fkey
    foreign key (lead_officer_id) references public.user_profiles (id) on delete set null,
  constraint cases_created_by_fkey
    foreign key (created_by) references public.user_profiles (id) on delete set null
);

create table if not exists public.case_notes (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases (id) on delete cascade,
  note text not null,
  created_by uuid references public.user_profiles (id) on delete set null,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.audit_logs (
  id bigint generated always as identity primary key,
  actor_id uuid references public.user_profiles (id) on delete set null,
  entity_type text not null,
  entity_id uuid,
  action text not null,
  details jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_user_profiles_role on public.user_profiles (role);
create index if not exists idx_user_profiles_is_active on public.user_profiles (is_active);
create index if not exists idx_firs_status on public.firs (status);
create index if not exists idx_firs_assigned_officer_id on public.firs (assigned_officer_id);
create index if not exists idx_criminal_records_status on public.criminal_records (status);
create index if not exists idx_cases_status on public.cases (status);
create index if not exists idx_cases_priority on public.cases (priority);
create index if not exists idx_case_notes_case_id on public.case_notes (case_id);
create index if not exists idx_audit_logs_entity_type on public.audit_logs (entity_type);
create index if not exists idx_audit_logs_created_at on public.audit_logs (created_at desc);

create trigger set_user_profiles_updated_at
before update on public.user_profiles
for each row
execute function public.set_updated_at();

create trigger set_firs_updated_at
before update on public.firs
for each row
execute function public.set_updated_at();

create trigger set_criminal_records_updated_at
before update on public.criminal_records
for each row
execute function public.set_updated_at();

create trigger set_cases_updated_at
before update on public.cases
for each row
execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_profiles (id, email, full_name)
  values (
    new.id,
    coalesce(new.email, new.raw_user_meta_data ->> 'email', ''),
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      initcap(replace(split_part(coalesce(new.email, 'user'), '@', 1), '.', ' '))
    )
  )
  on conflict (id) do update
    set email = excluded.email;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

create or replace function public.capture_criminal_record_version()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.criminal_record_versions (
    criminal_record_id,
    version,
    snapshot,
    decision,
    changed_by
  )
  values (
    new.id,
    new.version,
    to_jsonb(new),
    new.status,
    auth.uid()
  );

  return new;
end;
$$;

drop trigger if exists after_criminal_record_insert on public.criminal_records;
create trigger after_criminal_record_insert
after insert on public.criminal_records
for each row
execute function public.capture_criminal_record_version();

drop trigger if exists after_criminal_record_update on public.criminal_records;
create trigger after_criminal_record_update
after update on public.criminal_records
for each row
execute function public.capture_criminal_record_version();

create or replace function public.log_audit_event()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  target_id uuid;
  payload jsonb;
begin
  if tg_op = 'DELETE' then
    target_id := old.id;
    payload := to_jsonb(old);
  else
    target_id := new.id;
    payload := to_jsonb(new);
  end if;

  insert into public.audit_logs (actor_id, entity_type, entity_id, action, details)
  values (
    auth.uid(),
    tg_table_name,
    target_id,
    lower(tg_op),
    payload
  );

  return coalesce(new, old);
end;
$$;

drop trigger if exists audit_user_profiles_changes on public.user_profiles;
create trigger audit_user_profiles_changes
after update on public.user_profiles
for each row
execute function public.log_audit_event();

drop trigger if exists audit_firs_changes on public.firs;
create trigger audit_firs_changes
after insert or update or delete on public.firs
for each row
execute function public.log_audit_event();

drop trigger if exists audit_criminal_records_changes on public.criminal_records;
create trigger audit_criminal_records_changes
after insert or update or delete on public.criminal_records
for each row
execute function public.log_audit_event();

drop trigger if exists audit_cases_changes on public.cases;
create trigger audit_cases_changes
after insert or update or delete on public.cases
for each row
execute function public.log_audit_event();

drop trigger if exists audit_case_notes_changes on public.case_notes;
create trigger audit_case_notes_changes
after insert or update or delete on public.case_notes
for each row
execute function public.log_audit_event();

alter table public.user_profiles enable row level security;
alter table public.firs enable row level security;
alter table public.criminal_records enable row level security;
alter table public.criminal_record_versions enable row level security;
alter table public.cases enable row level security;
alter table public.case_notes enable row level security;
alter table public.audit_logs enable row level security;

drop policy if exists "Profiles are readable by authenticated users" on public.user_profiles;
create policy "Profiles are readable by authenticated users"
on public.user_profiles
for select
to authenticated
using (true);

drop policy if exists "Admins can update profiles" on public.user_profiles;
create policy "Admins can update profiles"
on public.user_profiles
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Authenticated users can view FIRs" on public.firs;
create policy "Authenticated users can view FIRs"
on public.firs
for select
to authenticated
using (true);

drop policy if exists "Admins and officers can insert FIRs" on public.firs;
create policy "Admins and officers can insert FIRs"
on public.firs
for insert
to authenticated
with check (public.can_write_records());

drop policy if exists "Admins or assigned staff can update FIRs" on public.firs;
create policy "Admins or assigned staff can update FIRs"
on public.firs
for update
to authenticated
using (
  public.is_admin()
  or assigned_officer_id = auth.uid()
  or created_by = auth.uid()
)
with check (
  public.is_admin()
  or assigned_officer_id = auth.uid()
  or created_by = auth.uid()
);

drop policy if exists "Admins can delete FIRs" on public.firs;
create policy "Admins can delete FIRs"
on public.firs
for delete
to authenticated
using (public.is_admin());

drop policy if exists "Authenticated users can view criminal records" on public.criminal_records;
create policy "Authenticated users can view criminal records"
on public.criminal_records
for select
to authenticated
using (true);

drop policy if exists "Admins and officers can insert criminal records" on public.criminal_records;
create policy "Admins and officers can insert criminal records"
on public.criminal_records
for insert
to authenticated
with check (public.can_write_records());

drop policy if exists "Admins and owning officers can update criminal records" on public.criminal_records;
create policy "Admins and owning officers can update criminal records"
on public.criminal_records
for update
to authenticated
using (
  public.is_admin()
  or (public.is_officer() and created_by = auth.uid())
)
with check (
  public.is_admin()
  or (public.is_officer() and created_by = auth.uid())
);

drop policy if exists "Admins can delete criminal records" on public.criminal_records;
create policy "Admins can delete criminal records"
on public.criminal_records
for delete
to authenticated
using (public.is_admin());

drop policy if exists "Authenticated users can view criminal record versions" on public.criminal_record_versions;
create policy "Authenticated users can view criminal record versions"
on public.criminal_record_versions
for select
to authenticated
using (true);

drop policy if exists "Authenticated users can view cases" on public.cases;
create policy "Authenticated users can view cases"
on public.cases
for select
to authenticated
using (true);

drop policy if exists "Admins and officers can insert cases" on public.cases;
create policy "Admins and officers can insert cases"
on public.cases
for insert
to authenticated
with check (public.can_write_records());

drop policy if exists "Admins and assigned staff can update cases" on public.cases;
create policy "Admins and assigned staff can update cases"
on public.cases
for update
to authenticated
using (
  public.is_admin()
  or lead_officer_id = auth.uid()
  or created_by = auth.uid()
)
with check (
  public.is_admin()
  or lead_officer_id = auth.uid()
  or created_by = auth.uid()
);

drop policy if exists "Admins can delete cases" on public.cases;
create policy "Admins can delete cases"
on public.cases
for delete
to authenticated
using (public.is_admin());

drop policy if exists "Authenticated users can view case notes" on public.case_notes;
create policy "Authenticated users can view case notes"
on public.case_notes
for select
to authenticated
using (true);

drop policy if exists "Admins and officers can insert case notes" on public.case_notes;
create policy "Admins and officers can insert case notes"
on public.case_notes
for insert
to authenticated
with check (public.can_write_records());

drop policy if exists "Admins or authors can update case notes" on public.case_notes;
create policy "Admins or authors can update case notes"
on public.case_notes
for update
to authenticated
using (public.is_admin() or created_by = auth.uid())
with check (public.is_admin() or created_by = auth.uid());

drop policy if exists "Admins or authors can delete case notes" on public.case_notes;
create policy "Admins or authors can delete case notes"
on public.case_notes
for delete
to authenticated
using (public.is_admin() or created_by = auth.uid());

drop policy if exists "Admins and officers can view audit logs" on public.audit_logs;
create policy "Admins and officers can view audit logs"
on public.audit_logs
for select
to authenticated
using (public.current_role() in ('admin', 'officer'));

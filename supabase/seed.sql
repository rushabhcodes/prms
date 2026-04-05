-- PRMS seed data
-- Run this only after:
-- 1. executing supabase/schema.sql
-- 2. creating these users in Supabase Auth:
--    admin@department.gov
--    officer@department.gov
--    viewer@department.gov

update public.user_profiles
set
  full_name = 'Commissioner Aditi Rao',
  role = 'admin',
  badge_number = 'ADM-001',
  station_name = 'Central Command',
  is_active = true
where email = 'admin@department.gov';

update public.user_profiles
set
  full_name = 'Inspector Rahul Mehta',
  role = 'officer',
  badge_number = 'OFF-219',
  station_name = 'North Precinct',
  is_active = true
where email = 'officer@department.gov';

update public.user_profiles
set
  full_name = 'Analyst Sana Khan',
  role = 'viewer',
  badge_number = 'VWR-044',
  station_name = 'Data & Records Unit',
  is_active = true
where email = 'viewer@department.gov';

with seed_users as (
  select
    (select id from public.user_profiles where email = 'admin@department.gov' limit 1) as admin_id,
    (select id from public.user_profiles where email = 'officer@department.gov' limit 1) as officer_id,
    (select id from public.user_profiles where email = 'viewer@department.gov' limit 1) as viewer_id
)
insert into public.firs (
  fir_number,
  title,
  description,
  incident_date,
  location,
  complainant_name,
  status,
  assigned_officer_id,
  created_by
)
select *
from (
  select
    'FIR-2026-0012',
    'Warehouse break-in',
    'Unauthorized night entry with missing high-value electronics.',
    '2026-03-29T18:30:00Z'::timestamptz,
    'Dockyard Road, Mumbai',
    'Karan Patel',
    'under_investigation'::public.fir_status,
    officer_id,
    admin_id
  from seed_users

  union all

  select
    'FIR-2026-0017',
    'Cyber fraud complaint',
    'UPI fraud involving mule accounts and cloned support calls.',
    '2026-04-01T07:15:00Z'::timestamptz,
    'Andheri East, Mumbai',
    'Neha Singh',
    'pending'::public.fir_status,
    officer_id,
    officer_id
  from seed_users

  union all

  select
    'FIR-2026-0006',
    'Vehicle theft',
    'SUV theft reported from residential parking premises.',
    '2026-03-12T20:20:00Z'::timestamptz,
    'Powai, Mumbai',
    'Aman Verma',
    'closed'::public.fir_status,
    officer_id,
    officer_id
  from seed_users
) as rows_to_insert(
  fir_number,
  title,
  description,
  incident_date,
  location,
  complainant_name,
  status,
  assigned_officer_id,
  created_by
)
where not exists (
  select 1
  from public.firs existing
  where existing.fir_number = rows_to_insert.fir_number
);

with seed_users as (
  select
    (select id from public.user_profiles where email = 'admin@department.gov' limit 1) as admin_id,
    (select id from public.user_profiles where email = 'officer@department.gov' limit 1) as officer_id
)
insert into public.criminal_records (
  suspect_name,
  national_id,
  offense_summary,
  status,
  version,
  last_reviewed_by,
  created_by
)
select *
from (
  select
    'Rizwan Sheikh',
    'AADHAR-3381',
    'Repeat cyber extortion suspect with payment wallet linkage.',
    'pending'::public.criminal_record_status,
    1,
    null::uuid,
    officer_id
  from seed_users

  union all

  select
    'Arjun Nair',
    'AADHAR-7721',
    'Known fence in an organized vehicle dismantling ring.',
    'approved'::public.criminal_record_status,
    2,
    admin_id,
    officer_id
  from seed_users

  union all

  select
    'Pooja Menon',
    'AADHAR-9014',
    'Record rejected pending document mismatch verification.',
    'rejected'::public.criminal_record_status,
    2,
    admin_id,
    officer_id
  from seed_users
) as rows_to_insert(
  suspect_name,
  national_id,
  offense_summary,
  status,
  version,
  last_reviewed_by,
  created_by
)
where not exists (
  select 1
  from public.criminal_records existing
  where existing.national_id = rows_to_insert.national_id
);

with seed_users as (
  select
    (select id from public.user_profiles where email = 'admin@department.gov' limit 1) as admin_id,
    (select id from public.user_profiles where email = 'officer@department.gov' limit 1) as officer_id
),
fir_lookup as (
  select id, fir_number from public.firs
)
insert into public.cases (
  case_number,
  fir_id,
  title,
  summary,
  priority,
  status,
  lead_officer_id,
  created_by
)
select *
from (
  select
    'CASE-2026-045',
    (select id from fir_lookup where fir_number = 'FIR-2026-0012'),
    'Dockyard burglary taskforce',
    'Coordinate CCTV review and vendor interview schedule.',
    'high'::public.case_priority,
    'in_progress'::public.case_status,
    officer_id,
    admin_id
  from seed_users

  union all

  select
    'CASE-2026-051',
    (select id from fir_lookup where fir_number = 'FIR-2026-0017'),
    'UPI fraud escalation',
    'Freeze linked beneficiary accounts and request telecom metadata.',
    'high'::public.case_priority,
    'pending_review'::public.case_status,
    officer_id,
    officer_id
  from seed_users

  union all

  select
    'CASE-2026-022',
    (select id from fir_lookup where fir_number = 'FIR-2026-0006'),
    'Recovered vehicle closure',
    'Insurance release and final closure memo coordination.',
    'medium'::public.case_priority,
    'closed'::public.case_status,
    officer_id,
    officer_id
  from seed_users
) as rows_to_insert(
  case_number,
  fir_id,
  title,
  summary,
  priority,
  status,
  lead_officer_id,
  created_by
)
where not exists (
  select 1
  from public.cases existing
  where existing.case_number = rows_to_insert.case_number
);

with seed_users as (
  select
    (select id from public.user_profiles where email = 'admin@department.gov' limit 1) as admin_id,
    (select id from public.user_profiles where email = 'officer@department.gov' limit 1) as officer_id
),
case_lookup as (
  select id, case_number from public.cases
)
insert into public.case_notes (case_id, note, created_by)
select *
from (
  select
    (select id from case_lookup where case_number = 'CASE-2026-045'),
    'Assigned two field teams to collect CCTV footage from the warehouse perimeter.',
    officer_id
  from seed_users

  union all

  select
    (select id from case_lookup where case_number = 'CASE-2026-051'),
    'Requested telecom metadata and flagged linked beneficiary accounts for review.',
    officer_id
  from seed_users

  union all

  select
    (select id from case_lookup where case_number = 'CASE-2026-022'),
    'Closure memo prepared and shared with the insurance liaison desk.',
    admin_id
  from seed_users
) as rows_to_insert(case_id, note, created_by)
where not exists (
  select 1
  from public.case_notes existing
  where existing.note = rows_to_insert.note
);

-- PRMS expanded sample data
-- Run this after:
-- 1. executing supabase/schema.sql
-- 2. creating the Auth users from supabase/seed.sql prerequisites
-- 3. optionally running supabase/seed.sql for the starter dataset
--
-- This file adds a larger working dataset for dashboards, tables, and filters.
-- It is idempotent: rerunning it should not duplicate records.

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
    'FIR-2026-0021',
    'Armed robbery at fuel station',
    'Masked suspects stole cash receipts and fled on two motorcycles.',
    '2026-04-02T21:10:00Z'::timestamptz,
    'Link Road, Andheri West, Mumbai',
    'Mahesh Yadav',
    'under_investigation'::public.fir_status,
    officer_id,
    admin_id
  from seed_users

  union all

  select
    'FIR-2026-0024',
    'Missing person alert',
    'College student reported missing after last contact near a transit hub.',
    '2026-04-03T05:40:00Z'::timestamptz,
    'Kurla Terminus, Mumbai',
    'Farah Ali',
    'pending'::public.fir_status,
    officer_id,
    officer_id
  from seed_users

  union all

  select
    'FIR-2026-0028',
    'Jewelry store burglary',
    'Rear shutter forced open with selective theft of diamond inventory.',
    '2026-04-04T00:25:00Z'::timestamptz,
    'Zaveri Bazaar, Mumbai',
    'Devika Shah',
    'under_investigation'::public.fir_status,
    officer_id,
    admin_id
  from seed_users

  union all

  select
    'FIR-2026-0032',
    'Illegal firearm seizure',
    'Patrol stop led to the recovery of an unlicensed handgun and rounds.',
    '2026-04-04T18:05:00Z'::timestamptz,
    'Sion Circle, Mumbai',
    'Constable field report',
    'closed'::public.fir_status,
    officer_id,
    officer_id
  from seed_users

  union all

  select
    'FIR-2026-0037',
    'Extortion call complaint',
    'Business owner received repeated payment threats from unidentified callers.',
    '2026-04-05T10:15:00Z'::timestamptz,
    'Bandra East, Mumbai',
    'Rohit Malhotra',
    'pending'::public.fir_status,
    officer_id,
    admin_id
  from seed_users

  union all

  select
    'FIR-2026-0041',
    'Document forgery racket',
    'Counterfeit property records discovered during registry verification.',
    '2026-04-05T13:20:00Z'::timestamptz,
    'Fort, Mumbai',
    'Nisha Deshmukh',
    'draft'::public.fir_status,
    officer_id,
    officer_id
  from seed_users

  union all

  select
    'FIR-2026-0044',
    'Nightclub assault complaint',
    'Victim reported assault by multiple unidentified individuals outside venue.',
    '2026-04-05T23:55:00Z'::timestamptz,
    'Lower Parel, Mumbai',
    'Ishaan Sethi',
    'under_investigation'::public.fir_status,
    officer_id,
    officer_id
  from seed_users

  union all

  select
    'FIR-2026-0049',
    'Cargo tampering report',
    'Warehouse seals were broken and export inventory counts did not match manifests.',
    '2026-04-06T02:35:00Z'::timestamptz,
    'Nhava Sheva logistics yard',
    'Priya Chouhan',
    'pending'::public.fir_status,
    officer_id,
    admin_id
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
    'Sameer Kulkarni',
    'AADHAR-1042',
    'Suspected coordinator for forged property record submissions.',
    'pending'::public.criminal_record_status,
    1,
    null::uuid,
    officer_id
  from seed_users

  union all

  select
    'Leena Thomas',
    'AADHAR-1187',
    'Named in a financial mule account network supporting UPI fraud cases.',
    'approved'::public.criminal_record_status,
    2,
    admin_id,
    officer_id
  from seed_users

  union all

  select
    'Danish Khan',
    'AADHAR-1215',
    'Linked to repeated fuel station robbery surveillance near escape routes.',
    'pending'::public.criminal_record_status,
    1,
    null::uuid,
    officer_id
  from seed_users

  union all

  select
    'Mitali Ghosh',
    'AADHAR-1308',
    'Rejected record after biometric mismatch during custody verification.',
    'rejected'::public.criminal_record_status,
    2,
    admin_id,
    officer_id
  from seed_users

  union all

  select
    'Prakash Jadhav',
    'AADHAR-1451',
    'Repeat offender flagged in cross-precinct assault complaints.',
    'approved'::public.criminal_record_status,
    3,
    admin_id,
    officer_id
  from seed_users

  union all

  select
    'Yusuf Contractor',
    'AADHAR-1594',
    'Under review for cargo tampering and forged customs release documents.',
    'pending'::public.criminal_record_status,
    1,
    null::uuid,
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
    'CASE-2026-061',
    (select id from fir_lookup where fir_number = 'FIR-2026-0021'),
    'Fuel station robbery pursuit',
    'Collect highway camera footage and compare seized motorcycle parts records.',
    'high'::public.case_priority,
    'in_progress'::public.case_status,
    officer_id,
    admin_id
  from seed_users

  union all

  select
    'CASE-2026-064',
    (select id from fir_lookup where fir_number = 'FIR-2026-0024'),
    'Missing student search grid',
    'Coordinate transport CCTV pulls and witness canvassing at transit exits.',
    'high'::public.case_priority,
    'open'::public.case_status,
    officer_id,
    officer_id
  from seed_users

  union all

  select
    'CASE-2026-068',
    (select id from fir_lookup where fir_number = 'FIR-2026-0028'),
    'Jewelry inventory theft review',
    'Verify insider access logs and reconcile after-hours stock movement.',
    'high'::public.case_priority,
    'pending_review'::public.case_status,
    officer_id,
    admin_id
  from seed_users

  union all

  select
    'CASE-2026-072',
    (select id from fir_lookup where fir_number = 'FIR-2026-0032'),
    'Firearm seizure closure pack',
    'Complete ballistic filing and prosecution handover bundle.',
    'medium'::public.case_priority,
    'closed'::public.case_status,
    officer_id,
    officer_id
  from seed_users

  union all

  select
    'CASE-2026-075',
    (select id from fir_lookup where fir_number = 'FIR-2026-0037'),
    'Extortion telecom trace',
    'Map call routing, payment demands, and related subscriber identities.',
    'high'::public.case_priority,
    'in_progress'::public.case_status,
    officer_id,
    admin_id
  from seed_users

  union all

  select
    'CASE-2026-079',
    (select id from fir_lookup where fir_number = 'FIR-2026-0041'),
    'Forgery registry sweep',
    'Cross-check deed serials and registrar entries with suspect submissions.',
    'medium'::public.case_priority,
    'open'::public.case_status,
    officer_id,
    officer_id
  from seed_users

  union all

  select
    'CASE-2026-083',
    (select id from fir_lookup where fir_number = 'FIR-2026-0044'),
    'Nightclub assault identification',
    'Review venue footage and identify involved groups from entry logs.',
    'medium'::public.case_priority,
    'in_progress'::public.case_status,
    officer_id,
    officer_id
  from seed_users

  union all

  select
    'CASE-2026-088',
    (select id from fir_lookup where fir_number = 'FIR-2026-0049'),
    'Cargo tampering customs review',
    'Match broken seal reports with customs declarations and dispatch roster.',
    'high'::public.case_priority,
    'pending_review'::public.case_status,
    officer_id,
    admin_id
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
    (select id from case_lookup where case_number = 'CASE-2026-061'),
    'Fuel station staff statements collected and nearby toll booth footage requisitioned.',
    officer_id
  from seed_users

  union all

  select
    (select id from case_lookup where case_number = 'CASE-2026-061'),
    'Recovered bike parts from a scrap dealer match one eyewitness description.',
    admin_id
  from seed_users

  union all

  select
    (select id from case_lookup where case_number = 'CASE-2026-064'),
    'Transit card usage from the missing person timeline has been requested.',
    officer_id
  from seed_users

  union all

  select
    (select id from case_lookup where case_number = 'CASE-2026-068'),
    'Inventory manager and night shift guard scheduled for re-interview.',
    officer_id
  from seed_users

  union all

  select
    (select id from case_lookup where case_number = 'CASE-2026-072'),
    'Ballistics acknowledgement received from the forensic lab desk.',
    admin_id
  from seed_users

  union all

  select
    (select id from case_lookup where case_number = 'CASE-2026-075'),
    'Two extortion numbers now linked to dormant SIM cards activated last month.',
    officer_id
  from seed_users

  union all

  select
    (select id from case_lookup where case_number = 'CASE-2026-079'),
    'Registrar office sent scanned ledgers for the last eight suspect filings.',
    officer_id
  from seed_users

  union all

  select
    (select id from case_lookup where case_number = 'CASE-2026-083'),
    'Venue access logs narrowed the suspect pool to six patrons.',
    officer_id
  from seed_users

  union all

  select
    (select id from case_lookup where case_number = 'CASE-2026-088'),
    'Seal numbers from cargo manifests do not match customs release paperwork.',
    admin_id
  from seed_users

  union all

  select
    (select id from case_lookup where case_number = 'CASE-2026-088'),
    'Dispatch supervisor interview scheduled after discrepancy escalation.',
    officer_id
  from seed_users
) as rows_to_insert(case_id, note, created_by)
where rows_to_insert.case_id is not null
  and not exists (
    select 1
    from public.case_notes existing
    where existing.case_id = rows_to_insert.case_id
      and existing.note = rows_to_insert.note
  );

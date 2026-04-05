select count(*) as total_firs from public.firs;
select count(*) as total_cases from public.cases;
select count(*) as pending_approvals from public.criminal_records where status = 'pending';
select count(*) as active_officers from public.user_profiles where role = 'officer' and is_active = true;

select
  f.fir_number,
  f.status,
  f.title,
  u.full_name as assigned_officer
from public.firs f
left join public.user_profiles u on u.id = f.assigned_officer_id
order by f.created_at desc;

select
  c.id,
  c.suspect_name,
  c.status,
  c.version,
  reviewer.full_name as last_reviewed_by
from public.criminal_records c
left join public.user_profiles reviewer on reviewer.id = c.last_reviewed_by
order by c.updated_at desc;

select
  cs.case_number,
  cs.priority,
  cs.status,
  lead.full_name as lead_officer,
  count(notes.id) as notes_count
from public.cases cs
left join public.user_profiles lead on lead.id = cs.lead_officer_id
left join public.case_notes notes on notes.case_id = cs.id
group by cs.id, lead.full_name
order by cs.created_at desc;

select
  a.created_at,
  coalesce(u.full_name, 'System') as actor_name,
  a.entity_type,
  a.action,
  a.details
from public.audit_logs a
left join public.user_profiles u on u.id = a.actor_id
order by a.created_at desc
limit 100;

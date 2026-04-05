# Police Record Management System

A production-oriented PRMS built with Next.js App Router, TypeScript, Tailwind CSS, shadcn-style UI components, and Supabase Auth/PostgreSQL.

## Stack

- Next.js 16 App Router
- TypeScript
- Tailwind CSS v4
- shadcn/ui-style component layer
- Supabase Auth + PostgreSQL
- Server Actions and `proxy.ts` route protection

## Features

- Role-based access control for `admin`, `officer`, and `viewer`
- Supabase email/password login
- Protected routes using `proxy.ts`
- Dashboard metrics for FIRs, cases, approvals, and active officers
- User profile admin screen with role updates and active-status toggles
- FIR management with modal creation flow
- Criminal record approval workflow with version history support
- Case tracking with note dialog
- Searchable audit logs
- Demo mode when Supabase env vars are missing

## Folder Structure

```text
app/
  (auth)/login/
  (app)/
    audit-logs/
    cases/
    criminal-records/
    dashboard/
    firs/
    users/
  actions/
components/
  dashboard/
  layout/
  prms/
  ui/
lib/
  auth/
  data/
  supabase/
  types/
  validations/
supabase/
  seed-more.sql
  seed.sql
  queries.sql
  schema.sql
proxy.ts
components.json
```

## Setup

1. Install dependencies.

```bash
npm install
```

2. Copy the env template and add your Supabase project values.

```bash
cp .env.example .env.local
```

3. In Supabase SQL Editor, run `supabase/schema.sql`.

4. Create users in Supabase Auth.
   Add `full_name` in `raw_user_meta_data` if you want the trigger to seed a friendly display name.

5. Option A: promote roles manually in `public.user_profiles`.

```sql
update public.user_profiles
set role = 'admin', badge_number = 'ADM-001', station_name = 'Central Command'
where email = 'admin@department.gov';
```

6. Option B: create these three Auth users first, then run `supabase/seed.sql` to assign roles and load sample records:

- `admin@department.gov`
- `officer@department.gov`
- `viewer@department.gov`

7. Optional: run `supabase/seed-more.sql` after `supabase/seed.sql` if you want a denser dataset for dashboard cards, table pagination, filters, and role testing.

8. Start the app.

```bash
npm run dev
```

## Demo Mode

If `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are missing, the app runs in demo mode with sample data.

- `admin@prms.local`
- `officer@prms.local`
- `viewer@prms.local`
- Password: `password123`

## SQL and RLS Notes

`supabase/schema.sql` includes:

- Full table schema
- Relationships between users, FIRs, cases, criminal records, notes, and audit logs
- RLS policies for admin/officer/viewer behavior
- Auth trigger for auto-creating `user_profiles`
- Audit log triggers
- Criminal record version capture triggers

`supabase/queries.sql` includes example reporting queries for dashboard and admin use.

`supabase/seed.sql` includes starter users, FIRs, criminal records, cases, and case notes for local/demo setup against a real Supabase project.

`supabase/seed-more.sql` adds a larger idempotent sample dataset on top of the starter seed without duplicating existing records.

## shadcn/ui Integration

- `components.json` is configured for project aliases
- reusable primitives live in `components/ui`
- `cn()` utility lives in `lib/utils.ts`
- layout and feature components are composed from those shared primitives

## Key App Paths

- `/login`
- `/dashboard`
- `/firs`
- `/criminal-records`
- `/cases`
- `/users`
- `/audit-logs`

## Verification

Run:

```bash
npm run lint
npm run build
```

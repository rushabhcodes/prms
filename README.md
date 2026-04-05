# Police Record Management System

A production-oriented Police Record Management System (PRMS) built with Next.js App Router, TypeScript, Tailwind CSS, shadcn-style UI components, and Supabase Auth/PostgreSQL.

This project is designed as an internal operations console for police administration and investigative teams. It supports role-based access control, FIR workflows, case tracking, criminal-record review, audit visibility, record drill-down pages, theme switching, and light/dark mode.

## Highlights

- Next.js 16 App Router with protected route groups
- TypeScript across app, actions, validation, and data access
- Supabase Auth for login/session handling
- PostgreSQL + RLS as the primary authorization boundary
- Admin / Officer / Viewer role model
- shadcn-style reusable UI layer
- FIR, case, and criminal-record detail pages
- Criminal record version history
- Case-note create/edit/delete flows on detail pages
- Dashboard cards, metrics, and linked drill-down navigation
- Theme picker plus separate dark-mode toggle
- Demo mode fallback when Supabase env vars are missing

## Stack

- Next.js `16.2.2`
- React `19`
- TypeScript
- Tailwind CSS `v4`
- shadcn-style component architecture
- Supabase Auth + PostgreSQL
- Radix UI primitives
- Zod validation
- Server Actions
- `proxy.ts` route protection

## Roles And Access

The app uses three roles:

- `admin`
  - manage users
  - full CRUD-style operational access
  - approve/reject criminal records
  - view audit logs
- `officer`
  - create and update operational records allowed by RLS
  - manage case notes
  - update records they own or are assigned to where policy allows
  - view audit logs
- `viewer`
  - read-only access to operational data

Application role helpers live in [access.ts](/home/rushabh/Dev/prms/lib/auth/access.ts).

## Core Modules

### Authentication

- Supabase email/password login
- Session handling through Supabase SSR helpers
- Protected route enforcement in [proxy.ts](/home/rushabh/Dev/prms/proxy.ts)
- Redirects for authenticated and unauthenticated users

### Dashboard

- Operational overview cards
- Recent FIR activity
- Pending criminal reviews
- Case pressure snapshot
- Direct links into record detail pages

### FIR Management

- FIR list
- Create FIR dialog
- Status update flow
- FIR detail page
- Edit FIR details from the detail page
- Linked cases and timeline view

### Case Tracking

- Case list
- Add note flow from list view
- Case detail page
- Edit case details from the detail page
- Case-note create/edit/delete on the detail page
- Linked FIR breadcrumb trail

### Criminal Records

- List with status and version visibility
- Admin approval/rejection workflow
- Criminal-record detail page
- Version history timeline
- Officer/admin edit flow that creates a new version and returns the record to `pending`

### User Administration

- Admin-only user table
- Role updates
- Active status toggle

### Audit Logs

- Searchable audit list
- Admin/officer visibility

## UX Features

- Sidebar dashboard shell
- Responsive topbar
- Record breadcrumbs
- Empty states
- Toast notifications
- Loading states
- Theme selector
- Separate dark-mode toggle

## Routes

### Public

- `/`
- `/login`

### Protected

- `/dashboard`
- `/firs`
- `/firs/[firNumber]`
- `/cases`
- `/cases/[caseNumber]`
- `/criminal-records`
- `/criminal-records/[recordId]`
- `/users`
- `/audit-logs`

## Project Structure

```text
app/
  (auth)/
    login/
  (app)/
    audit-logs/
    cases/
      [caseNumber]/
    criminal-records/
      [recordId]/
    dashboard/
    firs/
      [firNumber]/
    users/
  actions/
components/
  dashboard/
  layout/
  prms/
  theme/
  ui/
lib/
  auth/
  data/
  supabase/
  types/
  validations/
supabase/
  schema.sql
  queries.sql
  seed.sql
  seed-more.sql
proxy.ts
```

## Important Files

### App Shell And Routing

- [app/layout.tsx](/home/rushabh/Dev/prms/app/layout.tsx)
- [app/page.tsx](/home/rushabh/Dev/prms/app/page.tsx)
- [app/(app)/layout.tsx](/home/rushabh/Dev/prms/app/(app)/layout.tsx)
- [proxy.ts](/home/rushabh/Dev/prms/proxy.ts)

### Data And Auth

- [lib/auth/session.ts](/home/rushabh/Dev/prms/lib/auth/session.ts)
- [lib/auth/access.ts](/home/rushabh/Dev/prms/lib/auth/access.ts)
- [lib/data/queries.ts](/home/rushabh/Dev/prms/lib/data/queries.ts)
- [lib/data/mock-prms.ts](/home/rushabh/Dev/prms/lib/data/mock-prms.ts)
- [lib/supabase/server.ts](/home/rushabh/Dev/prms/lib/supabase/server.ts)
- [lib/supabase/browser.ts](/home/rushabh/Dev/prms/lib/supabase/browser.ts)
- [lib/supabase/proxy.ts](/home/rushabh/Dev/prms/lib/supabase/proxy.ts)
- [lib/supabase/env.ts](/home/rushabh/Dev/prms/lib/supabase/env.ts)

### SQL

- [supabase/schema.sql](/home/rushabh/Dev/prms/supabase/schema.sql)
- [supabase/queries.sql](/home/rushabh/Dev/prms/supabase/queries.sql)
- [supabase/seed.sql](/home/rushabh/Dev/prms/supabase/seed.sql)
- [supabase/seed-more.sql](/home/rushabh/Dev/prms/supabase/seed-more.sql)

## Setup Guide

## 1. Install Dependencies

```bash
npm install
```

## 2. Configure Environment Variables

Copy the template:

```bash
cp .env.example .env.local
```

Supported public env keys:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=
```

The app requires:

- `NEXT_PUBLIC_SUPABASE_URL`
- one of:
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`

Env resolution logic lives in [env.ts](/home/rushabh/Dev/prms/lib/supabase/env.ts).

## 3. Create A Supabase Project

In Supabase:

1. Create a new project
2. Copy the project URL
3. Copy the anon/publishable key
4. Put them in `.env.local`

## 4. Run The Schema

Open your Supabase project dashboard, then:

1. Go to `SQL Editor`
2. Open [schema.sql](/home/rushabh/Dev/prms/supabase/schema.sql)
3. Copy the entire file
4. Paste into a new SQL query
5. Run it

This creates:

- enum types
- tables
- triggers
- indexes
- helper functions
- audit logging
- criminal record version capture
- row level security policies

## 5. Create Auth Users

Create users in `Authentication > Users`.

Recommended starter users:

- `admin@department.gov`
- `officer@department.gov`
- `viewer@department.gov`

You can add `full_name` in `raw_user_meta_data`, but it is optional because the trigger creates fallback profile names.

## 6. Seed Starter Data

Run [seed.sql](/home/rushabh/Dev/prms/supabase/seed.sql) in Supabase SQL Editor after the Auth users exist.

This does all of the following:

- assigns roles
- sets badge numbers
- sets station names
- inserts starter FIRs
- inserts criminal records
- inserts cases
- inserts case notes

## 7. Seed Extra Demo Data

Run [seed-more.sql](/home/rushabh/Dev/prms/supabase/seed-more.sql) if you want a denser environment for dashboards, testing, filters, and navigation.

This file is idempotent and safe to rerun.

## 8. Start The App

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## 9. Sign In

Use one of the Supabase Auth users you created.

## First-Time Supabase Walkthrough

If you want the quickest end-to-end setup:

1. `npm install`
2. `cp .env.example .env.local`
3. add your Supabase URL and anon/publishable key
4. run [schema.sql](/home/rushabh/Dev/prms/supabase/schema.sql) in Supabase SQL Editor
5. create the three Auth users
6. run [seed.sql](/home/rushabh/Dev/prms/supabase/seed.sql)
7. optionally run [seed-more.sql](/home/rushabh/Dev/prms/supabase/seed-more.sql)
8. run `npm run dev`

## Demo Mode

If Supabase env vars are missing, the app runs in demo mode using mocked data.

Demo accounts:

- `admin@prms.local`
- `officer@prms.local`
- `viewer@prms.local`

Password for all demo accounts:

```text
password123
```

Demo mode is useful for:

- UI development
- local exploration
- navigation testing
- layout work

Demo mode does not persist writes.

## Database Design

Main tables:

- `public.user_profiles`
- `public.firs`
- `public.criminal_records`
- `public.criminal_record_versions`
- `public.cases`
- `public.case_notes`
- `public.audit_logs`

Relationships:

- `firs.assigned_officer_id -> user_profiles.id`
- `firs.created_by -> user_profiles.id`
- `criminal_records.created_by -> user_profiles.id`
- `criminal_records.last_reviewed_by -> user_profiles.id`
- `criminal_record_versions.criminal_record_id -> criminal_records.id`
- `criminal_record_versions.changed_by -> user_profiles.id`
- `cases.fir_id -> firs.id`
- `cases.lead_officer_id -> user_profiles.id`
- `cases.created_by -> user_profiles.id`
- `case_notes.case_id -> cases.id`
- `case_notes.created_by -> user_profiles.id`
- `audit_logs.actor_id -> user_profiles.id`

## RLS Summary

The SQL policies in [schema.sql](/home/rushabh/Dev/prms/supabase/schema.sql) enforce the core role behavior.

High-level policy model:

- Admin
  - full access to managed data
  - user management
  - criminal record review
- Officer
  - write access for operational records allowed by ownership/assignment
  - case-note creation
  - audit log visibility
- Viewer
  - read-only access

Examples:

- FIR updates are allowed for admins, assignees, or creators
- Case updates are allowed for admins, lead officers, or creators
- Criminal-record updates are allowed for admins or the officer who created the record
- Audit logs are visible to admins and officers

## Theming And Dark Mode

The app now supports:

- color theme switching
- independent dark/light mode switching

Theme state lives in:

- [theme-provider.tsx](/home/rushabh/Dev/prms/components/theme/theme-provider.tsx)
- [themes.ts](/home/rushabh/Dev/prms/lib/themes.ts)
- [dark-mode-toggle.tsx](/home/rushabh/Dev/prms/components/theme/dark-mode-toggle.tsx)
- [theme-toggle.tsx](/home/rushabh/Dev/prms/components/theme/theme-toggle.tsx)

Available color themes:

- Command Teal
- Slate Grid
- Graphite Amber
- Civic Blue
- Emerald File
- Ruby Report
- Violet Ledger
- Sandstone Case

Both theme and mode are persisted in `localStorage`.

## Detail Pages

The app includes drill-down pages for all primary record types:

### FIR Detail Page

- route: `/firs/[firNumber]`
- linked cases
- activity timeline
- assignment metadata
- edit FIR flow

### Case Detail Page

- route: `/cases/[caseNumber]`
- linked FIR
- editable case notes
- activity timeline
- edit case flow

### Criminal Record Detail Page

- route: `/criminal-records/[recordId]`
- version history
- activity timeline
- review controls
- edit flow that creates a new version and returns the record to pending review

## Record Editing Rules

### FIR Editing

Available on the FIR detail page.

- edit allowed for admins, assignees, or creators
- reassignment intended for admins or creators

### Case Editing

Available on the case detail page.

- edit allowed for admins, lead officers, or creators
- lead reassignment intended for admins or creators

### Criminal Record Editing

Available on the criminal-record detail page.

- admins can edit
- officers can edit records they created
- saving increments the version
- saving resets status to `pending`
- saving clears `last_reviewed_by`

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm run start
```

Notes:

- the production build script uses `next build --webpack`
- this was chosen to avoid Turbopack instability observed in this workspace during CSS processing

## Verification

Recommended checks:

```bash
npm run lint
npm run build
```

## Suggested Role Test Checklist

### Admin

- can access `/users`
- can access `/audit-logs`
- can edit FIRs, cases, and criminal records
- can review pending criminal records
- can manage user roles and active states

### Officer

- can access FIR, case, and criminal-record pages
- can access `/audit-logs`
- can edit records permitted by RLS
- can manage their own allowed case notes
- cannot manage users
- cannot review criminal records unless promoted to admin

### Viewer

- can sign in and browse operational data
- cannot create/edit records
- cannot manage users
- cannot review criminal records
- cannot access audit logs

## shadcn/UI Notes

This repo uses a shadcn-style component system rather than a generated vendor dump.

Core conventions:

- shared primitives live in `components/ui`
- utility class merging uses `cn()` from [utils.ts](/home/rushabh/Dev/prms/lib/utils.ts)
- feature components live in `components/prms`
- layout components live in `components/layout`

## Troubleshooting

### `Missing Supabase environment variables`

Make sure `.env.local` has:

- `NEXT_PUBLIC_SUPABASE_URL`
- either `NEXT_PUBLIC_SUPABASE_ANON_KEY` or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`

### `relation "public.user_profiles" does not exist`

You likely ran a stale schema version earlier. Re-run the latest [schema.sql](/home/rushabh/Dev/prms/supabase/schema.sql).

### Seed file errors

Make sure:

1. schema is already applied
2. Auth users exist before running the seed
3. you are using the latest [seed.sql](/home/rushabh/Dev/prms/supabase/seed.sql) and [seed-more.sql](/home/rushabh/Dev/prms/supabase/seed-more.sql)

### Login works but role behavior is wrong

Check the `public.user_profiles` table and confirm:

- role is assigned correctly
- `is_active` is true for the user

### UI still shows old env/demo behavior

Restart the dev server after changing `.env.local`:

```bash
npm run dev
```

## Future Expansion Ideas

- global search
- export/print views
- evidence attachment metadata
- timeline filtering
- richer criminal-record version diffs
- linked audit-log navigation
- automated role-permission tests

## License

This repository currently has no explicit open-source license attached.

import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  FileText,
  FolderKanban,
  History,
  LockKeyhole,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";

import { DarkModeToggle } from "@/components/theme/dark-mode-toggle";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSessionContext } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

const statHighlights = [
  { value: "3", label: "Operational views", detail: "Admin, Officer, and Viewer experiences" },
  { value: "6", label: "Daily workflows", detail: "Intake, review, casework, and oversight" },
  { value: "1", label: "Shared command center", detail: "One workspace for the full record lifecycle" },
];

const moduleCards = [
  {
    title: "FIR intake",
    description:
      "Register incident details, assign officers, and move reports through a clean status workflow.",
    icon: FileText,
  },
  {
    title: "Case tracking",
    description:
      "Link FIRs to active case files, capture field notes, and keep progress visible across teams.",
    icon: FolderKanban,
  },
  {
    title: "Criminal record review",
    description:
      "Maintain versioned records with explicit approve and reject flows for controlled review.",
    icon: ClipboardList,
  },
  {
    title: "Audit visibility",
    description:
      "Trace changes, reviews, and record activity without stitching together logs by hand.",
    icon: History,
  },
  {
    title: "Role-based access",
    description:
      "Expose the right controls to admins, officers, and viewers without leaking elevated actions.",
    icon: Users,
  },
  {
    title: "Search-ready workspace",
    description:
      "Navigate from dashboards into FIR, case, and criminal-record detail pages with clear drill-down paths.",
    icon: Search,
  },
];

const workflowSteps = [
  {
    label: "Capture",
    title: "Open a record fast",
    description:
      "Intake starts with structured FIR and criminal-record forms instead of scattered spreadsheets.",
  },
  {
    label: "Review",
    title: "Keep approvals accountable",
    description:
      "Sensitive records move through explicit review states with version tracking and audit history.",
  },
  {
    label: "Operate",
    title: "Work from one dashboard",
    description:
      "Officers and administrators can monitor activity, update statuses, and navigate directly into case files.",
  },
];

const roleCards = [
  {
    name: "Admin",
    description: "Full user control, approvals, role management, and audit access.",
  },
  {
    name: "Officer",
    description: "Operational updates for FIRs, cases, criminal records, and assigned workflows.",
  },
  {
    name: "Viewer",
    description: "Read-only oversight for leadership, analysts, and records staff.",
  },
];

const overviewRows = [
  { label: "Incoming reports", value: "Structured FIR intake" },
  { label: "Review queue", value: "Approvals stay visible" },
  { label: "Case operations", value: "Notes, priorities, and follow-ups" },
  { label: "Leadership view", value: "Clear oversight across teams" },
];

const trustRows = [
  { label: "Authentication", value: "Supabase Auth" },
  { label: "Authorization", value: "RLS + role-aware interface" },
  { label: "Database", value: "PostgreSQL on Supabase" },
  { label: "UI", value: "Next.js, Tailwind, and shadcn/ui" },
];

export default async function Home() {
  const session = await getSessionContext();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-[-8rem] top-[-6rem] h-72 w-72 rounded-full bg-[color:var(--primary)]/10 blur-3xl" />
        <div className="absolute right-[-8rem] top-16 h-80 w-80 rounded-full bg-sky-400/15 blur-3xl" />
        <div className="absolute bottom-24 left-1/3 h-64 w-64 rounded-full bg-emerald-300/10 blur-3xl" />
      </div>

      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="sticky top-4 z-20 rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--card)]/88 px-5 py-4 shadow-[0_18px_55px_-32px_rgba(15,23,42,0.45)] backdrop-blur-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[color:var(--primary)]">
                Secure Workspace
              </p>
              <h1 className="font-heading text-xl font-semibold text-[color:var(--foreground)]">
                Police Record Management System
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <DarkModeToggle />
              <ThemeToggle />
              <Button variant="outline" asChild>
                <Link href="/login">Sign in</Link>
              </Button>
              <Button asChild>
                <Link href="/login">
                  Launch workspace
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </header>

        <section className="grid gap-10 py-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:py-16">
          <div className="space-y-8">
            <div className="space-y-5">
              <Badge className="px-3 py-1" variant="secondary">
                Built for calm operations, approvals, and casework
              </Badge>
              <div className="space-y-5">
                <h2 className="max-w-4xl font-heading text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl xl:text-7xl">
                  One calm, secure command center for police records and case coordination.
                </h2>
                <p className="max-w-2xl text-lg leading-8 text-[color:var(--muted-foreground)]">
                  PRMS brings FIR intake, criminal-record review, case tracking, and audit
                  visibility into one modern workspace so teams can move faster without losing
                  accountability.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link href="/login">
                  Sign in to continue
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#modules">Explore modules</Link>
              </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {statHighlights.map((item) => (
                <Card key={item.label} className="border-white/70 bg-white/82 shadow-sm">
                  <CardContent className="space-y-2 p-5">
                    <p className="font-heading text-3xl font-semibold text-slate-950">
                      {item.value}
                    </p>
                    <p className="text-sm font-medium text-slate-950">{item.label}</p>
                    <p className="text-sm leading-6 text-[color:var(--muted-foreground)]">
                      {item.detail}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-[color:var(--muted-foreground)]">
              <div className="flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--card)]/75 px-4 py-2">
                <CheckCircle2 className="h-4 w-4 text-[color:var(--primary)]" />
                Designed for fast intake and clear follow-through
              </div>
              <div className="flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--card)]/75 px-4 py-2">
                <LockKeyhole className="h-4 w-4 text-[color:var(--primary)]" />
                Review status, ownership, and activity in one place
              </div>
            </div>
          </div>

          <Card className="relative overflow-hidden border-[color:var(--border)] bg-[color:var(--card)]/92 text-[color:var(--foreground)] shadow-[0_40px_110px_-54px_rgba(15,23,42,0.55)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,var(--surface-glow-1),transparent_34%),radial-gradient(circle_at_bottom_right,var(--surface-glow-2),transparent_34%)] opacity-90" />
            <CardHeader className="relative space-y-6 pb-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-3">
                  <Badge
                    className="border-[color:var(--border)] bg-[color:var(--card)]/70 text-[color:var(--foreground)]"
                    variant="outline"
                  >
                    Operations snapshot
                  </Badge>
                  <div>
                    <CardTitle className="text-2xl text-[color:var(--foreground)]">
                      Purpose-built for high-clarity record operations
                    </CardTitle>
                    <p className="mt-3 max-w-lg text-sm leading-7 text-[color:var(--muted-foreground)]">
                      Replace ad hoc files, status spreadsheets, and fragmented review loops
                      with one workspace that keeps every record moving forward.
                    </p>
                  </div>
                </div>
                <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--secondary)]/80 p-3">
                  <ShieldCheck className="h-5 w-5 text-[color:var(--primary)]" />
                </div>
              </div>
            </CardHeader>

            <CardContent className="relative space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--card)]/72 p-5">
                  <p className="text-xs uppercase tracking-[0.28em] text-[color:var(--muted-foreground)]">
                    Shift briefing
                  </p>
                  <p className="mt-3 text-lg font-medium text-[color:var(--foreground)]">
                    See what is waiting, what is active, and what needs review at a glance
                  </p>
                </div>
                <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--card)]/72 p-5">
                  <p className="text-xs uppercase tracking-[0.28em] text-[color:var(--muted-foreground)]">
                    Team alignment
                  </p>
                  <p className="mt-3 text-lg font-medium text-[color:var(--foreground)]">
                    Keep admins, officers, and oversight staff working from the same source
                  </p>
                </div>
              </div>

              <div className="rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--card)]/72 p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-[color:var(--secondary)] p-3">
                    <LockKeyhole className="h-5 w-5 text-[color:var(--primary)]" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-[color:var(--muted-foreground)]">
                      Operations board
                    </p>
                    <p className="text-lg font-medium text-[color:var(--foreground)]">
                      Capture, review, assign, and audit from one continuous workflow
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-3 text-sm text-[color:var(--muted-foreground)]">
                  {overviewRows.map((row) => (
                    <div
                      key={row.label}
                      className="flex items-center justify-between rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)]/68 px-4 py-3"
                    >
                      <span>{row.label}</span>
                      <span className="font-medium text-[color:var(--foreground)]">
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section id="modules" className="space-y-8 py-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--primary)]">
                Core Modules
              </p>
              <h3 className="mt-3 font-heading text-3xl font-semibold text-slate-950 sm:text-4xl">
                Everything the records desk and field teams need in one place
              </h3>
            </div>
            <p className="max-w-xl text-sm leading-7 text-[color:var(--muted-foreground)]">
              Designed as a clean admin dashboard, PRMS keeps high-frequency workflows close
              together so reporting, review, supervision, and follow-up stay aligned.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {moduleCards.map((item) => {
              const Icon = item.icon;

              return (
                <Card
                  key={item.title}
                  className="group border-white/70 bg-white/80 transition-transform duration-200 hover:-translate-y-1"
                >
                  <CardContent className="space-y-4 p-6">
                    <div className="flex items-center justify-between">
                      <div className="rounded-2xl bg-[color:var(--secondary)] p-3">
                        <Icon className="h-5 w-5 text-[color:var(--primary)]" />
                      </div>
                      <div className="rounded-full border border-[color:var(--border)] px-3 py-1 text-xs font-medium text-[color:var(--muted-foreground)]">
                        Module
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-slate-950">{item.title}</h4>
                      <p className="mt-3 text-sm leading-7 text-[color:var(--muted-foreground)]">
                        {item.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="grid gap-6 py-8 lg:grid-cols-[0.95fr_1.05fr]">
          <Card className="border-white/70 bg-white/82">
            <CardHeader className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--primary)]">
                Workflow
              </p>
              <CardTitle className="text-3xl text-slate-950">
                Built around how records teams actually work
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {workflowSteps.map((step, index) => (
                <div
                  key={step.title}
                  className="rounded-[1.75rem] border border-[color:var(--border)] bg-[color:var(--card)]/70 p-5"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[color:var(--secondary)] text-sm font-semibold text-[color:var(--primary)]">
                      0{index + 1}
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--primary)]">
                        {step.label}
                      </p>
                      <p className="mt-2 text-lg font-semibold text-slate-950">{step.title}</p>
                      <p className="mt-2 text-sm leading-7 text-[color:var(--muted-foreground)]">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-white/70 bg-white/82">
            <CardHeader className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--primary)]">
                Role Coverage
              </p>
              <CardTitle className="text-3xl text-slate-950">
                One system, three operational lenses
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {roleCards.map((role) => (
                <div
                  key={role.name}
                  className="flex items-start justify-between gap-4 rounded-[1.75rem] border border-[color:var(--border)] bg-[color:var(--card)]/72 p-5"
                >
                  <div className="flex items-start gap-3">
                    <div className="rounded-2xl bg-[color:var(--secondary)] p-3">
                      <Users className="h-4 w-4 text-[color:var(--primary)]" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-slate-950">{role.name}</p>
                      <p className="mt-2 text-sm leading-7 text-[color:var(--muted-foreground)]">
                        {role.description}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="shrink-0">
                    {role.name}
                  </Badge>
                </div>
              ))}

              <div className="rounded-[1.75rem] border border-dashed border-[color:var(--border)] bg-[color:var(--secondary)]/45 p-5 text-sm leading-7 text-[color:var(--secondary-foreground)]">
                Sign in to open the protected dashboard, assign roles, manage FIRs, review
                criminal records, and inspect audit history from one secure workspace.
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 py-8 lg:grid-cols-[1.02fr_0.98fr]">
          <Card className="border-white/70 bg-white/82">
            <CardHeader className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--primary)]">
                Trust Layer
              </p>
              <CardTitle className="text-3xl text-slate-950">
                Built on a secure and accountable platform foundation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="max-w-2xl text-sm leading-7 text-[color:var(--muted-foreground)]">
                The product experience stays simple on the surface, while the platform
                underneath handles sign-in, permissions, data protection, and auditability in
                a production-ready setup.
              </p>

              <div className="grid gap-3">
                {trustRows.map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between rounded-[1.5rem] border border-[color:var(--border)] bg-[color:var(--card)]/72 px-5 py-4"
                  >
                    <span className="text-sm font-medium text-slate-950">{row.label}</span>
                    <span className="text-sm text-[color:var(--muted-foreground)]">
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-white/70 bg-white/82">
            <div className="absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top_left,var(--surface-glow-1),transparent_45%),radial-gradient(circle_at_top_right,var(--surface-glow-2),transparent_40%)] opacity-70" />
            <CardHeader className="relative space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--primary)]">
                Why It Feels Better
              </p>
              <CardTitle className="text-3xl text-slate-950">
                Less chasing, less guesswork, and clearer accountability
              </CardTitle>
            </CardHeader>
            <CardContent className="relative space-y-4">
              <div className="rounded-[1.75rem] border border-[color:var(--border)] bg-[color:var(--card)]/72 p-5">
                <p className="text-sm leading-7 text-[color:var(--muted-foreground)]">
                  Teams do not need to remember where a record lives, who last touched it, or
                  whether a review is still pending. The workflow makes that visible by default.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[1.5rem] border border-[color:var(--border)] bg-[color:var(--card)]/72 p-5 transition-transform duration-200 hover:-translate-y-1">
                  <p className="text-sm font-medium text-slate-950">Faster handoffs</p>
                  <p className="mt-2 text-sm leading-7 text-[color:var(--muted-foreground)]">
                    Clear ownership and linked records reduce coordination overhead.
                  </p>
                </div>
                <div className="rounded-[1.5rem] border border-[color:var(--border)] bg-[color:var(--card)]/72 p-5 transition-transform duration-200 hover:-translate-y-1">
                  <p className="text-sm font-medium text-slate-950">Better reviews</p>
                  <p className="mt-2 text-sm leading-7 text-[color:var(--muted-foreground)]">
                    Version history and approval states keep sensitive edits accountable.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="py-8 pb-14">
          <Card className="overflow-hidden border-white/70 bg-[color:var(--card)]/88 shadow-[0_28px_90px_-50px_rgba(15,23,42,0.6)]">
            <CardContent className="grid gap-8 p-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--primary)]">
                  Ready To Launch
                </p>
                <h3 className="font-heading text-3xl font-semibold text-slate-950 sm:text-4xl">
                  Start with the secure dashboard and scale into real operational use.
                </h3>
                <p className="max-w-2xl text-base leading-8 text-[color:var(--muted-foreground)]">
                  Start with a polished workspace for intake, case tracking, and reviews, then
                  rely on the platform underneath for security, permissions, and data integrity.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button size="lg" asChild>
                  <Link href="/login">
                    Launch workspace
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="#modules">Review modules</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </section>
    </main>
  );
}

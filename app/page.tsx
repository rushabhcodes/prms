import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  FileText,
  FolderKanban,
  History,
  LockKeyhole,
  ShieldCheck,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSessionContext } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

const featureCards = [
  {
    title: "Secure FIR workflows",
    description:
      "Capture first information reports, assign investigators, and keep incident progress visible from intake to closure.",
    icon: FileText,
  },
  {
    title: "Case coordination",
    description:
      "Track linked cases, priorities, notes, and follow-up actions across stations without leaving the dashboard.",
    icon: FolderKanban,
  },
  {
    title: "Auditable operations",
    description:
      "Role-aware activity logs and approval trails make reviews, supervision, and accountability much easier.",
    icon: History,
  },
];

const roleCards = [
  {
    name: "Admin",
    description: "Full oversight of users, approvals, records, and audit visibility.",
    accent: "default" as const,
  },
  {
    name: "Officer",
    description: "Operational access for FIR updates, criminal record intake, and case-note workflows.",
    accent: "secondary" as const,
  },
  {
    name: "Viewer",
    description: "Read-only visibility for leadership, analysts, and records staff.",
    accent: "outline" as const,
  },
];

const statHighlights = [
  { label: "Role-aware access", value: "3" },
  { label: "Core modules", value: "6" },
  { label: "Audit-backed actions", value: "100%" },
];

export default async function Home() {
  const session = await getSessionContext();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 -z-10 h-[32rem] bg-[radial-gradient(circle_at_top_left,rgba(15,118,110,0.16),transparent_34%),radial-gradient(circle_at_top_right,rgba(14,165,233,0.18),transparent_24%)]" />

      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-4 rounded-3xl border border-white/70 bg-white/75 px-5 py-4 shadow-sm backdrop-blur-xl">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--primary)]">
              Secure Workspace
            </p>
            <h1 className="font-heading text-xl font-semibold text-slate-950">
              Police Record Management System
            </h1>
          </div>

          <div className="flex items-center gap-3">
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
        </header>

        <div className="grid flex-1 gap-8 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-16">
          <div className="space-y-8">
            <div className="space-y-5">
              <Badge className="px-3 py-1" variant="secondary">
                Trusted operations dashboard
              </Badge>
              <div className="space-y-4">
                <h2 className="max-w-3xl font-heading text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
                  Modern police records, approvals, and case tracking in one command center.
                </h2>
                <p className="max-w-2xl text-lg leading-8 text-[color:var(--muted-foreground)]">
                  PRMS brings FIR intake, criminal record review, officer workflows, and
                  audit visibility into a single secure workspace built for administrative
                  teams and field operations.
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
                <Card key={item.label} className="bg-white/80">
                  <CardContent className="p-5">
                    <p className="text-3xl font-semibold text-slate-950">{item.value}</p>
                    <p className="mt-2 text-sm text-[color:var(--muted-foreground)]">
                      {item.label}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Card className="relative overflow-hidden border-white/80 bg-slate-950 text-slate-50 shadow-[0_32px_90px_-42px_rgba(15,23,42,0.9)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.22),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.18),transparent_30%)]" />
            <CardHeader className="relative space-y-5">
              <div className="flex items-center justify-between">
                <Badge className="border-white/15 bg-white/10 text-white" variant="outline">
                  Public overview
                </Badge>
                <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
                  <ShieldCheck className="h-5 w-5 text-teal-200" />
                </div>
              </div>
              <div>
                <CardTitle className="text-2xl text-white">
                  Purpose-built for secure record operations
                </CardTitle>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  Replace fragmented spreadsheets and scattered status updates with a
                  structured workflow for admins, officers, and oversight teams.
                </p>
              </div>
            </CardHeader>
            <CardContent className="relative space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                  <p className="text-sm uppercase tracking-[0.22em] text-slate-400">
                    Security
                  </p>
                  <p className="mt-2 text-lg font-medium">Supabase Auth + RLS enforced</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                  <p className="text-sm uppercase tracking-[0.22em] text-slate-400">
                    Access model
                  </p>
                  <p className="mt-2 text-lg font-medium">Admin, Officer, Viewer</p>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/6 p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-teal-400/12 p-3">
                    <LockKeyhole className="h-5 w-5 text-teal-200" />
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.22em] text-slate-400">
                      Access control
                    </p>
                    <p className="text-lg font-medium">Protected routes and role-aware UI</p>
                  </div>
                </div>
                <div className="mt-4 space-y-3 text-sm text-slate-300">
                  <div className="flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3">
                    <span>Authentication</span>
                    <span className="font-medium text-white">Supabase session</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3">
                    <span>Approvals</span>
                    <span className="font-medium text-white">Version tracked</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3">
                    <span>Audit visibility</span>
                    <span className="font-medium text-white">Admin and officer</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <section id="modules" className="grid gap-6 pb-8 lg:grid-cols-[1fr_0.95fr]">
          <div className="space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--primary)]">
                Core Modules
              </p>
              <h3 className="mt-3 font-heading text-3xl font-semibold text-slate-950">
                Built for day-to-day administrative and investigative work
              </h3>
            </div>

            <div className="grid gap-4">
              {featureCards.map((item) => {
                const Icon = item.icon;

                return (
                  <Card key={item.title} className="bg-white/80">
                    <CardContent className="flex gap-4 p-6">
                      <div className="rounded-2xl bg-[color:var(--secondary)] p-3">
                        <Icon className="h-5 w-5 text-[color:var(--primary)]" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-slate-950">{item.title}</h4>
                        <p className="mt-2 text-sm leading-7 text-[color:var(--muted-foreground)]">
                          {item.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <Card className="bg-white/82">
            <CardHeader>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--primary)]">
                Role Coverage
              </p>
              <CardTitle className="text-3xl text-slate-950">
                One platform, three operational views
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {roleCards.map((role) => (
                <div
                  key={role.name}
                  className="flex items-start justify-between gap-4 rounded-2xl border border-[color:var(--border)] bg-white/70 p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="rounded-2xl bg-[color:var(--secondary)] p-3">
                      <Users className="h-4 w-4 text-[color:var(--primary)]" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-950">{role.name}</p>
                      <p className="mt-1 text-sm leading-6 text-[color:var(--muted-foreground)]">
                        {role.description}
                      </p>
                    </div>
                  </div>
                  <Badge variant={role.accent}>{role.name}</Badge>
                </div>
              ))}

              <div className="rounded-2xl border border-dashed border-[color:var(--border)] bg-[color:var(--secondary)]/45 p-4 text-sm leading-7 text-[color:var(--secondary-foreground)]">
                Log in to access the protected dashboard, assign roles, manage FIRs, review
                criminal records, and inspect audit history.
              </div>
            </CardContent>
          </Card>
        </section>
      </section>
    </main>
  );
}

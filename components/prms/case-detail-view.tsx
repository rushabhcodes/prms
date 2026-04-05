import Link from "next/link";
import {
  ArrowLeft,
  Clock3,
  FileText,
  FolderKanban,
  ShieldCheck,
  StickyNote,
} from "lucide-react";

import { BreadcrumbTrail } from "@/components/layout/breadcrumb-trail";
import { CaseNotesManager } from "@/components/prms/case-notes-manager";
import { PageHeader } from "@/components/layout/page-header";
import { CasePriorityBadge, CaseStatusBadge } from "@/components/prms/badges";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AppRole, CaseDetailRecord } from "@/lib/types/prms";
import { formatDate, formatDateTime, titleCase } from "@/lib/utils";

function summarizeActivity(details: string) {
  try {
    const parsed = JSON.parse(details) as Record<string, unknown>;

    if (typeof parsed.title === "string") {
      return parsed.title;
    }

    if (typeof parsed.fir_number === "string") {
      return `${parsed.fir_number} is referenced in this activity.`;
    }

    if (typeof parsed.status === "string") {
      return `Status captured as ${titleCase(parsed.status)}.`;
    }
  } catch {
    return details;
  }

  return details || "Audit details captured for this action.";
}

function SnapshotBlock({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof FolderKanban;
}) {
  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-white/70 p-4">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-[color:var(--secondary)] p-2.5">
          <Icon className="h-4 w-4 text-[color:var(--primary)]" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--muted-foreground)]">
            {label}
          </p>
          <p className="mt-1 font-medium text-slate-950">{value}</p>
        </div>
      </div>
    </div>
  );
}

export function CaseDetailView({
  caseItem,
  currentUserId,
  currentUserRole,
  canWrite,
}: {
  caseItem: CaseDetailRecord;
  currentUserId: string;
  currentUserRole: AppRole;
  canWrite: boolean;
}) {
  return (
    <div className="space-y-6">
      <BreadcrumbTrail
        items={
          caseItem.firNumber
            ? [
                { label: "Dashboard", href: "/dashboard" },
                { label: "FIRs", href: "/firs" },
                {
                  label: caseItem.firNumber,
                  href: `/firs/${encodeURIComponent(caseItem.firNumber)}`,
                },
                { label: caseItem.caseNumber },
              ]
            : [
                { label: "Dashboard", href: "/dashboard" },
                { label: "Cases", href: "/cases" },
                { label: caseItem.caseNumber },
              ]
        }
      />
      <PageHeader
        eyebrow="Case File"
        title={caseItem.caseNumber}
        description={caseItem.title}
        action={
          <Button variant="outline" asChild>
            <Link href="/cases">
              <ArrowLeft className="h-4 w-4" />
              Back to Cases
            </Link>
          </Button>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <CasePriorityBadge priority={caseItem.priority} />
                <CaseStatusBadge status={caseItem.status} />
                <Badge variant="outline">{caseItem.notesCount} notes</Badge>
              </div>
              <CardTitle className="text-2xl text-slate-950">{caseItem.title}</CardTitle>
              <p className="max-w-3xl text-sm leading-7 text-[color:var(--muted-foreground)]">
                {caseItem.summary}
              </p>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <SnapshotBlock
                label="Opened on"
                value={formatDateTime(caseItem.createdAt)}
                icon={Clock3}
              />
              <SnapshotBlock
                label="Lead officer"
                value={caseItem.leadOfficerName ?? "Unassigned"}
                icon={ShieldCheck}
              />
              <SnapshotBlock
                label="Linked FIR"
                value={caseItem.firNumber ?? "Standalone case"}
                icon={FileText}
              />
              <SnapshotBlock
                label="Case notes"
                value={`${caseItem.notesCount} recorded updates`}
                icon={StickyNote}
              />
            </CardContent>
          </Card>

          <CaseNotesManager
            caseId={caseItem.id}
            notes={caseItem.notes}
            currentUserId={currentUserId}
            currentUserRole={currentUserRole}
            canWrite={canWrite}
          />

          <Card>
            <CardHeader>
              <CardTitle>Activity timeline</CardTitle>
            </CardHeader>
            <CardContent>
              {caseItem.activity.length === 0 ? (
                <p className="text-sm text-[color:var(--muted-foreground)]">
                  No case-specific activity has been recorded yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {caseItem.activity.map((entry) => (
                    <div
                      key={`${entry.entityType}-${entry.id}`}
                      className="rounded-2xl border border-[color:var(--border)] bg-white/70 p-4"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="outline">{titleCase(entry.entityType)}</Badge>
                            <Badge variant="secondary">{titleCase(entry.action)}</Badge>
                          </div>
                          <p className="font-medium text-slate-950">
                            {entry.actorName ?? "System activity"}
                          </p>
                          <p className="text-sm leading-7 text-[color:var(--muted-foreground)]">
                            {summarizeActivity(entry.details)}
                          </p>
                        </div>
                        <p className="text-sm text-[color:var(--muted-foreground)]">
                          {formatDateTime(entry.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Linked records</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl border border-[color:var(--border)] bg-white/70 p-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-2xl bg-[color:var(--secondary)] p-3">
                    <FileText className="h-4 w-4 text-[color:var(--primary)]" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--muted-foreground)]">
                      FIR linkage
                    </p>
                    {caseItem.firNumber ? (
                      <Link
                        href={`/firs/${encodeURIComponent(caseItem.firNumber)}`}
                        className="font-medium text-slate-950 transition-colors hover:text-[color:var(--primary)]"
                      >
                        {caseItem.firNumber}
                      </Link>
                    ) : (
                      <p className="font-medium text-slate-950">Standalone case</p>
                    )}
                    <p className="text-sm text-[color:var(--muted-foreground)]">
                      {caseItem.firNumber
                        ? "This case was created from a recorded FIR."
                        : "This case is not currently linked to a filed FIR."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[color:var(--border)] bg-white/70 p-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-2xl bg-[color:var(--secondary)] p-3">
                    <ShieldCheck className="h-4 w-4 text-[color:var(--primary)]" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--muted-foreground)]">
                      Lead investigator
                    </p>
                    <p className="font-medium text-slate-950">
                      {caseItem.leadOfficerName ?? "Unassigned"}
                    </p>
                    {caseItem.leadOfficerBadgeNumber ? (
                      <p className="text-sm text-[color:var(--muted-foreground)]">
                        {caseItem.leadOfficerBadgeNumber}
                      </p>
                    ) : null}
                    {caseItem.leadOfficerStationName ? (
                      <p className="text-sm text-[color:var(--muted-foreground)]">
                        {caseItem.leadOfficerStationName}
                      </p>
                    ) : null}
                    {caseItem.leadOfficerEmail ? (
                      <p className="text-sm text-[color:var(--muted-foreground)]">
                        {caseItem.leadOfficerEmail}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Operational snapshot</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-2xl bg-[color:var(--secondary)]/55 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--muted-foreground)]">
                  Current status
                </p>
                <div className="mt-3">
                  <CaseStatusBadge status={caseItem.status} />
                </div>
              </div>
              <div className="rounded-2xl bg-[color:var(--secondary)]/55 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--muted-foreground)]">
                  Priority level
                </p>
                <div className="mt-3">
                  <CasePriorityBadge priority={caseItem.priority} />
                </div>
              </div>
              <div className="rounded-2xl bg-[color:var(--secondary)]/55 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--muted-foreground)]">
                  Most recent update
                </p>
                <p className="mt-2 font-medium text-slate-950">
                  {caseItem.activity[0]
                    ? formatDate(caseItem.activity[0].createdAt)
                    : "No activity yet"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

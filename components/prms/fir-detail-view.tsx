import Link from "next/link";
import {
  ArrowLeft,
  Clock3,
  FileBadge2,
  FileClock,
  MapPin,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { CasePriorityBadge, CaseStatusBadge, FirStatusBadge } from "@/components/prms/badges";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { FirDetailRecord } from "@/lib/types/prms";
import { formatDate, formatDateTime, titleCase } from "@/lib/utils";

function summarizeActivity(details: string) {
  try {
    const parsed = JSON.parse(details) as Record<string, unknown>;

    if (typeof parsed.title === "string") {
      return parsed.title;
    }

    if (typeof parsed.case_number === "string") {
      return `${parsed.case_number} recorded in the audit trail.`;
    }

    if (typeof parsed.status === "string") {
      return `Status captured as ${titleCase(parsed.status)}.`;
    }
  } catch {
    return details;
  }

  return details || "Audit details captured for this action.";
}

function SummaryMetric({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof FileClock;
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

export function FirDetailView({ fir }: { fir: FirDetailRecord }) {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="FIR File"
        title={fir.firNumber}
        description={fir.title}
        action={
          <Button variant="outline" asChild>
            <Link href="/firs">
              <ArrowLeft className="h-4 w-4" />
              Back to FIRs
            </Link>
          </Button>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <FirStatusBadge status={fir.status} />
                  <Badge variant="outline">{fir.relatedCases.length} linked cases</Badge>
                </div>
                <CardTitle className="text-2xl text-slate-950">{fir.title}</CardTitle>
                <p className="max-w-3xl text-sm leading-7 text-[color:var(--muted-foreground)]">
                  {fir.description}
                </p>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <SummaryMetric
                label="Complainant"
                value={fir.complainantName}
                icon={UserRound}
              />
              <SummaryMetric
                label="Location"
                value={fir.location}
                icon={MapPin}
              />
              <SummaryMetric
                label="Incident date"
                value={formatDateTime(fir.incidentDate)}
                icon={FileClock}
              />
              <SummaryMetric
                label="Filed on"
                value={formatDateTime(fir.createdAt)}
                icon={Clock3}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Linked cases</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {fir.relatedCases.length === 0 ? (
                <div className="px-6 py-10 text-sm text-[color:var(--muted-foreground)]">
                  No cases have been linked to this FIR yet.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Case</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Lead officer</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fir.relatedCases.map((caseItem) => (
                      <TableRow key={caseItem.id}>
                        <TableCell>
                          <div>
                            <Link
                              href={`/cases/${encodeURIComponent(caseItem.caseNumber)}`}
                              className="font-medium text-slate-950 transition-colors hover:text-[color:var(--primary)]"
                            >
                              {caseItem.caseNumber}
                            </Link>
                            <p className="text-sm text-[color:var(--muted-foreground)]">
                              {caseItem.title}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <CasePriorityBadge priority={caseItem.priority} />
                        </TableCell>
                        <TableCell>
                          <CaseStatusBadge status={caseItem.status} />
                        </TableCell>
                        <TableCell>{caseItem.leadOfficerName ?? "Unassigned"}</TableCell>
                        <TableCell>{caseItem.notesCount}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activity timeline</CardTitle>
            </CardHeader>
            <CardContent>
              {fir.activity.length === 0 ? (
                <p className="text-sm text-[color:var(--muted-foreground)]">
                  No FIR-specific activity has been recorded yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {fir.activity.map((entry) => (
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
              <CardTitle>Assignment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl border border-[color:var(--border)] bg-white/70 p-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-2xl bg-[color:var(--secondary)] p-3">
                    <ShieldCheck className="h-4 w-4 text-[color:var(--primary)]" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--muted-foreground)]">
                      Assigned officer
                    </p>
                    <p className="font-medium text-slate-950">
                      {fir.assignedOfficerName ?? "Unassigned"}
                    </p>
                    {fir.assignedOfficerBadgeNumber ? (
                      <p className="text-sm text-[color:var(--muted-foreground)]">
                        {fir.assignedOfficerBadgeNumber}
                      </p>
                    ) : null}
                    {fir.assignedOfficerStationName ? (
                      <p className="text-sm text-[color:var(--muted-foreground)]">
                        {fir.assignedOfficerStationName}
                      </p>
                    ) : null}
                    {fir.assignedOfficerEmail ? (
                      <p className="text-sm text-[color:var(--muted-foreground)]">
                        {fir.assignedOfficerEmail}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[color:var(--border)] bg-white/70 p-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-2xl bg-[color:var(--secondary)] p-3">
                    <FileBadge2 className="h-4 w-4 text-[color:var(--primary)]" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--muted-foreground)]">
                      Filed by
                    </p>
                    <p className="font-medium text-slate-950">
                      {fir.createdByName ?? "Unknown"}
                    </p>
                    <p className="text-sm text-[color:var(--muted-foreground)]">
                      {fir.createdByRole ? titleCase(fir.createdByRole) : "Role unavailable"}
                      {fir.createdByBadgeNumber ? ` • ${fir.createdByBadgeNumber}` : ""}
                    </p>
                    {fir.createdByStationName ? (
                      <p className="text-sm text-[color:var(--muted-foreground)]">
                        {fir.createdByStationName}
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
                  <FirStatusBadge status={fir.status} />
                </div>
              </div>
              <div className="rounded-2xl bg-[color:var(--secondary)]/55 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--muted-foreground)]">
                  Linked case load
                </p>
                <p className="mt-2 text-3xl font-semibold text-slate-950">
                  {fir.relatedCases.length}
                </p>
              </div>
              <div className="rounded-2xl bg-[color:var(--secondary)]/55 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--muted-foreground)]">
                  Last recorded activity
                </p>
                <p className="mt-2 font-medium text-slate-950">
                  {fir.activity[0] ? formatDate(fir.activity[0].createdAt) : "No activity yet"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  FileStack,
  FileText,
  ShieldAlert,
  UserRound,
} from "lucide-react";

import { BreadcrumbTrail } from "@/components/layout/breadcrumb-trail";
import { CriminalRecordEditDialog } from "@/components/prms/criminal-record-edit-dialog";
import { PageHeader } from "@/components/layout/page-header";
import { CriminalRecordReviewControls } from "@/components/prms/criminal-record-review-controls";
import { CriminalRecordStatusBadge } from "@/components/prms/badges";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CriminalRecordDetailRecord } from "@/lib/types/prms";
import { formatDate, formatDateTime, titleCase } from "@/lib/utils";

function summarizeActivity(details: string) {
  try {
    const parsed = JSON.parse(details) as Record<string, unknown>;

    if (typeof parsed.offense_summary === "string") {
      return parsed.offense_summary;
    }

    if (typeof parsed.status === "string") {
      return `Status captured as ${titleCase(parsed.status)}.`;
    }
  } catch {
    return details;
  }

  return details || "Audit details captured for this action.";
}

function SnapshotMetric({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof FileStack;
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

export function CriminalRecordDetailView({
  record,
  canReview,
  canEdit,
}: {
  record: CriminalRecordDetailRecord;
  canReview: boolean;
  canEdit: boolean;
}) {
  return (
    <div className="space-y-6">
      <BreadcrumbTrail
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Criminal Records", href: "/criminal-records" },
          { label: record.nationalId },
        ]}
      />

      <PageHeader
        eyebrow="Record File"
        title={record.suspectName}
        description={record.nationalId}
        action={
          <div className="flex flex-wrap items-center gap-3">
            <CriminalRecordEditDialog record={record} canEdit={canEdit} />
            <Button variant="outline" asChild>
              <Link href="/criminal-records">
                <ArrowLeft className="h-4 w-4" />
                Back to Records
              </Link>
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <CriminalRecordStatusBadge status={record.status} />
                <Badge variant="outline">v{record.version}</Badge>
                <Badge variant="secondary">{record.versions.length} versions</Badge>
              </div>
              <CardTitle className="text-2xl text-slate-950">{record.suspectName}</CardTitle>
              <p className="max-w-3xl text-sm leading-7 text-[color:var(--muted-foreground)]">
                {record.offenseSummary}
              </p>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <SnapshotMetric
                label="National ID"
                value={record.nationalId}
                icon={BadgeCheck}
              />
              <SnapshotMetric
                label="Created on"
                value={formatDateTime(record.createdAt)}
                icon={FileText}
              />
              <SnapshotMetric
                label="Current version"
                value={`v${record.version}`}
                icon={FileStack}
              />
              <SnapshotMetric
                label="Last reviewed by"
                value={record.lastReviewedByName ?? "Awaiting review"}
                icon={UserRound}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Version history</CardTitle>
            </CardHeader>
            <CardContent>
              {record.versions.length === 0 ? (
                <p className="text-sm text-[color:var(--muted-foreground)]">
                  No version snapshots have been captured for this record yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {record.versions.map((versionItem) => (
                    <div
                      key={versionItem.id}
                      className="rounded-2xl border border-[color:var(--border)] bg-white/70 p-4"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="outline">v{versionItem.version}</Badge>
                            {versionItem.snapshotStatus ? (
                              <CriminalRecordStatusBadge status={versionItem.snapshotStatus} />
                            ) : null}
                          </div>
                          <p className="font-medium text-slate-950">
                            {versionItem.changedByName ?? "System snapshot"}
                          </p>
                          <p className="text-sm leading-7 text-[color:var(--muted-foreground)]">
                            {versionItem.snapshotOffenseSummary ??
                              "No snapshot summary was recorded for this version."}
                          </p>
                          {versionItem.note ? (
                            <p className="text-sm text-[color:var(--muted-foreground)]">
                              Note: {versionItem.note}
                            </p>
                          ) : null}
                        </div>
                        <p className="text-sm text-[color:var(--muted-foreground)]">
                          {formatDateTime(versionItem.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activity timeline</CardTitle>
            </CardHeader>
            <CardContent>
              {record.activity.length === 0 ? (
                <p className="text-sm text-[color:var(--muted-foreground)]">
                  No criminal-record activity has been recorded yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {record.activity.map((entry) => (
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
              <CardTitle>Record stewardship</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl border border-[color:var(--border)] bg-white/70 p-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-2xl bg-[color:var(--secondary)] p-3">
                    <ShieldAlert className="h-4 w-4 text-[color:var(--primary)]" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--muted-foreground)]">
                      Created by
                    </p>
                    <p className="font-medium text-slate-950">
                      {record.createdByName ?? "Unknown"}
                    </p>
                    <p className="text-sm text-[color:var(--muted-foreground)]">
                      {record.createdByRole ? titleCase(record.createdByRole) : "Role unavailable"}
                      {record.createdByBadgeNumber ? ` • ${record.createdByBadgeNumber}` : ""}
                    </p>
                    {record.createdByStationName ? (
                      <p className="text-sm text-[color:var(--muted-foreground)]">
                        {record.createdByStationName}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[color:var(--border)] bg-white/70 p-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-2xl bg-[color:var(--secondary)] p-3">
                    <BadgeCheck className="h-4 w-4 text-[color:var(--primary)]" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--muted-foreground)]">
                      Most recent reviewer
                    </p>
                    <p className="font-medium text-slate-950">
                      {record.lastReviewedByName ?? "Awaiting review"}
                    </p>
                    {record.lastReviewedByName ? (
                      <p className="text-sm text-[color:var(--muted-foreground)]">
                        {record.lastReviewedByRole
                          ? titleCase(record.lastReviewedByRole)
                          : "Role unavailable"}
                        {record.lastReviewedByBadgeNumber
                          ? ` • ${record.lastReviewedByBadgeNumber}`
                          : ""}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Approval controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {canReview && record.status === "pending" ? (
                <>
                  <p className="text-sm text-[color:var(--muted-foreground)]">
                    This record is awaiting an admin decision. Review from the detail page
                    keeps the latest version context visible.
                  </p>
                  <CriminalRecordReviewControls
                    recordId={record.id}
                    version={record.version}
                  />
                </>
              ) : (
                <div className="rounded-2xl bg-[color:var(--secondary)]/55 p-4">
                  <p className="text-sm text-[color:var(--muted-foreground)]">
                    {record.status === "pending"
                      ? "Only admins can approve or reject this record."
                      : `Review complete on ${record.activity[0] ? formatDate(record.activity[0].createdAt) : "the current version"}.`}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

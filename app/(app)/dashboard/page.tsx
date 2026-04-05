import Link from "next/link";
import { redirect } from "next/navigation";

import { canManageUsers } from "@/lib/auth/access";
import { PageHeader } from "@/components/layout/page-header";
import { FirStatusBadge, CriminalRecordStatusBadge } from "@/components/prms/badges";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getSessionContext } from "@/lib/auth/session";
import { getCases, getCriminalRecords, getDashboardMetrics, getFirs } from "@/lib/data/queries";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getSessionContext();

  if (!session) {
    redirect("/login");
  }

  const [metrics, firs, cases, criminalRecords] = await Promise.all([
    getDashboardMetrics(),
    getFirs(),
    getCases(),
    getCriminalRecords(),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Command Center"
        title="Operational dashboard"
        description="Monitor FIR intake, active cases, approval bottlenecks, and officer availability from a single secure dashboard."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total FIRs"
          value={metrics.totalFirs}
          detail="Registered incidents and complaint filings."
          href="/firs"
        />
        <StatCard
          label="Total Cases"
          value={metrics.totalCases}
          detail="Live case tracking across precinct workflows."
          href="/cases"
        />
        <StatCard
          label="Pending approvals"
          value={metrics.pendingApprovals}
          detail="Criminal records awaiting admin review."
          href="/criminal-records"
        />
        <StatCard
          label="Active officers"
          value={metrics.activeOfficers}
          detail="Currently enabled officers with system access."
          href={canManageUsers(session.user.role) ? "/users" : undefined}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <Card>
          <CardHeader>
            <CardTitle>Recent FIR activity</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>FIR</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned officer</TableHead>
                  <TableHead>Filed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {firs.slice(0, 5).map((fir) => (
                  <TableRow key={fir.id}>
                    <TableCell>
                      <div>
                        <Link
                          href={`/firs/${encodeURIComponent(fir.firNumber)}`}
                          className="font-medium text-slate-950 transition-colors hover:text-[color:var(--primary)]"
                        >
                          {fir.firNumber}
                        </Link>
                        <p className="text-sm text-[color:var(--muted-foreground)]">
                          {fir.title}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <FirStatusBadge status={fir.status} />
                    </TableCell>
                    <TableCell>{fir.assignedOfficerName ?? "Unassigned"}</TableCell>
                    <TableCell>{formatDate(fir.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pending criminal reviews</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {criminalRecords.slice(0, 4).map((record) => (
                <div key={record.id} className="rounded-2xl border border-[color:var(--border)] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{record.suspectName}</p>
                      <p className="text-sm text-[color:var(--muted-foreground)]">{record.offenseSummary}</p>
                    </div>
                    <CriminalRecordStatusBadge status={record.status} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Case pressure points</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cases.slice(0, 4).map((caseItem) => (
                <div key={caseItem.id} className="flex items-center justify-between gap-3 rounded-2xl bg-[color:var(--secondary)]/60 p-4">
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
                  <p className="text-sm font-medium text-[color:var(--primary)]">
                    {caseItem.notesCount} notes
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

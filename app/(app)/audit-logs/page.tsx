import { redirect } from "next/navigation";

import { AuditLogsView } from "@/components/prms/audit-logs-view";
import { PageHeader } from "@/components/layout/page-header";
import { canViewAuditLogs } from "@/lib/auth/access";
import { getSessionContext } from "@/lib/auth/session";
import { getAuditLogs } from "@/lib/data/queries";

export const dynamic = "force-dynamic";

export default async function AuditLogsPage() {
  const session = await getSessionContext();

  if (!session || !canViewAuditLogs(session.user.role)) {
    redirect("/dashboard");
  }

  const logs = await getAuditLogs();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Audit Trail"
        title="System activity"
        description="Review privileged actions, operational updates, and record-level changes through a searchable event ledger."
      />
      <AuditLogsView logs={logs} />
    </div>
  );
}

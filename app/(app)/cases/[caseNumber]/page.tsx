import { notFound, redirect } from "next/navigation";

import { CaseDetailView } from "@/components/prms/case-detail-view";
import { canWriteRecords } from "@/lib/auth/access";
import { getSessionContext } from "@/lib/auth/session";
import { getCaseByNumber, getUsers } from "@/lib/data/queries";

export const dynamic = "force-dynamic";

export default async function CaseDetailPage({
  params,
}: {
  params: Promise<{ caseNumber: string }>;
}) {
  const session = await getSessionContext();

  if (!session) {
    redirect("/login");
  }

  const { caseNumber } = await params;
  const [caseItem, users] = await Promise.all([getCaseByNumber(caseNumber), getUsers()]);

  if (!caseItem) {
    notFound();
  }

  const officers = users.filter((user) => user.role === "officer" && user.isActive);
  const canEditCase =
    canWriteRecords(session.user.role) &&
    (session.user.role === "admin" ||
      caseItem.leadOfficerId === session.user.id ||
      caseItem.createdById === session.user.id);
  const canReassignLead =
    session.user.role === "admin" || caseItem.createdById === session.user.id;

  return (
    <CaseDetailView
      caseItem={caseItem}
      officers={officers}
      currentUserId={session.user.id}
      currentUserRole={session.user.role}
      canWrite={canWriteRecords(session.user.role)}
      canEditCase={canEditCase}
      canReassignLead={canReassignLead}
    />
  );
}

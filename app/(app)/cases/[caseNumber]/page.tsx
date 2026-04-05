import { notFound, redirect } from "next/navigation";

import { CaseDetailView } from "@/components/prms/case-detail-view";
import { canWriteRecords } from "@/lib/auth/access";
import { getSessionContext } from "@/lib/auth/session";
import { getCaseByNumber } from "@/lib/data/queries";

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
  const caseItem = await getCaseByNumber(caseNumber);

  if (!caseItem) {
    notFound();
  }

  return (
    <CaseDetailView
      caseItem={caseItem}
      currentUserId={session.user.id}
      currentUserRole={session.user.role}
      canWrite={canWriteRecords(session.user.role)}
    />
  );
}

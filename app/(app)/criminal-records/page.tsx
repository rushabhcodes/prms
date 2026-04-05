import { redirect } from "next/navigation";

import { PageHeader } from "@/components/layout/page-header";
import { CriminalRecordsView } from "@/components/prms/criminal-records-view";
import { canReviewRecords, canWriteRecords } from "@/lib/auth/access";
import { getSessionContext } from "@/lib/auth/session";
import { getCriminalRecords } from "@/lib/data/queries";

export const dynamic = "force-dynamic";

export default async function CriminalRecordsPage() {
  const session = await getSessionContext();

  if (!session) {
    redirect("/login");
  }

  const records = await getCriminalRecords();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Verification Desk"
        title="Criminal records"
        description="Track record versions, route pending entries through review, and keep approval decisions visible to authorized teams."
      />
      <CriminalRecordsView
        records={records}
        canCreate={Boolean(session && canWriteRecords(session.user.role))}
        canReview={Boolean(session && canReviewRecords(session.user.role))}
      />
    </div>
  );
}

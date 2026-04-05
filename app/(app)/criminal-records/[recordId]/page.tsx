import { notFound, redirect } from "next/navigation";

import { CriminalRecordDetailView } from "@/components/prms/criminal-record-detail-view";
import { canReviewRecords } from "@/lib/auth/access";
import { getSessionContext } from "@/lib/auth/session";
import { getCriminalRecordById } from "@/lib/data/queries";

export const dynamic = "force-dynamic";

export default async function CriminalRecordDetailPage({
  params,
}: {
  params: Promise<{ recordId: string }>;
}) {
  const session = await getSessionContext();

  if (!session) {
    redirect("/login");
  }

  const { recordId } = await params;
  const record = await getCriminalRecordById(recordId);

  if (!record) {
    notFound();
  }

  return (
    <CriminalRecordDetailView
      record={record}
      canReview={canReviewRecords(session.user.role)}
    />
  );
}

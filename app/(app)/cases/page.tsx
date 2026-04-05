import { redirect } from "next/navigation";

import { PageHeader } from "@/components/layout/page-header";
import { CasesView } from "@/components/prms/cases-view";
import { canWriteRecords } from "@/lib/auth/access";
import { getSessionContext } from "@/lib/auth/session";
import { getCases } from "@/lib/data/queries";

export const dynamic = "force-dynamic";

export default async function CasesPage() {
  const session = await getSessionContext();

  if (!session) {
    redirect("/login");
  }

  const cases = await getCases();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Case Tracking"
        title="Investigation workflow"
        description="Prioritize active investigations, link them to FIRs, and record field notes or review handoffs in a structured view."
      />
      <CasesView
        cases={cases}
        canWrite={Boolean(session && canWriteRecords(session.user.role))}
      />
    </div>
  );
}

import { redirect } from "next/navigation";

import { PageHeader } from "@/components/layout/page-header";
import { FirsView } from "@/components/prms/firs-view";
import { canWriteRecords } from "@/lib/auth/access";
import { getSessionContext } from "@/lib/auth/session";
import { getFirs, getUsers } from "@/lib/data/queries";

export const dynamic = "force-dynamic";

export default async function FirsPage() {
  const session = await getSessionContext();

  if (!session) {
    redirect("/login");
  }

  const [firs, users] = await Promise.all([getFirs(), getUsers()]);

  const officers = users.filter((user) => user.role === "officer" && user.isActive);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="FIR Management"
        title="First information reports"
        description="Capture incident intake, assign investigators, and monitor report progress with a consistent workflow."
      />
      <FirsView
        firs={firs}
        officers={officers}
        canCreate={Boolean(session && canWriteRecords(session.user.role))}
        canUpdateStatus={Boolean(session && canWriteRecords(session.user.role))}
        currentUserId={session.user.id}
        currentUserRole={session.user.role}
      />
    </div>
  );
}

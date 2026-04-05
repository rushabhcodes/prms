import { redirect } from "next/navigation";

import { PageHeader } from "@/components/layout/page-header";
import { UsersTable } from "@/components/prms/users-table";
import { canManageUsers } from "@/lib/auth/access";
import { getSessionContext } from "@/lib/auth/session";
import { getUsers } from "@/lib/data/queries";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const session = await getSessionContext();

  if (!session || !canManageUsers(session.user.role)) {
    redirect("/dashboard");
  }

  const users = await getUsers();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Access Control"
        title="User profiles"
        description="Manage active status, role assignments, and the operational footprint of each authenticated user."
      />
      <UsersTable users={users} />
    </div>
  );
}

import { notFound, redirect } from "next/navigation";

import { FirDetailView } from "@/components/prms/fir-detail-view";
import { canWriteRecords } from "@/lib/auth/access";
import { getSessionContext } from "@/lib/auth/session";
import { getFirByNumber, getUsers } from "@/lib/data/queries";

export const dynamic = "force-dynamic";

export default async function FirDetailPage({
  params,
}: {
  params: Promise<{ firNumber: string }>;
}) {
  const session = await getSessionContext();

  if (!session) {
    redirect("/login");
  }

  const { firNumber } = await params;
  const [fir, users] = await Promise.all([getFirByNumber(firNumber), getUsers()]);

  if (!fir) {
    notFound();
  }

  const officers = users.filter((user) => user.role === "officer" && user.isActive);
  const canEditFir =
    canWriteRecords(session.user.role) &&
    (session.user.role === "admin" ||
      fir.assignedOfficerId === session.user.id ||
      fir.createdById === session.user.id);
  const canReassign =
    session.user.role === "admin" || fir.createdById === session.user.id;

  return (
    <FirDetailView
      fir={fir}
      officers={officers}
      canEdit={canEditFir}
      canReassign={canReassign}
    />
  );
}

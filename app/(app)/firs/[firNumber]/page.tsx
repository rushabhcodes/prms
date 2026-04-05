import { notFound, redirect } from "next/navigation";

import { FirDetailView } from "@/components/prms/fir-detail-view";
import { getSessionContext } from "@/lib/auth/session";
import { getFirByNumber } from "@/lib/data/queries";

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
  const fir = await getFirByNumber(firNumber);

  if (!fir) {
    notFound();
  }

  return <FirDetailView fir={fir} />;
}

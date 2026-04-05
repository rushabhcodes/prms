import { redirect } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { DemoModeBanner } from "@/components/layout/demo-mode-banner";
import { getSessionContext } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSessionContext();

  if (!session) {
    redirect("/login");
  }

  return (
    <AppShell session={session}>
      <div className="space-y-6">
        {session.isDemo ? <DemoModeBanner /> : null}
        {children}
      </div>
    </AppShell>
  );
}

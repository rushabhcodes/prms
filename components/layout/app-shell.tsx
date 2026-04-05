"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { Topbar } from "@/components/layout/topbar";
import type { SessionContext } from "@/lib/types/prms";

export function AppShell({
  children,
  session,
}: {
  children: ReactNode;
  session: SessionContext;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[280px_1fr]">
      <AppSidebar pathname={pathname} session={session} />
      <div className="min-w-0">
        <Topbar pathname={pathname} session={session} />
        <main className="px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}

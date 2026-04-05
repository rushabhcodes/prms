import Link from "next/link";
import { ChevronDown, History } from "lucide-react";

import { canViewAuditLogs } from "@/lib/auth/access";
import { SignOutMenuItem } from "@/components/layout/sign-out-menu-item";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { navigationItems } from "@/lib/data/navigation";
import type { SessionContext } from "@/lib/types/prms";

export function Topbar({
  pathname,
  session,
}: {
  pathname: string;
  session: SessionContext;
}) {
  const items = navigationItems.filter((item) =>
    item.roles.includes(session.user.role),
  );

  return (
    <header className="sticky top-0 z-30 border-b border-white/70 bg-white/70 backdrop-blur-xl">
      <div className="flex flex-col gap-4 px-4 py-4 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--primary)]">
              Secure Workspace
            </p>
            <h1 className="font-heading text-xl font-semibold text-slate-950">
              Police Record Management System
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-3">
                  <span className="hidden text-left sm:block">
                    <span className="block text-xs text-[color:var(--muted-foreground)]">
                      Signed in as
                    </span>
                    <span className="block">{session.user.fullName}</span>
                  </span>
                  <Badge variant="outline">{session.user.role}</Badge>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {canViewAuditLogs(session.user.role) ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/audit-logs" className="flex items-center gap-2">
                        <History className="h-4 w-4" />
                        Activity history
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                ) : null}
                <SignOutMenuItem />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto lg:hidden">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                pathname.startsWith(item.href)
                  ? "bg-[color:var(--primary)] text-[color:var(--primary-foreground)]"
                  : "bg-white/80 text-slate-700"
              }`}
            >
              {item.title}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}

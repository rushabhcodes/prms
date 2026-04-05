import Link from "next/link";
import { History, FileText, FolderKanban, LayoutDashboard, ShieldAlert, Users } from "lucide-react";

import { ActiveRolePanel } from "@/components/layout/active-role-panel";
import { navigationItems } from "@/lib/data/navigation";
import type { SessionContext } from "@/lib/types/prms";
import { cn } from "@/lib/utils";

const iconMap = {
  "layout-dashboard": LayoutDashboard,
  "file-text": FileText,
  "shield-alert": ShieldAlert,
  "folder-kanban": FolderKanban,
  users: Users,
  history: History,
};

export function AppSidebar({
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
    <aside className="hidden min-h-screen border-r border-[color:var(--border)] bg-[color:var(--sidebar)] px-5 py-6 backdrop-blur-xl lg:flex lg:flex-col">
      <Link href="/dashboard" className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--primary)]">
          PRMS
        </p>
        <div className="mt-3 space-y-1">
          <h2 className="font-heading text-2xl font-semibold tracking-tight text-[color:var(--foreground)]">
            Police Records
          </h2>
          <p className="text-sm text-[color:var(--muted-foreground)]">
            Secure operations, approvals, and audits in one command center.
          </p>
        </div>
      </Link>

      <nav className="mt-8 flex flex-1 flex-col gap-2">
        {items.map((item) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap];
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all",
                isActive
                  ? "bg-[color:var(--primary)] text-[color:var(--primary-foreground)] shadow-[0_18px_30px_-20px_rgba(15,118,110,0.95)]"
                  : "text-slate-700 hover:bg-[color:var(--card)] hover:text-[color:var(--foreground)]",
              )}
            >
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-xl transition-colors",
                  isActive
                    ? "bg-white/14 text-[color:var(--primary-foreground)]"
                    : "bg-[color:var(--card)] text-slate-600 group-hover:bg-[color:var(--card)] group-hover:text-[color:var(--primary)]",
                )}
              >
                <Icon className="h-4 w-4" />
              </span>
              {item.title}
            </Link>
          );
        })}
      </nav>

      <div className="sticky bottom-4 mt-6">
        <ActiveRolePanel session={session} />
      </div>
    </aside>
  );
}

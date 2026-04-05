import { ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { SessionContext } from "@/lib/types/prms";

export function ActiveRolePanel({
  session,
  compact = false,
}: {
  session: SessionContext;
  compact?: boolean;
}) {
  return (
    <div
      className={
        compact
          ? "flex items-center justify-between gap-3 rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] px-4 py-3 shadow-sm"
          : "rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-4 shadow-sm"
      }
    >
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-[color:var(--primary)]/12 p-2.5">
          <ShieldCheck className="h-4 w-4 text-[color:var(--primary)]" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--muted-foreground)]">
            Active role
          </p>
          <p className="mt-1 font-medium text-[color:var(--foreground)]">{session.user.fullName}</p>
          <p className="text-sm text-[color:var(--muted-foreground)]">
            {session.user.role.toUpperCase()}
            {session.user.badgeNumber ? ` • ${session.user.badgeNumber}` : ""}
          </p>
        </div>
      </div>

      {compact ? <Badge variant="outline">{session.user.role}</Badge> : null}
    </div>
  );
}

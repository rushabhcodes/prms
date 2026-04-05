import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--primary)]">
          {eyebrow}
        </p>
        <div className="space-y-1">
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-slate-950">
            {title}
          </h1>
          <p className="max-w-3xl text-sm text-[color:var(--muted-foreground)]">
            {description}
          </p>
        </div>
      </div>
      {action}
    </div>
  );
}

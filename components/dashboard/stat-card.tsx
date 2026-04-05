import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  detail,
  href,
}: {
  label: string;
  value: number;
  detail: string;
  href?: string;
}) {
  const content = (
    <Card
      className={cn(
        "overflow-hidden transition-all",
        href
          ? "hover:-translate-y-0.5 hover:border-[color:var(--primary)]/35 hover:shadow-[0_24px_40px_-32px_rgba(15,118,110,0.6)]"
          : "",
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-[color:var(--muted-foreground)]">{label}</p>
          <div
            className={cn(
              "rounded-full p-2 transition-colors",
              href
                ? "bg-[color:var(--secondary)]"
                : "bg-slate-100 text-slate-400",
            )}
          >
            <ArrowUpRight
              className={cn(
                "h-4 w-4",
                href ? "text-[color:var(--primary)]" : "text-slate-400",
              )}
            />
          </div>
        </div>
        <CardTitle className="text-3xl">{value}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-[color:var(--muted-foreground)]">{detail}</p>
      </CardContent>
    </Card>
  );

  if (!href) {
    return content;
  }

  return (
    <Link href={href} className="block">
      {content}
    </Link>
  );
}

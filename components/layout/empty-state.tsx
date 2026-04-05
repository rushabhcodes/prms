import { Inbox } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center gap-3 py-14 text-center">
        <div className="rounded-full bg-[color:var(--secondary)] p-3">
          <Inbox className="h-5 w-5 text-[color:var(--muted-foreground)]" />
        </div>
        <div className="space-y-1">
          <p className="font-medium">{title}</p>
          <p className="text-sm text-[color:var(--muted-foreground)]">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

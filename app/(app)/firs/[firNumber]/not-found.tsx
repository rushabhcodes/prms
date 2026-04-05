import Link from "next/link";
import { FileSearch } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function FirNotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="max-w-xl">
        <CardContent className="flex flex-col items-center gap-4 py-14 text-center">
          <div className="rounded-full bg-[color:var(--secondary)] p-4">
            <FileSearch className="h-6 w-6 text-[color:var(--primary)]" />
          </div>
          <div className="space-y-2">
            <p className="font-heading text-2xl font-semibold text-slate-950">
              FIR not found
            </p>
            <p className="text-sm leading-7 text-[color:var(--muted-foreground)]">
              The FIR file you requested could not be located. It may have been removed,
              renamed, or the link may be outdated.
            </p>
          </div>
          <Button asChild>
            <Link href="/firs">Return to FIR list</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

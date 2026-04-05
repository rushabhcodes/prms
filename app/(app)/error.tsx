"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Something went wrong while loading PRMS data</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-[color:var(--muted-foreground)]">
          The app did not fall back to sample data because a real Supabase project is
          configured. Refresh after checking your database rows, RLS policies, and
          network connectivity.
        </p>
        <div className="rounded-xl bg-[color:var(--secondary)] p-4 text-sm text-slate-700">
          {error.message || "Unknown application error."}
        </div>
        <Button onClick={reset}>Try again</Button>
      </CardContent>
    </Card>
  );
}

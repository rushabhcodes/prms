"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { reviewCriminalRecordAction } from "@/app/actions/criminal-records";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toaster";

export function CriminalRecordReviewControls({
  recordId,
  version,
  compact = false,
}: {
  recordId: string;
  version: number;
  compact?: boolean;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  function handleReview(decision: "approved" | "rejected") {
    startTransition(async () => {
      const result = await reviewCriminalRecordAction({
        id: recordId,
        version,
        decision,
      });

      toast({
        title: result.success ? "Review submitted" : "Review failed",
        description: result.message,
        variant: result.success ? "success" : "destructive",
      });

      if (result.success) {
        router.refresh();
      }
    });
  }

  return (
    <div className={`flex ${compact ? "gap-2" : "gap-3"}`}>
      <Button
        size={compact ? "sm" : "default"}
        variant="outline"
        disabled={isPending}
        onClick={() => handleReview("rejected")}
      >
        Reject
      </Button>
      <Button
        size={compact ? "sm" : "default"}
        disabled={isPending}
        onClick={() => handleReview("approved")}
      >
        Approve
      </Button>
    </div>
  );
}

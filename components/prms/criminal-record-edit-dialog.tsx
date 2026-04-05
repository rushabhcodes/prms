"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { updateCriminalRecordAction } from "@/app/actions/criminal-records";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toaster";
import type { CriminalRecordDetailRecord } from "@/lib/types/prms";

export function CriminalRecordEditDialog({
  record,
  canEdit,
}: {
  record: CriminalRecordDetailRecord;
  canEdit: boolean;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    suspectName: record.suspectName,
    nationalId: record.nationalId,
    offenseSummary: record.offenseSummary,
  });

  if (!canEdit) {
    return null;
  }

  function resetForm() {
    setForm({
      suspectName: record.suspectName,
      nationalId: record.nationalId,
      offenseSummary: record.offenseSummary,
    });
  }

  function submit() {
    startTransition(async () => {
      const result = await updateCriminalRecordAction({
        id: record.id,
        version: record.version,
        suspectName: form.suspectName,
        nationalId: form.nationalId,
        offenseSummary: form.offenseSummary,
      });

      toast({
        title: result.success ? "Record updated" : "Unable to update record",
        description: result.message,
        variant: result.success ? "success" : "destructive",
      });

      if (result.success) {
        setOpen(false);
        router.refresh();
      }
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (nextOpen) {
          resetForm();
        }
        setOpen(nextOpen);
      }}
    >
      <DialogTrigger asChild>
        <Button>Edit record</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit criminal record</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="rounded-2xl bg-[color:var(--secondary)]/60 p-4 text-sm text-[color:var(--secondary-foreground)]">
            Saving edits will create a new version snapshot and return this record to
            pending review.
          </div>
          <div className="space-y-2">
            <Label htmlFor="criminal-suspect-name">Suspect name</Label>
            <Input
              id="criminal-suspect-name"
              value={form.suspectName}
              onChange={(event) =>
                setForm((current) => ({ ...current, suspectName: event.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="criminal-national-id">National ID</Label>
            <Input
              id="criminal-national-id"
              value={form.nationalId}
              onChange={(event) =>
                setForm((current) => ({ ...current, nationalId: event.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="criminal-offense-summary">Offense summary</Label>
            <Textarea
              id="criminal-offense-summary"
              value={form.offenseSummary}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  offenseSummary: event.target.value,
                }))
              }
            />
          </div>
        </div>
        <DialogFooter>
          <Button disabled={isPending} onClick={submit}>
            {isPending ? "Saving..." : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

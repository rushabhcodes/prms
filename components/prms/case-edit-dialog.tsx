"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { updateCaseAction } from "@/app/actions/cases";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toaster";
import type { CaseDetailRecord, UserProfile } from "@/lib/types/prms";

export function CaseEditDialog({
  caseItem,
  officers,
  canEdit,
  canReassign,
}: {
  caseItem: CaseDetailRecord;
  officers: UserProfile[];
  canEdit: boolean;
  canReassign: boolean;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: caseItem.title,
    summary: caseItem.summary,
    priority: caseItem.priority,
    status: caseItem.status,
    leadOfficerId: caseItem.leadOfficerId ?? officers[0]?.id ?? "",
  });

  if (!canEdit) {
    return null;
  }

  function resetForm() {
    setForm({
      title: caseItem.title,
      summary: caseItem.summary,
      priority: caseItem.priority,
      status: caseItem.status,
      leadOfficerId: caseItem.leadOfficerId ?? officers[0]?.id ?? "",
    });
  }

  function submit() {
    startTransition(async () => {
      const result = await updateCaseAction({
        caseId: caseItem.id,
        title: form.title,
        summary: form.summary,
        priority: form.priority,
        status: form.status,
        leadOfficerId: form.leadOfficerId,
      });

      toast({
        title: result.success ? "Case updated" : "Unable to update case",
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
        <Button>Edit case</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit case details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="case-title">Title</Label>
            <Input
              id="case-title"
              value={form.title}
              onChange={(event) =>
                setForm((current) => ({ ...current, title: event.target.value }))
              }
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="case-summary">Summary</Label>
            <Textarea
              id="case-summary"
              value={form.summary}
              onChange={(event) =>
                setForm((current) => ({ ...current, summary: event.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Priority</Label>
            <Select
              value={form.priority}
              onValueChange={(value) =>
                setForm((current) => ({
                  ...current,
                  priority: value as CaseDetailRecord["priority"],
                }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={form.status}
              onValueChange={(value) =>
                setForm((current) => ({
                  ...current,
                  status: value as CaseDetailRecord["status"],
                }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="pending_review">Pending Review</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Lead officer</Label>
            <Select
              value={form.leadOfficerId}
              disabled={!canReassign}
              onValueChange={(value) =>
                setForm((current) => ({ ...current, leadOfficerId: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select officer" />
              </SelectTrigger>
              <SelectContent>
                {officers.map((officer) => (
                  <SelectItem key={officer.id} value={officer.id}>
                    {officer.fullName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!canReassign ? (
              <p className="text-xs text-[color:var(--muted-foreground)]">
                Only admins or the case creator can reassign the lead officer.
              </p>
            ) : null}
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

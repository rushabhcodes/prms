"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { updateFirDetailsAction } from "@/app/actions/firs";
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
import type { FirDetailRecord, UserProfile } from "@/lib/types/prms";
import { toDateTimeLocalValue } from "@/lib/utils";

export function FirEditDialog({
  fir,
  officers,
  canEdit,
  canReassign,
}: {
  fir: FirDetailRecord;
  officers: UserProfile[];
  canEdit: boolean;
  canReassign: boolean;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: fir.title,
    description: fir.description,
    incidentDate: toDateTimeLocalValue(fir.incidentDate),
    location: fir.location,
    complainantName: fir.complainantName,
    status: fir.status,
    assignedOfficerId: fir.assignedOfficerId ?? officers[0]?.id ?? "",
  });

  if (!canEdit) {
    return null;
  }

  function resetForm() {
    setForm({
      title: fir.title,
      description: fir.description,
      incidentDate: toDateTimeLocalValue(fir.incidentDate),
      location: fir.location,
      complainantName: fir.complainantName,
      status: fir.status,
      assignedOfficerId: fir.assignedOfficerId ?? officers[0]?.id ?? "",
    });
  }

  function submit() {
    startTransition(async () => {
      const result = await updateFirDetailsAction({
        firId: fir.id,
        title: form.title,
        description: form.description,
        incidentDate: form.incidentDate,
        location: form.location,
        complainantName: form.complainantName,
        status: form.status,
        assignedOfficerId: form.assignedOfficerId,
      });

      toast({
        title: result.success ? "FIR updated" : "Unable to update FIR",
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
        <Button>Edit FIR</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit FIR details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="fir-title">Title</Label>
            <Input
              id="fir-title"
              value={form.title}
              onChange={(event) =>
                setForm((current) => ({ ...current, title: event.target.value }))
              }
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="fir-description">Description</Label>
            <Textarea
              id="fir-description"
              value={form.description}
              onChange={(event) =>
                setForm((current) => ({ ...current, description: event.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fir-incident-date">Incident date</Label>
            <Input
              id="fir-incident-date"
              type="datetime-local"
              value={form.incidentDate}
              onChange={(event) =>
                setForm((current) => ({ ...current, incidentDate: event.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fir-location">Location</Label>
            <Input
              id="fir-location"
              value={form.location}
              onChange={(event) =>
                setForm((current) => ({ ...current, location: event.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fir-complainant">Complainant</Label>
            <Input
              id="fir-complainant"
              value={form.complainantName}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  complainantName: event.target.value,
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={form.status}
              onValueChange={(value) =>
                setForm((current) => ({
                  ...current,
                  status: value as FirDetailRecord["status"],
                }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="under_investigation">Under Investigation</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Assigned officer</Label>
            <Select
              value={form.assignedOfficerId}
              disabled={!canReassign}
              onValueChange={(value) =>
                setForm((current) => ({ ...current, assignedOfficerId: value }))
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
                Only admins or the FIR creator can reassign the officer on this file.
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

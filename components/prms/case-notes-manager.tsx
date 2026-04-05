"use client";

import { Edit3, PlusCircle, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

import {
  createCaseNoteAction,
  deleteCaseNoteAction,
  updateCaseNoteAction,
} from "@/app/actions/cases";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toaster";
import type { AppRole, CaseNoteRecord } from "@/lib/types/prms";
import { formatDateTime } from "@/lib/utils";

type DraftState = {
  mode: "create" | "edit";
  noteId?: string;
  value: string;
};

export function CaseNotesManager({
  caseId,
  notes,
  currentUserId,
  currentUserRole,
  canWrite,
}: {
  caseId: string;
  notes: CaseNoteRecord[];
  currentUserId: string;
  currentUserRole: AppRole;
  canWrite: boolean;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<DraftState>({
    mode: "create",
    value: "",
  });

  const sortedNotes = useMemo(
    () => [...notes].sort((left, right) => right.createdAt.localeCompare(left.createdAt)),
    [notes],
  );

  function openCreateDialog() {
    setDraft({ mode: "create", value: "" });
    setOpen(true);
  }

  function openEditDialog(note: CaseNoteRecord) {
    setDraft({ mode: "edit", noteId: note.id, value: note.note });
    setOpen(true);
  }

  function canManageNote(note: CaseNoteRecord) {
    return currentUserRole === "admin" || note.createdById === currentUserId;
  }

  function submit() {
    startTransition(async () => {
      const result =
        draft.mode === "create"
          ? await createCaseNoteAction({ caseId, note: draft.value })
          : await updateCaseNoteAction({
              noteId: draft.noteId ?? "",
              note: draft.value,
            });

      toast({
        title:
          draft.mode === "create"
            ? result.success
              ? "Note added"
              : "Unable to add note"
            : result.success
              ? "Note updated"
              : "Unable to update note",
        description: result.message,
        variant: result.success ? "success" : "destructive",
      });

      if (result.success) {
        setOpen(false);
        setDraft({ mode: "create", value: "" });
        router.refresh();
      }
    });
  }

  function handleDelete(noteId: string) {
    startTransition(async () => {
      const result = await deleteCaseNoteAction({ noteId });

      toast({
        title: result.success ? "Note deleted" : "Unable to delete note",
        description: result.message,
        variant: result.success ? "success" : "destructive",
      });

      if (result.success) {
        router.refresh();
      }
    });
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <CardTitle>Case notes</CardTitle>
        {canWrite ? (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" onClick={openCreateDialog}>
                <PlusCircle className="h-4 w-4" />
                Add note
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {draft.mode === "create" ? "Add case note" : "Edit case note"}
                </DialogTitle>
              </DialogHeader>
              <Textarea
                placeholder="Document investigative updates, requests, or next steps."
                value={draft.value}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, value: event.target.value }))
                }
              />
              <DialogFooter>
                <Button disabled={isPending || draft.value.trim().length < 8} onClick={submit}>
                  {isPending
                    ? "Saving..."
                    : draft.mode === "create"
                      ? "Save note"
                      : "Update note"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ) : null}
      </CardHeader>
      <CardContent>
        {sortedNotes.length === 0 ? (
          <p className="text-sm text-[color:var(--muted-foreground)]">
            No notes have been added to this case yet.
          </p>
        ) : (
          <div className="space-y-4">
            {sortedNotes.map((note) => (
              <div
                key={note.id}
                className="rounded-2xl border border-[color:var(--border)] bg-white/70 p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-2">
                    <p className="font-medium text-slate-950">
                      {note.createdByName ?? "Unknown author"}
                    </p>
                    <p className="text-sm leading-7 text-[color:var(--muted-foreground)]">
                      {note.note}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                    <p className="text-sm text-[color:var(--muted-foreground)]">
                      {formatDateTime(note.createdAt)}
                    </p>
                    {canWrite && canManageNote(note) ? (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={isPending}
                          onClick={() => openEditDialog(note)}
                        >
                          <Edit3 className="h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={isPending}
                          onClick={() => handleDelete(note.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

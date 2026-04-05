"use client";

import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { createCaseNoteAction } from "@/app/actions/cases";
import { EmptyState } from "@/components/layout/empty-state";
import { CasePriorityBadge, CaseStatusBadge } from "@/components/prms/badges";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toaster";
import type { CaseRecord } from "@/lib/types/prms";
import { formatDate } from "@/lib/utils";

export function CasesView({
  cases,
  canWrite,
}: {
  cases: CaseRecord[];
  canWrite: boolean;
}) {
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedCase, setSelectedCase] = useState<CaseRecord | null>(null);
  const [note, setNote] = useState("");

  async function submitNote() {
    if (!selectedCase) {
      return;
    }

    startTransition(async () => {
      const result = await createCaseNoteAction({
        caseId: selectedCase.id,
        note,
      });

      toast({
        title: result.success ? "Note added" : "Unable to add note",
        description: result.message,
        variant: result.success ? "success" : "destructive",
      });

      if (result.success) {
        setSelectedCase(null);
        setNote("");
        router.refresh();
      }
    });
  }

  if (cases.length === 0) {
    return (
      <EmptyState
        title="No cases yet"
        description="Cases linked to FIRs will appear here, along with priority and follow-up note counts."
      />
    );
  }

  return (
    <>
      <Card>
        <CardContent className="p-0">
          <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Case</TableHead>
                  <TableHead>FIR linkage</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Lead officer</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
            <TableBody>
                {cases.map((caseItem) => (
                  <TableRow key={caseItem.id}>
                    <TableCell>
                      <div>
                        <Link
                          href={`/cases/${encodeURIComponent(caseItem.caseNumber)}`}
                          className="font-medium text-slate-950 transition-colors hover:text-[color:var(--primary)]"
                        >
                          {caseItem.caseNumber}
                        </Link>
                        <p className="text-sm text-[color:var(--muted-foreground)]">
                          <Link
                            href={`/cases/${encodeURIComponent(caseItem.caseNumber)}`}
                            className="transition-colors hover:text-[color:var(--foreground)]"
                          >
                            {caseItem.title}
                          </Link>
                        </p>
                      </div>
                    </TableCell>
                  <TableCell>{caseItem.firNumber ?? "Standalone case"}</TableCell>
                  <TableCell>
                    <CasePriorityBadge priority={caseItem.priority} />
                  </TableCell>
                  <TableCell>
                    <CaseStatusBadge status={caseItem.status} />
                  </TableCell>
                  <TableCell>{caseItem.leadOfficerName ?? "Unassigned"}</TableCell>
                  <TableCell>
                    <div>
                      <p>{caseItem.notesCount} notes</p>
                      <p className="text-sm text-[color:var(--muted-foreground)]">
                        Opened {formatDate(caseItem.createdAt)}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/cases/${encodeURIComponent(caseItem.caseNumber)}`}>
                          View details
                        </Link>
                      </Button>
                      {canWrite ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedCase(caseItem)}
                        >
                          <PlusCircle className="h-4 w-4" />
                          Add note
                        </Button>
                      ) : (
                        <span className="self-center text-sm text-[color:var(--muted-foreground)]">
                          Read-only
                        </span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={Boolean(selectedCase)} onOpenChange={(open) => !open && setSelectedCase(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Add case note {selectedCase ? `for ${selectedCase.caseNumber}` : ""}
            </DialogTitle>
          </DialogHeader>
          <Textarea
            placeholder="Document investigative updates, requests, or next steps."
            value={note}
            onChange={(event) => setNote(event.target.value)}
          />
          <DialogFooter>
            <Button disabled={isPending} onClick={submitNote}>
              {isPending ? "Saving..." : "Save note"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

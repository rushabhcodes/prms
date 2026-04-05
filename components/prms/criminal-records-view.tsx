"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

import {
  createCriminalRecordAction,
  reviewCriminalRecordAction,
} from "@/app/actions/criminal-records";
import { EmptyState } from "@/components/layout/empty-state";
import { CriminalRecordStatusBadge } from "@/components/prms/badges";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toaster";
import type { CriminalRecord } from "@/lib/types/prms";
import { formatDate } from "@/lib/utils";

export function CriminalRecordsView({
  records,
  canCreate,
  canReview,
}: {
  records: CriminalRecord[];
  canCreate: boolean;
  canReview: boolean;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    suspectName: "",
    nationalId: "",
    offenseSummary: "",
  });
  const pendingRecords = useMemo(
    () => records.filter((record) => record.status === "pending"),
    [records],
  );

  async function handleReview(record: CriminalRecord, decision: "approved" | "rejected") {
    startTransition(async () => {
      const result = await reviewCriminalRecordAction({
        id: record.id,
        version: record.version,
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

  async function handleCreate() {
    startTransition(async () => {
      const result = await createCriminalRecordAction(form);

      toast({
        title: result.success ? "Record created" : "Create failed",
        description: result.message,
        variant: result.success ? "success" : "destructive",
      });

      if (result.success) {
        setOpen(false);
        setForm({ suspectName: "", nationalId: "", offenseSummary: "" });
        router.refresh();
      }
    });
  }

  const renderTable = (items: CriminalRecord[]) =>
    items.length === 0 ? (
      <EmptyState
        title="No records in this view"
        description="Approved, pending, and rejected records will appear here as investigators submit updates."
      />
    ) : (
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Suspect</TableHead>
                <TableHead>National ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Reviewed by</TableHead>
                <TableHead>Created</TableHead>
                {canReview ? <TableHead className="text-right">Actions</TableHead> : null}
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{record.suspectName}</p>
                      <p className="max-w-md text-sm text-[color:var(--muted-foreground)]">
                        {record.offenseSummary}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{record.nationalId}</TableCell>
                  <TableCell>
                    <CriminalRecordStatusBadge status={record.status} />
                  </TableCell>
                  <TableCell>v{record.version}</TableCell>
                  <TableCell>{record.lastReviewedByName ?? "Awaiting review"}</TableCell>
                  <TableCell>{formatDate(record.createdAt)}</TableCell>
                  {canReview ? (
                    <TableCell className="text-right">
                      {record.status === "pending" ? (
                        <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={isPending}
                              onClick={() => handleReview(record, "rejected")}
                            >
                              Reject
                            </Button>
                          <Button
                            size="sm"
                            disabled={isPending}
                            onClick={() => handleReview(record, "approved")}
                          >
                            Approve
                          </Button>
                        </div>
                      ) : (
                        <span className="text-sm text-[color:var(--muted-foreground)]">
                          Review complete
                        </span>
                      )}
                    </TableCell>
                  ) : null}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );

  return (
    <div className="space-y-6">
      {canCreate ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Create record</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add criminal record</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label>Suspect name</Label>
                <Input
                  value={form.suspectName}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, suspectName: event.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>National ID</Label>
                <Input
                  value={form.nationalId}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, nationalId: event.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Offense summary</Label>
                <Textarea
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
              <Button disabled={isPending} onClick={handleCreate}>
                {isPending ? "Saving..." : "Create record"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : null}

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Pending approvals</TabsTrigger>
          <TabsTrigger value="all">All records</TabsTrigger>
        </TabsList>
        <TabsContent value="pending">{renderTable(pendingRecords)}</TabsContent>
        <TabsContent value="all">{renderTable(records)}</TabsContent>
      </Tabs>
    </div>
  );
}

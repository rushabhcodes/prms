"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { createFirAction, updateFirStatusAction } from "@/app/actions/firs";
import { EmptyState } from "@/components/layout/empty-state";
import { FirStatusBadge } from "@/components/prms/badges";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toaster";
import type { CreateFirValues } from "@/lib/validations/prms";
import { createFirSchema } from "@/lib/validations/prms";
import type { FirRecord, UserProfile } from "@/lib/types/prms";
import { formatDate } from "@/lib/utils";

export function FirsView({
  firs,
  officers,
  canCreate,
  canUpdateStatus,
  currentUserId,
  currentUserRole,
}: {
  firs: FirRecord[];
  officers: UserProfile[];
  canCreate: boolean;
  canUpdateStatus: boolean;
  currentUserId: string;
  currentUserRole: UserProfile["role"];
}) {
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const form = useForm<CreateFirValues>({
    resolver: zodResolver(createFirSchema),
    defaultValues: {
      firNumber: "",
      title: "",
      description: "",
      incidentDate: "",
      location: "",
      complainantName: "",
      status: "pending",
      assignedOfficerId: officers[0]?.id ?? "",
    },
  });

  const submit = form.handleSubmit((values) => {
    startTransition(async () => {
      const result = await createFirAction(values);

      toast({
        title: result.success ? "FIR created" : "Unable to create FIR",
        description: result.message,
        variant: result.success ? "success" : "destructive",
      });

      if (result.success) {
        setOpen(false);
        form.reset();
        router.refresh();
      }
    });
  });

  function handleStatusChange(firId: string, status: CreateFirValues["status"]) {
    startTransition(async () => {
      const result = await updateFirStatusAction({ firId, status });

      toast({
        title: result.success ? "Status updated" : "Unable to update status",
        description: result.message,
        variant: result.success ? "success" : "destructive",
      });

      if (result.success) {
        router.refresh();
      }
    });
  }

  return (
    <div className="space-y-6">
      {canCreate ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="lg">
              <Plus className="h-4 w-4" />
              New FIR
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create FIR</DialogTitle>
              <DialogDescription>
                Capture the case summary, incident details, and assigned officer.
              </DialogDescription>
            </DialogHeader>
            <form className="grid gap-4 md:grid-cols-2" onSubmit={submit}>
              <div className="space-y-2">
                <Label htmlFor="firNumber">FIR number</Label>
                <Input id="firNumber" {...form.register("firNumber")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="incidentDate">Incident date</Label>
                <Input id="incidentDate" type="datetime-local" {...form.register("incidentDate")} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" {...form.register("title")} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" {...form.register("description")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" {...form.register("location")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="complainantName">Complainant</Label>
                <Input id="complainantName" {...form.register("complainantName")} />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  defaultValue={form.getValues("status")}
                  onValueChange={(value) =>
                    form.setValue("status", value as CreateFirValues["status"])
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
              <div className="space-y-2">
                <Label>Assigned officer</Label>
                <Select
                  defaultValue={form.getValues("assignedOfficerId")}
                  onValueChange={(value) => form.setValue("assignedOfficerId", value)}
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
              </div>
              <DialogFooter className="md:col-span-2">
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Saving..." : "Create FIR"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      ) : null}

      {firs.length === 0 ? (
        <EmptyState
          title="No FIRs recorded yet"
          description="Once FIRs are logged, assigned officers and status badges will appear here."
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>FIR number</TableHead>
                  <TableHead>Case summary</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned officer</TableHead>
                  <TableHead>Filed on</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {firs.map((fir) => (
                  <TableRow key={fir.id}>
                    <TableCell className="font-medium text-slate-950">{fir.firNumber}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{fir.title}</p>
                        <p className="max-w-md text-sm text-[color:var(--muted-foreground)]">
                          {fir.location} • {fir.complainantName}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {canUpdateStatus &&
                      (currentUserRole === "admin" ||
                        fir.assignedOfficerId === currentUserId ||
                        fir.createdById === currentUserId) ? (
                        <div className="min-w-[220px]">
                          <Select
                            defaultValue={fir.status}
                            onValueChange={(value) =>
                              handleStatusChange(fir.id, value as CreateFirValues["status"])
                            }
                          >
                            <SelectTrigger disabled={isPending} className="h-9">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="draft">Draft</SelectItem>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="under_investigation">
                                Under Investigation
                              </SelectItem>
                              <SelectItem value="closed">Closed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      ) : (
                        <FirStatusBadge status={fir.status} />
                      )}
                    </TableCell>
                    <TableCell>{fir.assignedOfficerName ?? "Unassigned"}</TableCell>
                    <TableCell>{formatDate(fir.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

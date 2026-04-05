"use client";

import { useTransition } from "react";

import { updateUserRoleAction, updateUserStatusAction } from "@/app/actions/users";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/toaster";
import type { UserProfile } from "@/lib/types/prms";

export function UsersTable({ users }: { users: UserProfile[] }) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Badge</TableHead>
              <TableHead>Station</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div>
                    <p className="font-medium text-slate-950">{user.fullName}</p>
                    <p className="text-sm text-[color:var(--muted-foreground)]">{user.email}</p>
                  </div>
                </TableCell>
                <TableCell>{user.badgeNumber ?? "Unassigned"}</TableCell>
                <TableCell>{user.stationName ?? "Not set"}</TableCell>
                <TableCell className="w-[220px]">
                  <Select
                    defaultValue={user.role}
                    onValueChange={(role) => {
                      startTransition(async () => {
                        const result = await updateUserRoleAction({
                          userId: user.id,
                          role: role as UserProfile["role"],
                        });

                        toast({
                          title: result.success ? "Role updated" : "Update failed",
                          description: result.message,
                          variant: result.success ? "success" : "destructive",
                        });
                      });
                    }}
                  >
                    <SelectTrigger disabled={isPending}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="officer">Officer</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={user.isActive}
                      disabled={isPending}
                      onCheckedChange={(checked) => {
                        startTransition(async () => {
                          const result = await updateUserStatusAction({
                            userId: user.id,
                            isActive: checked,
                          });

                          toast({
                            title: result.success ? "Status updated" : "Update failed",
                            description: result.message,
                            variant: result.success ? "success" : "destructive",
                          });
                        });
                      }}
                    />
                    <Badge variant={user.isActive ? "success" : "outline"}>
                      {user.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

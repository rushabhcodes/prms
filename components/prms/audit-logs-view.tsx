"use client";

import { useDeferredValue, useMemo, useState } from "react";

import { EmptyState } from "@/components/layout/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { AuditLogRecord } from "@/lib/types/prms";
import { formatDateTime, titleCase } from "@/lib/utils";

export function AuditLogsView({ logs }: { logs: AuditLogRecord[] }) {
  const [query, setQuery] = useState("");
  const [entityFilter, setEntityFilter] = useState("all");
  const deferredQuery = useDeferredValue(query);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesEntity =
        entityFilter === "all" || log.entityType === entityFilter;
      const haystack = `${log.actorName ?? ""} ${log.action} ${log.details}`.toLowerCase();
      const matchesQuery = haystack.includes(deferredQuery.toLowerCase());

      return matchesEntity && matchesQuery;
    });
  }, [deferredQuery, entityFilter, logs]);

  if (logs.length === 0) {
    return (
      <EmptyState
        title="No audit logs available"
        description="Audit entries will begin appearing once users start creating or updating records."
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-[1fr_220px]">
        <Input
          placeholder="Search actor, action, or details..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <Select value={entityFilter} onValueChange={setEntityFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by entity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All entities</SelectItem>
            <SelectItem value="user_profiles">User profiles</SelectItem>
            <SelectItem value="firs">FIRs</SelectItem>
            <SelectItem value="criminal_records">Criminal records</SelectItem>
            <SelectItem value="cases">Cases</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredLogs.length === 0 ? (
        <EmptyState
          title="No matching audit entries"
          description="Try another keyword or switch the entity filter."
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Actor</TableHead>
                  <TableHead>Entity</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{formatDateTime(log.createdAt)}</TableCell>
                    <TableCell>{log.actorName ?? "System"}</TableCell>
                    <TableCell>{titleCase(log.entityType)}</TableCell>
                    <TableCell>{titleCase(log.action)}</TableCell>
                    <TableCell className="max-w-xl text-sm text-[color:var(--muted-foreground)]">
                      {log.details}
                    </TableCell>
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

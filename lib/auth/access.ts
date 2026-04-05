import type { AppRole } from "@/lib/types/prms";

export function canManageUsers(role: AppRole) {
  return role === "admin";
}

export function canWriteRecords(role: AppRole) {
  return role === "admin" || role === "officer";
}

export function canReviewRecords(role: AppRole) {
  return role === "admin";
}

export function canViewAuditLogs(role: AppRole) {
  return role === "admin" || role === "officer";
}

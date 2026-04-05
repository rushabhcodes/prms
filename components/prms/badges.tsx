import { Badge } from "@/components/ui/badge";
import type {
  CasePriority,
  CaseStatus,
  CriminalRecordStatus,
  FirStatus,
} from "@/lib/types/prms";
import { titleCase } from "@/lib/utils";

export function FirStatusBadge({ status }: { status: FirStatus }) {
  const variant =
    status === "closed"
      ? "success"
      : status === "pending"
        ? "warning"
        : "default";

  return <Badge variant={variant}>{titleCase(status)}</Badge>;
}

export function CriminalRecordStatusBadge({
  status,
}: {
  status: CriminalRecordStatus;
}) {
  const variant =
    status === "approved"
      ? "success"
      : status === "rejected"
        ? "destructive"
        : "warning";

  return <Badge variant={variant}>{titleCase(status)}</Badge>;
}

export function CasePriorityBadge({ priority }: { priority: CasePriority }) {
  const variant =
    priority === "high"
      ? "destructive"
      : priority === "medium"
        ? "warning"
        : "default";

  return <Badge variant={variant}>{titleCase(priority)}</Badge>;
}

export function CaseStatusBadge({ status }: { status: CaseStatus }) {
  const variant =
    status === "closed"
      ? "success"
      : status === "pending_review"
        ? "warning"
        : "default";

  return <Badge variant={variant}>{titleCase(status)}</Badge>;
}

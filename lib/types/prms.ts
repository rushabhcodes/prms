export type AppRole = "admin" | "officer" | "viewer";
export type FirStatus = "draft" | "pending" | "under_investigation" | "closed";
export type CriminalRecordStatus = "pending" | "approved" | "rejected";
export type CasePriority = "low" | "medium" | "high";
export type CaseStatus = "open" | "in_progress" | "pending_review" | "closed";

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  badgeNumber: string | null;
  role: AppRole;
  isActive: boolean;
  stationName: string | null;
}

export interface DashboardMetrics {
  totalFirs: number;
  totalCases: number;
  pendingApprovals: number;
  activeOfficers: number;
}

export interface FirRecord {
  id: string;
  firNumber: string;
  title: string;
  description: string;
  incidentDate: string;
  location: string;
  complainantName: string;
  status: FirStatus;
  assignedOfficerId: string | null;
  assignedOfficerName: string | null;
  createdById: string | null;
  createdAt: string;
}

export interface FirDetailRecord extends FirRecord {
  createdByName: string | null;
  createdByRole: AppRole | null;
  createdByBadgeNumber: string | null;
  createdByStationName: string | null;
  assignedOfficerEmail: string | null;
  assignedOfficerBadgeNumber: string | null;
  assignedOfficerStationName: string | null;
  relatedCases: CaseRecord[];
  activity: AuditLogRecord[];
}

export interface CriminalRecord {
  id: string;
  suspectName: string;
  nationalId: string;
  offenseSummary: string;
  status: CriminalRecordStatus;
  version: number;
  createdAt: string;
  lastReviewedByName: string | null;
}

export interface CaseRecord {
  id: string;
  caseNumber: string;
  firNumber: string | null;
  title: string;
  summary: string;
  priority: CasePriority;
  status: CaseStatus;
  leadOfficerName: string | null;
  notesCount: number;
  createdAt: string;
}

export interface CaseNoteRecord {
  id: string;
  note: string;
  createdAt: string;
  createdByName: string | null;
}

export interface CaseDetailRecord extends CaseRecord {
  firId: string | null;
  summary: string;
  leadOfficerEmail: string | null;
  leadOfficerBadgeNumber: string | null;
  leadOfficerStationName: string | null;
  notes: CaseNoteRecord[];
  activity: AuditLogRecord[];
}

export interface AuditLogRecord {
  id: number;
  actorName: string | null;
  entityType: string;
  entityId: string | null;
  action: string;
  details: string;
  createdAt: string;
}

export interface SessionContext {
  user: UserProfile;
  isDemo: boolean;
}

export interface ActionResult {
  success: boolean;
  message: string;
}

export interface NavItem {
  title: string;
  href: string;
  icon: string;
  roles: AppRole[];
}

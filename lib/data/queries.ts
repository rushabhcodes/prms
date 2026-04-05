import "server-only";

import {
  getMockCaseByNumber,
  getMockCriminalRecordById,
  mockAuditLogs,
  mockCases,
  mockCriminalRecords,
  mockFirs,
  mockMetrics,
  mockUsers,
} from "@/lib/data/mock-prms";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import type {
  AuditLogRecord,
  CaseDetailRecord,
  CriminalRecordDetailRecord,
  CaseRecord,
  CriminalRecord,
  CriminalRecordVersionRecord,
  DashboardMetrics,
  FirDetailRecord,
  FirRecord,
  UserProfile,
} from "@/lib/types/prms";

function buildUserMap(users: UserProfile[]) {
  return new Map(users.map((user) => [user.id, user]));
}

async function getRequiredSupabaseClient() {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    throw new Error("Supabase client is unavailable.");
  }

  return supabase;
}

function failQuery(scope: string, details?: string) {
  throw new Error(details ? `${scope}: ${details}` : scope);
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  if (!hasSupabaseEnv()) {
    return mockMetrics;
  }

  const supabase = await getRequiredSupabaseClient();

  const [firCount, caseCount, pendingCount, activeOfficers] = await Promise.all([
    supabase.from("firs").select("*", { count: "exact", head: true }),
    supabase.from("cases").select("*", { count: "exact", head: true }),
    supabase
      .from("criminal_records")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase
      .from("user_profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "officer")
      .eq("is_active", true),
  ]);

  if (firCount.error) {
    failQuery("Failed to load FIR metric", firCount.error.message);
  }

  if (caseCount.error) {
    failQuery("Failed to load case metric", caseCount.error.message);
  }

  if (pendingCount.error) {
    failQuery("Failed to load pending approval metric", pendingCount.error.message);
  }

  if (activeOfficers.error) {
    failQuery("Failed to load active officers metric", activeOfficers.error.message);
  }

  return {
    totalFirs: firCount.count ?? 0,
    totalCases: caseCount.count ?? 0,
    pendingApprovals: pendingCount.count ?? 0,
    activeOfficers: activeOfficers.count ?? 0,
  };
}

export async function getUsers(): Promise<UserProfile[]> {
  if (!hasSupabaseEnv()) {
    return mockUsers;
  }

  const supabase = await getRequiredSupabaseClient();

  const { data, error } = await supabase
    .from("user_profiles")
    .select("id, email, full_name, badge_number, role, is_active, station_name")
    .order("created_at", { ascending: false });

  if (error || !data) {
    failQuery("Failed to load user profiles", error?.message);
  }

  const userRows = data ?? [];

  return userRows.map((row) => ({
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    badgeNumber: row.badge_number,
    role: row.role,
    isActive: row.is_active,
    stationName: row.station_name,
  }));
}

export async function getFirs(): Promise<FirRecord[]> {
  if (!hasSupabaseEnv()) {
    return mockFirs;
  }

  const supabase = await getRequiredSupabaseClient();

  const [firsResult, users] = await Promise.all([
    supabase
      .from("firs")
      .select(
        "id, fir_number, title, description, incident_date, location, complainant_name, status, assigned_officer_id, created_by, created_at",
      )
      .order("created_at", { ascending: false }),
    getUsers(),
  ]);

  if (firsResult.error || !firsResult.data) {
    failQuery("Failed to load FIRs", firsResult.error?.message);
  }

  const userMap = buildUserMap(users);
  const firRows = firsResult.data ?? [];

  return firRows.map((row) => ({
    id: row.id,
    firNumber: row.fir_number,
    title: row.title,
    description: row.description,
    incidentDate: row.incident_date,
    location: row.location,
    complainantName: row.complainant_name,
    status: row.status,
    assignedOfficerId: row.assigned_officer_id,
    assignedOfficerName: row.assigned_officer_id
      ? userMap.get(row.assigned_officer_id)?.fullName ?? null
      : null,
    createdById: row.created_by,
    createdAt: row.created_at,
  }));
}

export async function getFirByNumber(firNumber: string): Promise<FirDetailRecord | null> {
  if (!hasSupabaseEnv()) {
    const fir = mockFirs.find((item) => item.firNumber === firNumber);

    if (!fir) {
      return null;
    }

    const createdBy = fir.createdById
      ? mockUsers.find((user) => user.id === fir.createdById) ?? null
      : null;
    const assignedOfficer = fir.assignedOfficerId
      ? mockUsers.find((user) => user.id === fir.assignedOfficerId) ?? null
      : null;
    const relatedCases = mockCases.filter((caseItem) => caseItem.firNumber === fir.firNumber);
    const relatedCaseIds = new Set(relatedCases.map((caseItem) => caseItem.id));
    const activity = mockAuditLogs
      .filter(
        (log) =>
          (log.entityType === "firs" && log.entityId === fir.id) ||
          (log.entityType === "cases" && log.entityId && relatedCaseIds.has(log.entityId)),
      )
      .sort((left, right) => right.createdAt.localeCompare(left.createdAt));

    return {
      ...fir,
      createdByName: createdBy?.fullName ?? null,
      createdByRole: createdBy?.role ?? null,
      createdByBadgeNumber: createdBy?.badgeNumber ?? null,
      createdByStationName: createdBy?.stationName ?? null,
      assignedOfficerEmail: assignedOfficer?.email ?? null,
      assignedOfficerBadgeNumber: assignedOfficer?.badgeNumber ?? null,
      assignedOfficerStationName: assignedOfficer?.stationName ?? null,
      relatedCases,
      activity,
    };
  }

  const supabase = await getRequiredSupabaseClient();
  const users = await getUsers();
  const userMap = buildUserMap(users);

  const { data: firRow, error: firError } = await supabase
    .from("firs")
    .select(
      "id, fir_number, title, description, incident_date, location, complainant_name, status, assigned_officer_id, created_by, created_at",
    )
    .eq("fir_number", firNumber)
    .maybeSingle();

  if (firError) {
    failQuery("Failed to load FIR detail", firError.message);
  }

  if (!firRow) {
    return null;
  }

  const { data: caseRows, error: casesError } = await supabase
    .from("cases")
    .select(
      "id, case_number, fir_id, title, summary, priority, status, lead_officer_id, created_at",
    )
    .eq("fir_id", firRow.id)
    .order("created_at", { ascending: false });

  if (casesError) {
    failQuery("Failed to load related cases", casesError.message);
  }

  const caseIds = (caseRows ?? []).map((row) => row.id);

  const [notesResult, firAuditResult, caseAuditResult] = await Promise.all([
    caseIds.length > 0
      ? supabase.from("case_notes").select("id, case_id").in("case_id", caseIds)
      : Promise.resolve({ data: [], error: null }),
    supabase
      .from("audit_logs")
      .select("id, actor_id, entity_type, entity_id, action, details, created_at")
      .eq("entity_type", "firs")
      .eq("entity_id", firRow.id)
      .order("created_at", { ascending: false })
      .limit(20),
    caseIds.length > 0
      ? supabase
          .from("audit_logs")
          .select("id, actor_id, entity_type, entity_id, action, details, created_at")
          .eq("entity_type", "cases")
          .in("entity_id", caseIds)
          .order("created_at", { ascending: false })
          .limit(20)
      : Promise.resolve({ data: [], error: null }),
  ]);

  if (notesResult.error) {
    failQuery("Failed to load case note counts", notesResult.error.message);
  }

  if (firAuditResult.error) {
    failQuery("Failed to load FIR activity", firAuditResult.error.message);
  }

  if (caseAuditResult.error) {
    failQuery("Failed to load case activity", caseAuditResult.error.message);
  }

  const noteCountMap = new Map<string, number>();

  notesResult.data?.forEach((note) => {
    noteCountMap.set(note.case_id, (noteCountMap.get(note.case_id) ?? 0) + 1);
  });

  const relatedCases: CaseRecord[] = (caseRows ?? []).map((row) => ({
    id: row.id,
    caseNumber: row.case_number,
    firNumber: firRow.fir_number,
    title: row.title,
    summary: row.summary,
    priority: row.priority,
    status: row.status,
    leadOfficerName: row.lead_officer_id
      ? userMap.get(row.lead_officer_id)?.fullName ?? null
      : null,
    notesCount: noteCountMap.get(row.id) ?? 0,
    createdAt: row.created_at,
  }));

  const activityRows = [...(firAuditResult.data ?? []), ...(caseAuditResult.data ?? [])].sort(
    (left, right) => right.created_at.localeCompare(left.created_at),
  );

  const activity: AuditLogRecord[] = activityRows.map((row) => ({
    id: row.id,
    actorName: row.actor_id ? userMap.get(row.actor_id)?.fullName ?? null : null,
    entityType: row.entity_type,
    entityId: row.entity_id,
    action: row.action,
    details:
      typeof row.details === "string"
        ? row.details
        : JSON.stringify(row.details ?? {}, null, 0),
    createdAt: row.created_at,
  }));

  const createdBy = firRow.created_by ? userMap.get(firRow.created_by) ?? null : null;
  const assignedOfficer = firRow.assigned_officer_id
    ? userMap.get(firRow.assigned_officer_id) ?? null
    : null;

  return {
    id: firRow.id,
    firNumber: firRow.fir_number,
    title: firRow.title,
    description: firRow.description,
    incidentDate: firRow.incident_date,
    location: firRow.location,
    complainantName: firRow.complainant_name,
    status: firRow.status,
    assignedOfficerId: firRow.assigned_officer_id,
    assignedOfficerName: assignedOfficer?.fullName ?? null,
    createdById: firRow.created_by,
    createdAt: firRow.created_at,
    createdByName: createdBy?.fullName ?? null,
    createdByRole: createdBy?.role ?? null,
    createdByBadgeNumber: createdBy?.badgeNumber ?? null,
    createdByStationName: createdBy?.stationName ?? null,
    assignedOfficerEmail: assignedOfficer?.email ?? null,
    assignedOfficerBadgeNumber: assignedOfficer?.badgeNumber ?? null,
    assignedOfficerStationName: assignedOfficer?.stationName ?? null,
    relatedCases,
    activity,
  };
}

export async function getCriminalRecords(): Promise<CriminalRecord[]> {
  if (!hasSupabaseEnv()) {
    return mockCriminalRecords;
  }

  const supabase = await getRequiredSupabaseClient();

  const [recordsResult, users] = await Promise.all([
    supabase
      .from("criminal_records")
      .select(
        "id, suspect_name, national_id, offense_summary, status, version, created_at, last_reviewed_by",
      )
      .order("created_at", { ascending: false }),
    getUsers(),
  ]);

  if (recordsResult.error || !recordsResult.data) {
    failQuery("Failed to load criminal records", recordsResult.error?.message);
  }

  const userMap = buildUserMap(users);
  const recordRows = recordsResult.data ?? [];

  return recordRows.map((row) => ({
    id: row.id,
    suspectName: row.suspect_name,
    nationalId: row.national_id,
    offenseSummary: row.offense_summary,
    status: row.status,
    version: row.version,
    createdAt: row.created_at,
    lastReviewedByName: row.last_reviewed_by
      ? userMap.get(row.last_reviewed_by)?.fullName ?? null
      : null,
  }));
}

export async function getCases(): Promise<CaseRecord[]> {
  if (!hasSupabaseEnv()) {
    return mockCases;
  }

  const supabase = await getRequiredSupabaseClient();

  const [casesResult, users, firs, notesResult] = await Promise.all([
    supabase
      .from("cases")
      .select(
        "id, case_number, fir_id, title, summary, priority, status, lead_officer_id, created_at",
      )
      .order("created_at", { ascending: false }),
    getUsers(),
    getFirs(),
    supabase.from("case_notes").select("id, case_id"),
  ]);

  if (casesResult.error || !casesResult.data) {
    failQuery("Failed to load cases", casesResult.error?.message);
  }

  if (notesResult.error) {
    failQuery("Failed to load case note counts", notesResult.error.message);
  }

  const userMap = buildUserMap(users);
  const firMap = new Map(firs.map((fir) => [fir.id, fir]));
  const noteCountMap = new Map<string, number>();
  const caseRows = casesResult.data ?? [];

  notesResult.data?.forEach((note) => {
    noteCountMap.set(note.case_id, (noteCountMap.get(note.case_id) ?? 0) + 1);
  });

  return caseRows.map((row) => ({
    id: row.id,
    caseNumber: row.case_number,
    firNumber: row.fir_id ? firMap.get(row.fir_id)?.firNumber ?? null : null,
    title: row.title,
    summary: row.summary,
    priority: row.priority,
    status: row.status,
    leadOfficerId: row.lead_officer_id,
    leadOfficerName: row.lead_officer_id
      ? userMap.get(row.lead_officer_id)?.fullName ?? null
      : null,
    createdById: null,
    notesCount: noteCountMap.get(row.id) ?? 0,
    createdAt: row.created_at,
  }));
}

export async function getCaseByNumber(caseNumber: string): Promise<CaseDetailRecord | null> {
  if (!hasSupabaseEnv()) {
    return getMockCaseByNumber(caseNumber);
  }

  const supabase = await getRequiredSupabaseClient();
  const users = await getUsers();
  const userMap = buildUserMap(users);

  const { data: caseRow, error: caseError } = await supabase
    .from("cases")
    .select(
      "id, case_number, fir_id, title, summary, priority, status, lead_officer_id, created_by, created_at",
    )
    .eq("case_number", caseNumber)
    .maybeSingle();

  if (caseError) {
    failQuery("Failed to load case detail", caseError.message);
  }

  if (!caseRow) {
    return null;
  }

  const [notesResult, caseAuditResult, firAuditResult, firResult] = await Promise.all([
    supabase
      .from("case_notes")
      .select("id, note, created_at, created_by")
      .eq("case_id", caseRow.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("audit_logs")
      .select("id, actor_id, entity_type, entity_id, action, details, created_at")
      .eq("entity_type", "cases")
      .eq("entity_id", caseRow.id)
      .order("created_at", { ascending: false })
      .limit(20),
    caseRow.fir_id
      ? supabase
          .from("audit_logs")
          .select("id, actor_id, entity_type, entity_id, action, details, created_at")
          .eq("entity_type", "firs")
          .eq("entity_id", caseRow.fir_id)
          .order("created_at", { ascending: false })
          .limit(10)
      : Promise.resolve({ data: [], error: null }),
    caseRow.fir_id
      ? supabase
          .from("firs")
          .select("id, fir_number")
          .eq("id", caseRow.fir_id)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
  ]);

  if (notesResult.error) {
    failQuery("Failed to load case notes", notesResult.error.message);
  }

  if (caseAuditResult.error) {
    failQuery("Failed to load case activity", caseAuditResult.error.message);
  }

  if (firAuditResult.error) {
    failQuery("Failed to load related FIR activity", firAuditResult.error.message);
  }

  if (firResult.error) {
    failQuery("Failed to load linked FIR", firResult.error.message);
  }

  const notes = (notesResult.data ?? []).map((row) => ({
    id: row.id,
    note: row.note,
    createdAt: row.created_at,
    createdById: row.created_by,
    createdByName: row.created_by ? userMap.get(row.created_by)?.fullName ?? null : null,
  }));

  const activityRows = [...(caseAuditResult.data ?? []), ...(firAuditResult.data ?? [])].sort(
    (left, right) => right.created_at.localeCompare(left.created_at),
  );

  const activity: AuditLogRecord[] = activityRows.map((row) => ({
    id: row.id,
    actorName: row.actor_id ? userMap.get(row.actor_id)?.fullName ?? null : null,
    entityType: row.entity_type,
    entityId: row.entity_id,
    action: row.action,
    details:
      typeof row.details === "string"
        ? row.details
        : JSON.stringify(row.details ?? {}, null, 0),
    createdAt: row.created_at,
  }));

  const leadOfficer = caseRow.lead_officer_id
    ? userMap.get(caseRow.lead_officer_id) ?? null
    : null;

  return {
    id: caseRow.id,
    caseNumber: caseRow.case_number,
    firId: caseRow.fir_id,
    firNumber: firResult.data?.fir_number ?? null,
    title: caseRow.title,
    summary: caseRow.summary,
    priority: caseRow.priority,
    status: caseRow.status,
    leadOfficerId: caseRow.lead_officer_id,
    leadOfficerName: leadOfficer?.fullName ?? null,
    leadOfficerEmail: leadOfficer?.email ?? null,
    leadOfficerBadgeNumber: leadOfficer?.badgeNumber ?? null,
    leadOfficerStationName: leadOfficer?.stationName ?? null,
    createdById: caseRow.created_by,
    notesCount: notes.length,
    createdAt: caseRow.created_at,
    notes,
    activity,
  };
}

export async function getCriminalRecordById(
  recordId: string,
): Promise<CriminalRecordDetailRecord | null> {
  if (!hasSupabaseEnv()) {
    return getMockCriminalRecordById(recordId);
  }

  const supabase = await getRequiredSupabaseClient();
  const users = await getUsers();
  const userMap = buildUserMap(users);

  const { data: recordRow, error: recordError } = await supabase
    .from("criminal_records")
    .select(
      "id, suspect_name, national_id, offense_summary, status, version, created_at, last_reviewed_by, created_by",
    )
    .eq("id", recordId)
    .maybeSingle();

  if (recordError) {
    failQuery("Failed to load criminal record detail", recordError.message);
  }

  if (!recordRow) {
    return null;
  }

  const [versionsResult, auditResult] = await Promise.all([
    supabase
      .from("criminal_record_versions")
      .select("id, version, snapshot, decision, note, changed_by, created_at")
      .eq("criminal_record_id", recordRow.id)
      .order("version", { ascending: false }),
    supabase
      .from("audit_logs")
      .select("id, actor_id, entity_type, entity_id, action, details, created_at")
      .eq("entity_type", "criminal_records")
      .eq("entity_id", recordRow.id)
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  if (versionsResult.error) {
    failQuery("Failed to load criminal record versions", versionsResult.error.message);
  }

  if (auditResult.error) {
    failQuery("Failed to load criminal record activity", auditResult.error.message);
  }

  const versions: CriminalRecordVersionRecord[] = (versionsResult.data ?? []).map((row) => {
    const snapshot =
      row.snapshot && typeof row.snapshot === "object"
        ? (row.snapshot as Record<string, unknown>)
        : null;

    return {
      id: row.id,
      version: row.version,
      decision: row.decision,
      note: row.note,
      changedByName: row.changed_by ? userMap.get(row.changed_by)?.fullName ?? null : null,
      createdAt: row.created_at,
      snapshotStatus:
        snapshot && typeof snapshot.status === "string"
          ? (snapshot.status as CriminalRecord["status"])
          : null,
      snapshotOffenseSummary:
        snapshot && typeof snapshot.offense_summary === "string"
          ? snapshot.offense_summary
          : null,
    };
  });

  const activity: AuditLogRecord[] = (auditResult.data ?? []).map((row) => ({
    id: row.id,
    actorName: row.actor_id ? userMap.get(row.actor_id)?.fullName ?? null : null,
    entityType: row.entity_type,
    entityId: row.entity_id,
    action: row.action,
    details:
      typeof row.details === "string"
        ? row.details
        : JSON.stringify(row.details ?? {}, null, 0),
    createdAt: row.created_at,
  }));

  const createdBy = recordRow.created_by ? userMap.get(recordRow.created_by) ?? null : null;
  const lastReviewedBy = recordRow.last_reviewed_by
    ? userMap.get(recordRow.last_reviewed_by) ?? null
    : null;

  return {
    id: recordRow.id,
    suspectName: recordRow.suspect_name,
    nationalId: recordRow.national_id,
    offenseSummary: recordRow.offense_summary,
    status: recordRow.status,
    version: recordRow.version,
    createdAt: recordRow.created_at,
    lastReviewedByName: lastReviewedBy?.fullName ?? null,
    createdById: recordRow.created_by,
    createdByName: createdBy?.fullName ?? null,
    createdByRole: createdBy?.role ?? null,
    createdByBadgeNumber: createdBy?.badgeNumber ?? null,
    createdByStationName: createdBy?.stationName ?? null,
    lastReviewedByRole: lastReviewedBy?.role ?? null,
    lastReviewedByBadgeNumber: lastReviewedBy?.badgeNumber ?? null,
    versions,
    activity,
  };
}

export async function getAuditLogs(): Promise<AuditLogRecord[]> {
  if (!hasSupabaseEnv()) {
    return mockAuditLogs;
  }

  const supabase = await getRequiredSupabaseClient();

  const [logsResult, users] = await Promise.all([
    supabase
      .from("audit_logs")
      .select("id, actor_id, entity_type, entity_id, action, details, created_at")
      .order("created_at", { ascending: false })
      .limit(100),
    getUsers(),
  ]);

  if (logsResult.error || !logsResult.data) {
    failQuery("Failed to load audit logs", logsResult.error?.message);
  }

  const userMap = buildUserMap(users);
  const logRows = logsResult.data ?? [];

  return logRows.map((row) => ({
    id: row.id,
    actorName: row.actor_id ? userMap.get(row.actor_id)?.fullName ?? null : null,
    entityType: row.entity_type,
    entityId: row.entity_id,
    action: row.action,
    details:
      typeof row.details === "string"
        ? row.details
        : JSON.stringify(row.details ?? {}, null, 0),
    createdAt: row.created_at,
  }));
}

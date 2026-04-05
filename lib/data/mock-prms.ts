import type {
  AuditLogRecord,
  CriminalRecordDetailRecord,
  CriminalRecordVersionRecord,
  CaseDetailRecord,
  CaseNoteRecord,
  CaseRecord,
  CriminalRecord,
  DashboardMetrics,
  FirRecord,
  SessionContext,
  UserProfile,
} from "@/lib/types/prms";

export const demoAccounts = [
  {
    email: "admin@prms.local",
    password: "password123",
    role: "admin",
    fullName: "Commissioner Aditi Rao",
    badgeNumber: "ADM-001",
  },
  {
    email: "officer@prms.local",
    password: "password123",
    role: "officer",
    fullName: "Inspector Rahul Mehta",
    badgeNumber: "OFF-219",
  },
  {
    email: "viewer@prms.local",
    password: "password123",
    role: "viewer",
    fullName: "Analyst Sana Khan",
    badgeNumber: "VWR-044",
  },
] as const;

export const mockUsers: UserProfile[] = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    email: "admin@prms.local",
    fullName: "Commissioner Aditi Rao",
    badgeNumber: "ADM-001",
    role: "admin",
    isActive: true,
    stationName: "Central Command",
  },
  {
    id: "22222222-2222-4222-8222-222222222222",
    email: "officer@prms.local",
    fullName: "Inspector Rahul Mehta",
    badgeNumber: "OFF-219",
    role: "officer",
    isActive: true,
    stationName: "North Precinct",
  },
  {
    id: "33333333-3333-4333-8333-333333333333",
    email: "viewer@prms.local",
    fullName: "Analyst Sana Khan",
    badgeNumber: "VWR-044",
    role: "viewer",
    isActive: true,
    stationName: "Data & Records Unit",
  },
  {
    id: "44444444-4444-4444-8444-444444444444",
    email: "officer2@prms.local",
    fullName: "Sub-Inspector Vikram Das",
    badgeNumber: "OFF-302",
    role: "officer",
    isActive: false,
    stationName: "Harbor Division",
  },
];

export const mockFirs: FirRecord[] = [
  {
    id: "f1111111-1111-4111-8111-111111111111",
    firNumber: "FIR-2026-0012",
    title: "Warehouse break-in",
    description: "Unauthorized night entry with missing high-value electronics.",
    incidentDate: "2026-03-29T18:30:00.000Z",
    location: "Dockyard Road, Mumbai",
    complainantName: "Karan Patel",
    status: "under_investigation",
    assignedOfficerId: mockUsers[1].id,
    assignedOfficerName: mockUsers[1].fullName,
    createdById: mockUsers[0].id,
    createdAt: "2026-03-29T19:15:00.000Z",
  },
  {
    id: "f2222222-2222-4222-8222-222222222222",
    firNumber: "FIR-2026-0017",
    title: "Cyber fraud complaint",
    description: "UPI fraud involving mule accounts and cloned support calls.",
    incidentDate: "2026-04-01T07:15:00.000Z",
    location: "Andheri East, Mumbai",
    complainantName: "Neha Singh",
    status: "pending",
    assignedOfficerId: mockUsers[1].id,
    assignedOfficerName: mockUsers[1].fullName,
    createdById: mockUsers[1].id,
    createdAt: "2026-04-01T08:00:00.000Z",
  },
  {
    id: "f3333333-3333-4333-8333-333333333333",
    firNumber: "FIR-2026-0006",
    title: "Vehicle theft",
    description: "SUV theft reported from residential parking premises.",
    incidentDate: "2026-03-12T20:20:00.000Z",
    location: "Powai, Mumbai",
    complainantName: "Aman Verma",
    status: "closed",
    assignedOfficerId: mockUsers[3].id,
    assignedOfficerName: mockUsers[3].fullName,
    createdById: mockUsers[1].id,
    createdAt: "2026-03-12T21:00:00.000Z",
  },
];

export const mockCriminalRecords: CriminalRecord[] = [
  {
    id: "c1111111-1111-4111-8111-111111111111",
    suspectName: "Rizwan Sheikh",
    nationalId: "AADHAR-3381",
    offenseSummary: "Repeat cyber extortion suspect with payment wallet linkage.",
    status: "pending",
    version: 4,
    createdAt: "2026-04-03T06:30:00.000Z",
    lastReviewedByName: null,
  },
  {
    id: "c2222222-2222-4222-8222-222222222222",
    suspectName: "Arjun Nair",
    nationalId: "AADHAR-7721",
    offenseSummary: "Known fence in an organized vehicle dismantling ring.",
    status: "approved",
    version: 7,
    createdAt: "2026-03-26T11:10:00.000Z",
    lastReviewedByName: mockUsers[0].fullName,
  },
  {
    id: "c3333333-3333-4333-8333-333333333333",
    suspectName: "Pooja Menon",
    nationalId: "AADHAR-9014",
    offenseSummary: "Record rejected pending document mismatch verification.",
    status: "rejected",
    version: 2,
    createdAt: "2026-03-31T14:20:00.000Z",
    lastReviewedByName: mockUsers[0].fullName,
  },
];

export const mockCases: CaseRecord[] = [
  {
    id: "k1111111-1111-4111-8111-111111111111",
    caseNumber: "CASE-2026-045",
    firNumber: "FIR-2026-0012",
    title: "Dockyard burglary taskforce",
    summary: "Coordinate CCTV review and vendor interview schedule.",
    priority: "high",
    status: "in_progress",
    leadOfficerName: mockUsers[1].fullName,
    notesCount: 3,
    createdAt: "2026-03-30T04:15:00.000Z",
  },
  {
    id: "k2222222-2222-4222-8222-222222222222",
    caseNumber: "CASE-2026-051",
    firNumber: "FIR-2026-0017",
    title: "UPI fraud escalation",
    summary: "Freeze linked beneficiary accounts and request telecom metadata.",
    priority: "high",
    status: "pending_review",
    leadOfficerName: mockUsers[1].fullName,
    notesCount: 1,
    createdAt: "2026-04-01T12:45:00.000Z",
  },
  {
    id: "k3333333-3333-4333-8333-333333333333",
    caseNumber: "CASE-2026-022",
    firNumber: "FIR-2026-0006",
    title: "Recovered vehicle closure",
    summary: "Insurance release and final closure memo coordination.",
    priority: "medium",
    status: "closed",
    leadOfficerName: mockUsers[3].fullName,
    notesCount: 4,
    createdAt: "2026-03-14T10:05:00.000Z",
  },
];

export const mockCaseNotes: CaseNoteRecord[] = [
  {
    id: "n1111111-1111-4111-8111-111111111111",
    note: "Assigned two field teams to collect CCTV footage from the warehouse perimeter.",
    createdAt: "2026-03-31T09:35:00.000Z",
    createdById: mockUsers[1].id,
    createdByName: mockUsers[1].fullName,
  },
  {
    id: "n2222222-2222-4222-8222-222222222222",
    note: "Requested telecom metadata and flagged linked beneficiary accounts for review.",
    createdAt: "2026-04-01T14:20:00.000Z",
    createdById: mockUsers[1].id,
    createdByName: mockUsers[1].fullName,
  },
  {
    id: "n3333333-3333-4333-8333-333333333333",
    note: "Closure memo prepared and shared with the insurance liaison desk.",
    createdAt: "2026-03-15T10:50:00.000Z",
    createdById: mockUsers[0].id,
    createdByName: mockUsers[0].fullName,
  },
];

export const mockCriminalRecordVersions: Record<string, CriminalRecordVersionRecord[]> = {
  "c1111111-1111-4111-8111-111111111111": [
    {
      id: "v1111111-1111-4111-8111-111111111111",
      version: 4,
      decision: "pending",
      note: null,
      changedByName: mockUsers[1].fullName,
      createdAt: "2026-04-03T06:30:00.000Z",
      snapshotStatus: "pending",
      snapshotOffenseSummary: mockCriminalRecords[0].offenseSummary,
    },
    {
      id: "v1111111-1111-4111-8111-111111111112",
      version: 3,
      decision: "pending",
      note: null,
      changedByName: mockUsers[1].fullName,
      createdAt: "2026-04-02T14:05:00.000Z",
      snapshotStatus: "pending",
      snapshotOffenseSummary: "Expanded payment-wallet links and intermediary account data.",
    },
  ],
  "c2222222-2222-4222-8222-222222222222": [
    {
      id: "v2222222-2222-4222-8222-222222222221",
      version: 7,
      decision: "approved",
      note: null,
      changedByName: mockUsers[0].fullName,
      createdAt: "2026-03-28T10:45:00.000Z",
      snapshotStatus: "approved",
      snapshotOffenseSummary: mockCriminalRecords[1].offenseSummary,
    },
    {
      id: "v2222222-2222-4222-8222-222222222222",
      version: 6,
      decision: "pending",
      note: null,
      changedByName: mockUsers[1].fullName,
      createdAt: "2026-03-27T15:20:00.000Z",
      snapshotStatus: "pending",
      snapshotOffenseSummary: "Known fence with links to dismantling sites under review.",
    },
  ],
  "c3333333-3333-4333-8333-333333333333": [
    {
      id: "v3333333-3333-4333-8333-333333333331",
      version: 2,
      decision: "rejected",
      note: null,
      changedByName: mockUsers[0].fullName,
      createdAt: "2026-03-31T14:20:00.000Z",
      snapshotStatus: "rejected",
      snapshotOffenseSummary: mockCriminalRecords[2].offenseSummary,
    },
  ],
};

export const mockAuditLogs: AuditLogRecord[] = [
  {
    id: 1,
    actorName: mockUsers[0].fullName,
    entityType: "criminal_records",
    entityId: mockCriminalRecords[1].id,
    action: "approve",
    details: "Approved record version 7 after document cross-check.",
    createdAt: "2026-04-04T08:20:00.000Z",
  },
  {
    id: 2,
    actorName: mockUsers[1].fullName,
    entityType: "firs",
    entityId: mockFirs[1].id,
    action: "create",
    details: "Created FIR and routed to cyber fraud desk.",
    createdAt: "2026-04-01T08:00:00.000Z",
  },
  {
    id: 3,
    actorName: mockUsers[0].fullName,
    entityType: "user_profiles",
    entityId: mockUsers[3].id,
    action: "status_change",
    details: "Marked officer inactive pending transfer.",
    createdAt: "2026-03-27T13:50:00.000Z",
  },
  {
    id: 4,
    actorName: mockUsers[1].fullName,
    entityType: "cases",
    entityId: mockCases[0].id,
    action: "add_note",
    details: "Added surveillance review note and assigned two field teams.",
    createdAt: "2026-03-31T09:35:00.000Z",
  },
];

export function getMockCaseByNumber(caseNumber: string): CaseDetailRecord | null {
  const caseItem = mockCases.find((item) => item.caseNumber === caseNumber);

  if (!caseItem) {
    return null;
  }

  const fir = caseItem.firNumber
    ? mockFirs.find((item) => item.firNumber === caseItem.firNumber) ?? null
    : null;
  const leadOfficer = mockUsers.find((user) => user.fullName === caseItem.leadOfficerName) ?? null;
  const notesByCase: Record<string, CaseNoteRecord[]> = {
    "CASE-2026-045": [mockCaseNotes[0]],
    "CASE-2026-051": [mockCaseNotes[1]],
    "CASE-2026-022": [mockCaseNotes[2]],
  };
  const notes = notesByCase[caseItem.caseNumber] ?? [];
  const activity = mockAuditLogs
    .filter(
      (entry) =>
        (entry.entityType === "cases" && entry.entityId === caseItem.id) ||
        (fir && entry.entityType === "firs" && entry.entityId === fir.id),
    )
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));

  return {
    ...caseItem,
    firId: fir?.id ?? null,
    summary: caseItem.summary,
    leadOfficerEmail: leadOfficer?.email ?? null,
    leadOfficerBadgeNumber: leadOfficer?.badgeNumber ?? null,
    leadOfficerStationName: leadOfficer?.stationName ?? null,
    notes,
    activity,
  };
}

export function getMockCriminalRecordById(recordId: string): CriminalRecordDetailRecord | null {
  const record = mockCriminalRecords.find((item) => item.id === recordId);

  if (!record) {
    return null;
  }

  const createdBy = mockUsers[1] ?? null;
  const lastReviewedBy = record.lastReviewedByName
    ? mockUsers.find((user) => user.fullName === record.lastReviewedByName) ?? null
    : null;
  const versions = mockCriminalRecordVersions[record.id] ?? [];
  const activity = mockAuditLogs
    .filter((entry) => entry.entityType === "criminal_records" && entry.entityId === record.id)
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));

  return {
    ...record,
    createdById: createdBy?.id ?? null,
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

export const mockMetrics: DashboardMetrics = {
  totalFirs: mockFirs.length,
  totalCases: mockCases.length,
  pendingApprovals: mockCriminalRecords.filter((record) => record.status === "pending")
    .length,
  activeOfficers: mockUsers.filter(
    (user) => user.role === "officer" && user.isActive,
  ).length,
};

export function getDemoSessionByEmail(email: string): SessionContext | null {
  const profile = mockUsers.find((user) => user.email === email);

  if (!profile) {
    return null;
  }

  return {
    isDemo: true,
    user: profile,
  };
}

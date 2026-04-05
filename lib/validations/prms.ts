import { z } from "zod";

export const createFirSchema = z.object({
  firNumber: z.string().min(4, "FIR number is required."),
  title: z.string().min(4, "Title is required."),
  description: z.string().min(12, "Description must be at least 12 characters."),
  incidentDate: z.string().min(1, "Incident date is required."),
  location: z.string().min(3, "Location is required."),
  complainantName: z.string().min(3, "Complainant name is required."),
  status: z.enum(["draft", "pending", "under_investigation", "closed"]),
  assignedOfficerId: z.string().min(1, "Assigned officer is required."),
});

export const updateFirStatusSchema = z.object({
  firId: z.string().min(1, "FIR ID is required."),
  status: z.enum(["draft", "pending", "under_investigation", "closed"]),
});

export const createCriminalRecordSchema = z.object({
  suspectName: z.string().min(3, "Suspect name is required."),
  nationalId: z.string().min(4, "National ID is required."),
  offenseSummary: z.string().min(12, "Offense summary must be at least 12 characters."),
});

export const reviewCriminalRecordSchema = z.object({
  id: z.string().uuid(),
  version: z.int().positive(),
  decision: z.enum(["approved", "rejected"]),
});

export const createCaseNoteSchema = z.object({
  caseId: z.string().uuid(),
  note: z.string().min(8, "Notes should be at least 8 characters."),
});

export const updateCaseNoteSchema = z.object({
  noteId: z.string().uuid(),
  note: z.string().min(8, "Notes should be at least 8 characters."),
});

export const deleteCaseNoteSchema = z.object({
  noteId: z.string().uuid(),
});

export const updateUserRoleSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum(["admin", "officer", "viewer"]),
});

export const updateUserStatusSchema = z.object({
  userId: z.string().uuid(),
  isActive: z.boolean(),
});

export type CreateFirValues = z.infer<typeof createFirSchema>;
export type UpdateFirStatusValues = z.infer<typeof updateFirStatusSchema>;
export type CreateCriminalRecordValues = z.infer<typeof createCriminalRecordSchema>;
export type ReviewCriminalRecordValues = z.infer<typeof reviewCriminalRecordSchema>;
export type CreateCaseNoteValues = z.infer<typeof createCaseNoteSchema>;
export type UpdateCaseNoteValues = z.infer<typeof updateCaseNoteSchema>;
export type DeleteCaseNoteValues = z.infer<typeof deleteCaseNoteSchema>;
export type UpdateUserRoleValues = z.infer<typeof updateUserRoleSchema>;
export type UpdateUserStatusValues = z.infer<typeof updateUserStatusSchema>;

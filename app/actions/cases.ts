"use server";

import { revalidatePath } from "next/cache";

import { canWriteRecords } from "@/lib/auth/access";
import { getSessionContext } from "@/lib/auth/session";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/types/prms";
import {
  createCaseNoteSchema,
  deleteCaseNoteSchema,
  updateCaseSchema,
  updateCaseNoteSchema,
  type CreateCaseNoteValues,
  type DeleteCaseNoteValues,
  type UpdateCaseValues,
  type UpdateCaseNoteValues,
} from "@/lib/validations/prms";

export async function createCaseNoteAction(
  values: CreateCaseNoteValues,
): Promise<ActionResult> {
  const parsed = createCaseNoteSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Unable to add note.",
    };
  }

  const session = await getSessionContext();

  if (!session || !canWriteRecords(session.user.role)) {
    return {
      success: false,
      message: "You do not have permission to add case notes.",
    };
  }

  if (!hasSupabaseEnv()) {
    return { success: true, message: "Demo mode does not persist case notes." };
  }

  const supabase = await createServerSupabaseClient();

  const { error } = await supabase!.from("case_notes").insert({
    case_id: parsed.data.caseId,
    note: parsed.data.note,
    created_by: session.user.id,
  });

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/cases");
  revalidatePath("/dashboard");
  revalidatePath("/firs");

  return { success: true, message: "Case note added." };
}

export async function updateCaseAction(values: UpdateCaseValues): Promise<ActionResult> {
  const parsed = updateCaseSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Unable to update case.",
    };
  }

  const session = await getSessionContext();

  if (!session || !canWriteRecords(session.user.role)) {
    return {
      success: false,
      message: "You do not have permission to update cases.",
    };
  }

  if (!hasSupabaseEnv()) {
    return { success: true, message: "Demo mode does not persist case changes." };
  }

  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase!
    .from("cases")
    .update({
      title: parsed.data.title,
      summary: parsed.data.summary,
      priority: parsed.data.priority,
      status: parsed.data.status,
      lead_officer_id: parsed.data.leadOfficerId,
    })
    .eq("id", parsed.data.caseId)
    .select("id, case_number")
    .maybeSingle();

  if (error) {
    return { success: false, message: error.message };
  }

  if (!data) {
    return {
      success: false,
      message: "Only admins, lead officers, or creators can edit this case.",
    };
  }

  revalidatePath("/cases");
  revalidatePath("/dashboard");
  revalidatePath("/firs");
  revalidatePath(`/cases/${encodeURIComponent(data.case_number)}`);

  return { success: true, message: "Case details updated." };
}

export async function updateCaseNoteAction(
  values: UpdateCaseNoteValues,
): Promise<ActionResult> {
  const parsed = updateCaseNoteSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Unable to update note.",
    };
  }

  const session = await getSessionContext();

  if (!session || !canWriteRecords(session.user.role)) {
    return {
      success: false,
      message: "You do not have permission to update case notes.",
    };
  }

  if (!hasSupabaseEnv()) {
    return { success: true, message: "Demo mode does not persist note changes." };
  }

  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase!
    .from("case_notes")
    .update({ note: parsed.data.note })
    .eq("id", parsed.data.noteId)
    .select("id")
    .maybeSingle();

  if (error) {
    return { success: false, message: error.message };
  }

  if (!data) {
    return {
      success: false,
      message: "Only admins or the original author can edit this note.",
    };
  }

  revalidatePath("/cases");
  revalidatePath("/dashboard");
  revalidatePath("/firs");

  return { success: true, message: "Case note updated." };
}

export async function deleteCaseNoteAction(
  values: DeleteCaseNoteValues,
): Promise<ActionResult> {
  const parsed = deleteCaseNoteSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Unable to delete note.",
    };
  }

  const session = await getSessionContext();

  if (!session || !canWriteRecords(session.user.role)) {
    return {
      success: false,
      message: "You do not have permission to delete case notes.",
    };
  }

  if (!hasSupabaseEnv()) {
    return { success: true, message: "Demo mode does not persist note deletion." };
  }

  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase!
    .from("case_notes")
    .delete()
    .eq("id", parsed.data.noteId)
    .select("id")
    .maybeSingle();

  if (error) {
    return { success: false, message: error.message };
  }

  if (!data) {
    return {
      success: false,
      message: "Only admins or the original author can delete this note.",
    };
  }

  revalidatePath("/cases");
  revalidatePath("/dashboard");
  revalidatePath("/firs");

  return { success: true, message: "Case note deleted." };
}

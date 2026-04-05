"use server";

import { revalidatePath } from "next/cache";

import { canWriteRecords } from "@/lib/auth/access";
import { getSessionContext } from "@/lib/auth/session";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/types/prms";
import { createCaseNoteSchema, type CreateCaseNoteValues } from "@/lib/validations/prms";

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

  return { success: true, message: "Case note added." };
}

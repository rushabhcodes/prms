"use server";

import { revalidatePath } from "next/cache";

import { canReviewRecords, canWriteRecords } from "@/lib/auth/access";
import { getSessionContext } from "@/lib/auth/session";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/types/prms";
import {
  createCriminalRecordSchema,
  reviewCriminalRecordSchema,
  type CreateCriminalRecordValues,
  type ReviewCriminalRecordValues,
} from "@/lib/validations/prms";

export async function createCriminalRecordAction(
  values: CreateCriminalRecordValues,
): Promise<ActionResult> {
  const parsed = createCriminalRecordSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Unable to create record.",
    };
  }

  const session = await getSessionContext();

  if (!session || !canWriteRecords(session.user.role)) {
    return {
      success: false,
      message: "You do not have permission to create criminal records.",
    };
  }

  if (!hasSupabaseEnv()) {
    return {
      success: true,
      message: "Demo mode does not persist criminal records.",
    };
  }

  const supabase = await createServerSupabaseClient();

  const { error } = await supabase!.from("criminal_records").insert({
    suspect_name: parsed.data.suspectName,
    national_id: parsed.data.nationalId,
    offense_summary: parsed.data.offenseSummary,
    version: 1,
    created_by: session.user.id,
  });

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/criminal-records");
  revalidatePath("/dashboard");

  return { success: true, message: "Criminal record added successfully." };
}

export async function reviewCriminalRecordAction(
  values: ReviewCriminalRecordValues,
): Promise<ActionResult> {
  const parsed = reviewCriminalRecordSchema.safeParse(values);

  if (!parsed.success) {
    return { success: false, message: "Invalid review request." };
  }

  const session = await getSessionContext();

  if (!session || !canReviewRecords(session.user.role)) {
    return {
      success: false,
      message: "Only admins can review criminal records.",
    };
  }

  if (!hasSupabaseEnv()) {
    return {
      success: true,
      message: `Demo mode does not persist ${parsed.data.decision} decisions.`,
    };
  }

  const supabase = await createServerSupabaseClient();

  const { data: updatedRecord, error } = await supabase!
    .from("criminal_records")
    .update({
      status: parsed.data.decision,
      last_reviewed_by: session.user.id,
      version: parsed.data.version + 1,
    })
    .eq("id", parsed.data.id)
    .eq("status", "pending")
    .eq("version", parsed.data.version)
    .select("id")
    .maybeSingle();

  if (error) {
    return { success: false, message: error.message };
  }

  if (!updatedRecord) {
    return {
      success: false,
      message:
        "This record changed before your review was applied. Refresh and try again.",
    };
  }

  revalidatePath("/criminal-records");
  revalidatePath("/dashboard");

  return {
    success: true,
    message: `Record ${parsed.data.decision}.`,
  };
}

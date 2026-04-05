"use server";

import { revalidatePath } from "next/cache";

import { canWriteRecords } from "@/lib/auth/access";
import { getSessionContext } from "@/lib/auth/session";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/types/prms";
import {
  createFirSchema,
  updateFirDetailsSchema,
  updateFirStatusSchema,
  type CreateFirValues,
  type UpdateFirDetailsValues,
  type UpdateFirStatusValues,
} from "@/lib/validations/prms";

export async function createFirAction(values: CreateFirValues): Promise<ActionResult> {
  const parsed = createFirSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Unable to create FIR.",
    };
  }

  const session = await getSessionContext();

  if (!session || !canWriteRecords(session.user.role)) {
    return {
      success: false,
      message: "You do not have permission to create FIRs.",
    };
  }

  if (!hasSupabaseEnv()) {
    return { success: true, message: "Demo mode does not persist new FIRs." };
  }

  const supabase = await createServerSupabaseClient();

  const { error } = await supabase!.from("firs").insert({
    fir_number: parsed.data.firNumber,
    title: parsed.data.title,
    description: parsed.data.description,
    incident_date: parsed.data.incidentDate,
    location: parsed.data.location,
    complainant_name: parsed.data.complainantName,
    status: parsed.data.status,
    assigned_officer_id: parsed.data.assignedOfficerId,
    created_by: session.user.id,
  });

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/firs");
  revalidatePath("/dashboard");

  return { success: true, message: "FIR created successfully." };
}

export async function updateFirStatusAction(
  values: UpdateFirStatusValues,
): Promise<ActionResult> {
  const parsed = updateFirStatusSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Invalid FIR status update.",
    };
  }

  const session = await getSessionContext();

  if (!session || !canWriteRecords(session.user.role)) {
    return {
      success: false,
      message: "You do not have permission to update FIR status.",
    };
  }

  if (!hasSupabaseEnv()) {
    return { success: true, message: "Demo mode does not persist FIR status changes." };
  }

  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase!
    .from("firs")
    .update({
      status: parsed.data.status,
    })
    .eq("id", parsed.data.firId)
    .select("id")
    .maybeSingle();

  if (error) {
    return { success: false, message: error.message };
  }

  if (!data) {
    return {
      success: false,
      message: "You can only update FIRs assigned to you or created by you.",
    };
  }

  revalidatePath("/firs");
  revalidatePath("/dashboard");

  return { success: true, message: "FIR status updated." };
}

export async function updateFirDetailsAction(
  values: UpdateFirDetailsValues,
): Promise<ActionResult> {
  const parsed = updateFirDetailsSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Invalid FIR update.",
    };
  }

  const session = await getSessionContext();

  if (!session || !canWriteRecords(session.user.role)) {
    return {
      success: false,
      message: "You do not have permission to update FIR details.",
    };
  }

  if (!hasSupabaseEnv()) {
    return { success: true, message: "Demo mode does not persist FIR changes." };
  }

  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase!
    .from("firs")
    .update({
      title: parsed.data.title,
      description: parsed.data.description,
      incident_date: parsed.data.incidentDate,
      location: parsed.data.location,
      complainant_name: parsed.data.complainantName,
      status: parsed.data.status,
      assigned_officer_id: parsed.data.assignedOfficerId,
    })
    .eq("id", parsed.data.firId)
    .select("id, fir_number")
    .maybeSingle();

  if (error) {
    return { success: false, message: error.message };
  }

  if (!data) {
    return {
      success: false,
      message: "Only admins, assignees, or creators can edit this FIR.",
    };
  }

  revalidatePath("/firs");
  revalidatePath("/dashboard");
  revalidatePath(`/firs/${encodeURIComponent(data.fir_number)}`);

  return { success: true, message: "FIR details updated." };
}

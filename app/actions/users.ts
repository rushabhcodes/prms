"use server";

import { revalidatePath } from "next/cache";

import { canManageUsers } from "@/lib/auth/access";
import { getSessionContext } from "@/lib/auth/session";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/types/prms";
import {
  updateUserRoleSchema,
  updateUserStatusSchema,
  type UpdateUserRoleValues,
  type UpdateUserStatusValues,
} from "@/lib/validations/prms";

async function ensureAdmin() {
  const session = await getSessionContext();

  if (!session || !canManageUsers(session.user.role)) {
    throw new Error("You do not have permission to manage users.");
  }

  return session;
}

export async function updateUserRoleAction(
  values: UpdateUserRoleValues,
): Promise<ActionResult> {
  const parsed = updateUserRoleSchema.safeParse(values);

  if (!parsed.success) {
    return { success: false, message: "Invalid role update request." };
  }

  try {
    await ensureAdmin();
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unauthorized request.",
    };
  }

  if (!hasSupabaseEnv()) {
    return { success: true, message: "Demo mode does not persist user role changes." };
  }

  const supabase = await createServerSupabaseClient();

  const { error } = await supabase!.from("user_profiles").update({
    role: parsed.data.role,
  }).eq("id", parsed.data.userId);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/users");

  return { success: true, message: "User role updated." };
}

export async function updateUserStatusAction(
  values: UpdateUserStatusValues,
): Promise<ActionResult> {
  const parsed = updateUserStatusSchema.safeParse(values);

  if (!parsed.success) {
    return { success: false, message: "Invalid user status request." };
  }

  try {
    await ensureAdmin();
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unauthorized request.",
    };
  }

  if (!hasSupabaseEnv()) {
    return { success: true, message: "Demo mode does not persist user status changes." };
  }

  const supabase = await createServerSupabaseClient();

  const { error } = await supabase!.from("user_profiles").update({
    is_active: parsed.data.isActive,
  }).eq("id", parsed.data.userId);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/users");

  return { success: true, message: "User status updated." };
}

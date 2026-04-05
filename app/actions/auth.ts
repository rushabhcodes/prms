"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getDemoCookieNames } from "@/lib/auth/session";
import { demoAccounts } from "@/lib/data/mock-prms";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/types/prms";
import { loginSchema, type LoginValues } from "@/lib/validations/auth";

export async function loginAction(values: LoginValues): Promise<ActionResult> {
  const parsed = loginSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Unable to sign in.",
    };
  }

  if (!hasSupabaseEnv()) {
    const account = demoAccounts.find(
      (entry) =>
        entry.email === parsed.data.email && entry.password === parsed.data.password,
    );

    if (!account) {
      return {
        success: false,
        message:
          "Demo sign-in failed. Use admin@prms.local, officer@prms.local, or viewer@prms.local with password123.",
      };
    }

    const cookieStore = await cookies();
    const demoCookies = getDemoCookieNames();

    cookieStore.set(demoCookies.email, account.email, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/",
    });
    cookieStore.set(demoCookies.role, account.role, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/",
    });

    revalidatePath("/", "layout");

    return {
      success: true,
      message: `Signed in to demo mode as ${account.role}.`,
    };
  }

  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return {
      success: false,
      message: "Supabase is not configured.",
    };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  revalidatePath("/", "layout");

  return {
    success: true,
    message: "Signed in successfully.",
  };
}

export async function signOutAction() {
  if (!hasSupabaseEnv()) {
    const cookieStore = await cookies();
    const demoCookies = getDemoCookieNames();

    cookieStore.delete(demoCookies.email);
    cookieStore.delete(demoCookies.role);
  } else {
    const supabase = await createServerSupabaseClient();
    await supabase?.auth.signOut();
  }

  revalidatePath("/", "layout");
  redirect("/login");
}

import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";

import { getDemoSessionByEmail } from "@/lib/data/mock-prms";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import type { SessionContext } from "@/lib/types/prms";

const DEMO_EMAIL_COOKIE = "prms-demo-email";
const DEMO_ROLE_COOKIE = "prms-demo-role";

function isBuildPhase() {
  return process.env.NEXT_PHASE === "phase-production-build";
}

export const getSessionContext = cache(async (): Promise<SessionContext | null> => {
  const cookieStore = await cookies();

  if (!hasSupabaseEnv()) {
    const email = cookieStore.get(DEMO_EMAIL_COOKIE)?.value;
    const role = cookieStore.get(DEMO_ROLE_COOKIE)?.value;

    if (!email || !role) {
      return null;
    }

    return getDemoSessionByEmail(email);
  }

  if (isBuildPhase()) {
    return null;
  }

  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return null;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("id, email, full_name, badge_number, role, is_active, station_name")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || !profile.is_active) {
    return null;
  }

  return {
    isDemo: false,
    user: {
      id: profile.id,
      email: profile.email || user.email || "",
      fullName: profile.full_name,
      badgeNumber: profile.badge_number,
      role: profile.role,
      isActive: profile.is_active,
      stationName: profile.station_name,
    },
  };
});

export function getDemoCookieNames() {
  return {
    email: DEMO_EMAIL_COOKIE,
    role: DEMO_ROLE_COOKIE,
  };
}

import { redirect } from "next/navigation";

import { LoginForm } from "@/app/(auth)/login/login-form";
import { getSessionContext } from "@/lib/auth/session";
import { hasSupabaseEnv } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const session = await getSessionContext();

  if (session) {
    redirect("/dashboard");
  }

  return <LoginForm isDemo={!hasSupabaseEnv()} />;
}

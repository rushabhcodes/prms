import type { NextRequest } from "next/server";

import { updateSupabaseSession } from "@/lib/supabase/proxy";

export async function updateSession(request: NextRequest) {
  const { response } = await updateSupabaseSession(request);

  return response;
}

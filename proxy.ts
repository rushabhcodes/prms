import { NextResponse, type NextRequest } from "next/server";

import { getDemoCookieNames } from "@/lib/auth/session";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { updateSupabaseSession } from "@/lib/supabase/proxy";

const protectedPrefixes = [
  "/dashboard",
  "/firs",
  "/criminal-records",
  "/cases",
  "/users",
  "/audit-logs",
];

function isProtectedRoute(pathname: string) {
  return protectedPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoginRoute = pathname === "/login";
  const requiresAuth = isProtectedRoute(pathname);

  if (!hasSupabaseEnv()) {
    const demoCookies = getDemoCookieNames();
    const isAuthenticated =
      Boolean(request.cookies.get(demoCookies.email)?.value) &&
      Boolean(request.cookies.get(demoCookies.role)?.value);

    if (requiresAuth && !isAuthenticated) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (isLoginRoute && isAuthenticated) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  }

  const { response, user } = await updateSupabaseSession(request);

  if (requiresAuth && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isLoginRoute && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/login",
    "/dashboard/:path*",
    "/firs/:path*",
    "/criminal-records/:path*",
    "/cases/:path*",
    "/users/:path*",
    "/audit-logs/:path*",
  ],
};

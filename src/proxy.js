import { NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

/**
 * Protects private frontend routes (dashboard + payment).
 * Public routes: /, /recipes, /recipes/[id], /login, /register
 */
export async function proxy(request) {
  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/payment/:path*"],
};

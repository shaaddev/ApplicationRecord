import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const protectedPrefixes = ["/application-record"];
const authPages = ["/login", "/signup"];

/**
 * Optimistic gate: only looks at the session cookie so it stays cheap on
 * prefetches. Pages under the protected prefixes still verify the session
 * against the database before rendering anything.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSessionCookie = getSessionCookie(request) !== null;

  if (protectedPrefixes.some((p) => pathname.startsWith(p)) && !hasSessionCookie) {
    const login = new URL("/login", request.nextUrl);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  if (authPages.includes(pathname) && hasSessionCookie) {
    return NextResponse.redirect(new URL("/application-record", request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/application-record/:path*", "/login", "/signup"],
};

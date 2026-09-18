import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const roleCookie = request.cookies.get("krishibuddy_role");
  const role = roleCookie?.value;

  // Public paths that do not require any authentication
  const isPublicPath =
    pathname === "/" ||
    pathname === "/auth" ||
    pathname.startsWith("/api/weather") ||
    pathname.startsWith("/api/satellite-data") ||
    pathname.startsWith("/api/crop-advisory") ||
    pathname.startsWith("/api/disease-detect") ||
    pathname.startsWith("/api/state-api") ||
    pathname === "/manifest.json" ||
    pathname === "/sw.js" ||
    pathname.startsWith("/icons") ||
    pathname.startsWith("/images");

  if (!isPublicPath) {
    // If no role cookie exists, redirect to /auth
    if (!role) {
      const loginUrl = new URL("/auth", request.url);
      loginUrl.searchParams.set("returnUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Role-specific route boundaries
    if (pathname.startsWith("/state-portal") && role === "farmer") {
      // Farmers trying to access State Portal are gently redirected to Dashboard
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};

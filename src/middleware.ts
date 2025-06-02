import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: ["/admin/:path*", "/login"],
  runtime: "experimental-edge",
};

export async function middleware(request: NextRequest) {
  const authCookie = request.cookies.get("__session");

  // If trying to access admin pages without auth, redirect to login
  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!authCookie?.value) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // If trying to access login page while authenticated, redirect to admin
  if (request.nextUrl.pathname === "/login") {
    if (authCookie?.value) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

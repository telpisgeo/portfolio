import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE, verifySessionToken } from "@/lib/admin-session";

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const authed = verifySessionToken(session);

  if (pathname.startsWith("/api/admin")) {
    if (pathname === "/api/admin/login" || pathname === "/api/admin/logout") return NextResponse.next();
    if (!authed) {
      return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      if (authed) return NextResponse.redirect(new URL("/admin", request.url));
      return NextResponse.next();
    }
    if (!authed) return NextResponse.redirect(new URL("/admin/login", request.url));
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

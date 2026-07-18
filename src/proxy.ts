import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE, verifySessionToken } from "@/lib/admin-session";

// First path segment → the locale served by the root layout. Anything that
// isn't a known locale (e.g. /admin, /sandbox, the "/" redirect) falls back to
// "uk", which matches the site's default and the admin UI language.
function localeFromPath(pathname: string): "uk" | "en" {
  const seg = pathname.split("/")[1];
  return seg === "en" ? "en" : "uk";
}

// Forward the resolved locale to Server Components via a request header so the
// root <html lang> can be set correctly without the layout knowing the route.
function withLocaleHeader(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.set("x-locale", localeFromPath(request.nextUrl.pathname));
  return NextResponse.next({ request: { headers } });
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // The old eschool case page was removed — 301 the old URL to the current
  // design so any indexed links keep their value.
  const eschoolOld = pathname.match(/^\/(uk|en)\/cases\/eschool$/);
  if (eschoolOld) {
    return NextResponse.redirect(new URL(`/${eschoolOld[1]}/cases/eschool-2`, request.url), 301);
  }

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

  return withLocaleHeader(request);
}

export const config = {
  // Run on admin/api (auth) and on all page routes (locale header), while
  // skipping Next internals and static asset files.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.[^/]+$).*)"],
};

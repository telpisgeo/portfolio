import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, ADMIN_SESSION_MAX_AGE, createSessionToken, safeEqual } from "@/lib/admin-session";

export async function POST(req: NextRequest) {
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  if (!ADMIN_PASSWORD) {
    return NextResponse.json({ error: "ADMIN_PASSWORD не налаштований" }, { status: 500 });
  }
  if (!process.env.ADMIN_SESSION_SECRET) {
    return NextResponse.json({ error: "ADMIN_SESSION_SECRET не налаштований" }, { status: 500 });
  }

  const body = await req.json().catch(() => null);
  const password = body?.password;

  if (typeof password !== "string" || !safeEqual(password, ADMIN_PASSWORD)) {
    return NextResponse.json({ error: "Невірний пароль" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_SESSION_COOKIE, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE,
  });
  return res;
}

import { createHmac, timingSafeEqual } from "crypto";

export const ADMIN_SESSION_COOKIE = "admin_session";
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days, in seconds

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("ADMIN_SESSION_SECRET не налаштований");
  return secret;
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

export function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) {
    timingSafeEqual(ba, ba); // consume time, keep constant-time behavior
    return false;
  }
  return timingSafeEqual(ba, bb);
}

export function createSessionToken(): string {
  const expires = Date.now() + ADMIN_SESSION_MAX_AGE * 1000;
  const payload = String(expires);
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  try {
    const dot = token.lastIndexOf(".");
    if (dot === -1) return false;
    const payload = token.slice(0, dot);
    const signature = token.slice(dot + 1);
    if (!payload || !signature || !safeEqual(signature, sign(payload))) return false;

    const expires = Number(payload);
    return Number.isFinite(expires) && Date.now() <= expires;
  } catch {
    // Misconfigured ADMIN_SESSION_SECRET should fail closed, not crash the request.
    return false;
  }
}

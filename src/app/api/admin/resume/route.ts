import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, verifySessionToken } from "@/lib/admin-session";
import { commitFiles } from "@/lib/github-commit";

const DATA_URL_RE = /^data:application\/pdf;base64,(.+)$/;

// Overwrites the existing files so every cvUrl on the site keeps working.
const RESUME_PATHS: Record<string, string> = {
  ua: "public/Georgiy_Telpis_uxui_(product)_designer-ua.pdf",
  en: "public/Georgiy_Telpis_uxui_(product)_designer-en.pdf",
};

// Base64 adds ~33% overhead; keep the request body under Vercel's 4.5MB limit.
const MAX_BYTES = 3 * 1024 * 1024;

export async function POST(req: NextRequest) {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  if (!GITHUB_TOKEN) return NextResponse.json({ error: "GITHUB_TOKEN не налаштований" }, { status: 500 });

  const session = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (!verifySessionToken(session)) {
    return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });
  }

  const { locale, data } = (await req.json()) ?? {};
  const path = typeof locale === "string" ? RESUME_PATHS[locale] : undefined;
  if (!path) return NextResponse.json({ error: "Невірна мова" }, { status: 400 });
  if (typeof data !== "string") return NextResponse.json({ error: "Немає файлу" }, { status: 400 });

  const match = data.match(DATA_URL_RE);
  if (!match) return NextResponse.json({ error: "Потрібен PDF-файл" }, { status: 400 });
  const buffer = Buffer.from(match[1], "base64");
  if (buffer.byteLength > MAX_BYTES) {
    return NextResponse.json({ error: "Файл завеликий (макс. 3MB)" }, { status: 400 });
  }
  if (buffer.subarray(0, 4).toString() !== "%PDF") {
    return NextResponse.json({ error: "Файл не є валідним PDF" }, { status: 400 });
  }

  try {
    await commitFiles(
      GITHUB_TOKEN,
      { [path]: { content: match[1], encoding: "base64" } },
      `Update ${locale.toUpperCase()} resume via admin panel`
    );
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Помилка збереження в GitHub" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

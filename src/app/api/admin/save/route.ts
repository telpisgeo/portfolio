import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";

const GITHUB_REPO = "telpisgeo/portfolio";
const CONTENT_PATH = "src/data/content.json";
const IMAGE_PATH_RE = /^\/images\/[A-Za-z0-9_\-./]+\.(webp|png|jpg|jpeg|svg)$/;
const ALLOWED_SLUGS = ["eschool", "westudy", "snovio"];

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) {
    timingSafeEqual(ba, ba); // consume time
    return false;
  }
  return timingSafeEqual(ba, bb);
}

function validateImagePath(img: unknown): string | null {
  if (typeof img !== "string" || !IMAGE_PATH_RE.test(img)) return `Невірний шлях: ${img}`;
  return null;
}

function validateContent(content: unknown): string | null {
  if (!content || typeof content !== "object") return "Невірна структура";
  const c = content as Record<string, unknown>;
  for (const locale of ["uk", "en"]) {
    const loc = c[locale] as Record<string, unknown> | undefined;
    if (!loc || !Array.isArray(loc.companies)) return `Невірна структура для ${locale}`;
    for (const company of loc.companies as unknown[]) {
      if (!company || typeof company !== "object") return "Невірна компанія";
      const co = company as Record<string, unknown>;
      if (!ALLOWED_SLUGS.includes(co.slug as string)) return `Невідомий slug: ${co.slug}`;
      if (typeof co.description !== "string" || co.description.length > 2000) return "Опис занадто довгий";
      if (!Array.isArray(co.imageRows)) return "imageRows має бути масивом";
      for (const row of co.imageRows as unknown[]) {
        if (Array.isArray(row)) {
          for (const img of row as unknown[]) {
            const err = validateImagePath(img);
            if (err) return err;
          }
        } else {
          const err = validateImagePath(row);
          if (err) return err;
        }
      }
    }
  }
  return null;
}

export async function POST(req: NextRequest) {
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

  if (!ADMIN_PASSWORD) return NextResponse.json({ error: "ADMIN_PASSWORD не налаштований" }, { status: 500 });
  if (!GITHUB_TOKEN) return NextResponse.json({ error: "GITHUB_TOKEN не налаштований" }, { status: 500 });

  const body = await req.json();
  const { password, content } = body;

  if (!password || !safeEqual(password, ADMIN_PASSWORD)) {
    return NextResponse.json({ error: "Невірний пароль" }, { status: 401 });
  }

  const validationError = validateContent(content);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const fileRes = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/contents/${CONTENT_PATH}`,
    { headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, "User-Agent": "portfolio-admin" } }
  );

  if (!fileRes.ok) {
    return NextResponse.json({ error: "Не вдалося отримати файл з GitHub" }, { status: 500 });
  }

  const fileData = await fileRes.json();

  const updateRes = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/contents/${CONTENT_PATH}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
        "User-Agent": "portfolio-admin",
      },
      body: JSON.stringify({
        message: "Update site content via admin panel",
        content: Buffer.from(JSON.stringify(content, null, 2)).toString("base64"),
        sha: fileData.sha,
      }),
    }
  );

  if (!updateRes.ok) {
    const err = await updateRes.json();
    return NextResponse.json({ error: err.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

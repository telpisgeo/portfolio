import { NextRequest, NextResponse } from "next/server";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "admin123";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN ?? "";
const GITHUB_REPO = "telpisgeo/portfolio";
const CONTENT_PATH = "src/data/content.json";

export async function POST(req: NextRequest) {
  const { password, content } = await req.json();

  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Невірний пароль" }, { status: 401 });
  }

  if (!GITHUB_TOKEN) {
    return NextResponse.json({ error: "GITHUB_TOKEN не налаштований" }, { status: 500 });
  }

  // Get current file SHA from GitHub
  const fileRes = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/contents/${CONTENT_PATH}`,
    { headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, "User-Agent": "portfolio-admin" } }
  );

  if (!fileRes.ok) {
    return NextResponse.json({ error: "Не вдалося отримати файл з GitHub" }, { status: 500 });
  }

  const fileData = await fileRes.json();
  const sha = fileData.sha;

  // Update file on GitHub
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
        sha,
      }),
    }
  );

  if (!updateRes.ok) {
    const err = await updateRes.json();
    return NextResponse.json({ error: err.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

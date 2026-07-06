import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { ADMIN_SESSION_COOKIE, verifySessionToken } from "@/lib/admin-session";
import { commitFiles } from "@/lib/github-commit";

const NAME_RE = /^[a-z0-9-]+$/;
const DATA_URL_RE = /^data:([^;]+);base64,(.+)$/;

const ALLOWED_MIME_EXT: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
};

// Base64 adds ~33% overhead, so a 3MB source file becomes a ~4MB request
// body — safely under Vercel's 4.5MB Functions body limit. Anything larger
// (video) goes through the Vercel Blob upload path instead.
const MAX_BYTES = 3 * 1024 * 1024;

export async function POST(req: NextRequest) {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  if (!GITHUB_TOKEN) return NextResponse.json({ error: "GITHUB_TOKEN не налаштований" }, { status: 500 });

  const session = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (!verifySessionToken(session)) {
    return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });
  }

  const body = await req.json();
  const { dir, filename, data } = body ?? {};

  if (typeof dir !== "string" || !NAME_RE.test(dir)) {
    return NextResponse.json({ error: `Невірна тека: ${dir}` }, { status: 400 });
  }
  if (typeof filename !== "string" || !NAME_RE.test(filename)) {
    return NextResponse.json({ error: `Невірна назва файлу: ${filename}` }, { status: 400 });
  }
  if (typeof data !== "string") {
    return NextResponse.json({ error: "Немає файлу" }, { status: 400 });
  }

  const match = data.match(DATA_URL_RE);
  if (!match) return NextResponse.json({ error: "Невірний формат файлу" }, { status: 400 });
  const [, mime, base64] = match;
  const ext = ALLOWED_MIME_EXT[mime];
  if (!ext) return NextResponse.json({ error: `Непідтримуваний тип файлу: ${mime}` }, { status: 400 });

  const inputBuffer = Buffer.from(base64, "base64");
  if (inputBuffer.byteLength > MAX_BYTES) {
    return NextResponse.json({ error: "Файл завеликий (макс. 8MB)" }, { status: 400 });
  }

  let outExt = ext;
  let outBase64 = base64;
  let width: number | undefined;
  let height: number | undefined;

  if (ext !== "svg") {
    try {
      const image = sharp(inputBuffer);
      const metadata = await image.metadata();
      width = metadata.width;
      height = metadata.height;
      const webpBuffer = await image.webp({ quality: 85 }).toBuffer();
      outExt = "webp";
      outBase64 = webpBuffer.toString("base64");
    } catch {
      return NextResponse.json({ error: "Не вдалося обробити зображення" }, { status: 400 });
    }
  }

  const path = `public/images/works/${dir}/${filename}.${outExt}`;
  const publicPath = `/images/works/${dir}/${filename}.${outExt}`;

  try {
    await commitFiles(
      GITHUB_TOKEN,
      { [path]: { content: outBase64, encoding: "base64" } },
      `Add image ${publicPath} via admin panel`
    );
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Помилка збереження в GitHub" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, path: publicPath, width, height });
}

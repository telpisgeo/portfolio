import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, verifySessionToken } from "@/lib/admin-session";
import { commitFiles } from "@/lib/github-commit";
import { STATIC_CASE_SLUGS, listCaseSlugs, readCaseFile, type CaseFile } from "@/lib/case-store";
import type { CaseContent } from "@/lib/case-blocks";

const SLUG_RE = /^[a-z0-9-]+$/;

function emptyCaseContent(): CaseContent {
  return { eyebrow: "", title: "", steps: [], blocks: [] };
}

export async function GET(req: NextRequest) {
  const session = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (!verifySessionToken(session)) {
    return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });
  }

  const cases = listCaseSlugs().map((slug) => {
    const file = readCaseFile(slug);
    return {
      slug,
      status: file?.status ?? "published",
      ukTitle: file?.uk.title ?? "",
      enTitle: file?.en.title ?? "",
    };
  });
  return NextResponse.json({ cases });
}

export async function POST(req: NextRequest) {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  if (!GITHUB_TOKEN) return NextResponse.json({ error: "GITHUB_TOKEN не налаштований" }, { status: 500 });

  const session = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (!verifySessionToken(session)) {
    return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });
  }

  const body = await req.json();
  const slug = body?.slug;
  const duplicateFrom = body?.duplicateFrom;

  if (typeof slug !== "string" || !SLUG_RE.test(slug)) {
    return NextResponse.json({ error: `Невірний slug: ${slug}` }, { status: 400 });
  }
  if (STATIC_CASE_SLUGS.has(slug) || listCaseSlugs().includes(slug)) {
    return NextResponse.json({ error: `Кейс "${slug}" вже існує` }, { status: 400 });
  }

  let caseFile: CaseFile;
  if (duplicateFrom !== undefined) {
    if (typeof duplicateFrom !== "string") {
      return NextResponse.json({ error: "Невірний duplicateFrom" }, { status: 400 });
    }
    const source = readCaseFile(duplicateFrom);
    if (!source) return NextResponse.json({ error: `Кейс "${duplicateFrom}" не знайдено` }, { status: 404 });
    caseFile = { ...source, status: "draft" };
  } else {
    caseFile = { status: "draft", uk: emptyCaseContent(), en: emptyCaseContent() };
  }

  try {
    await commitFiles(
      GITHUB_TOKEN,
      { [`src/data/cases/${slug}.json`]: JSON.stringify(caseFile, null, 2) + "\n" },
      `Add case ${slug} via admin panel`
    );
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Помилка збереження в GitHub" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, verifySessionToken } from "@/lib/admin-session";
import { commitFiles } from "@/lib/github-commit";
import { STATIC_CASE_SLUGS } from "@/lib/case-store";

const IMAGE_PATH_RE = /^\/images\/[A-Za-z0-9_\-./ ]+\.(webp|png|jpg|jpeg|svg|webm|gif)$/;
const CASE_URL_RE = /^\/(uk|en)\/cases\/[a-z0-9-]+$/;
const SLUG_RE = /^[a-z0-9-]+$/;
const CASE_FILE_RE = /^src\/data\/cases\/([a-z0-9-]+)\.json$/;

function isString(v: unknown): v is string {
  return typeof v === "string";
}

function validateImagePath(img: unknown): string | null {
  if (!isString(img) || !IMAGE_PATH_RE.test(img)) return `Невірний шлях до зображення: ${img}`;
  return null;
}

function validateImageRows(rows: unknown): string | null {
  if (!Array.isArray(rows)) return "imageRows має бути масивом";
  for (const row of rows) {
    if (Array.isArray(row)) {
      for (const img of row) {
        const err = validateImagePath(img);
        if (err) return err;
      }
    } else {
      const err = validateImagePath(row);
      if (err) return err;
    }
  }
  return null;
}

function validateCompany(company: unknown): string | null {
  if (!company || typeof company !== "object") return "Невірна компанія";
  const c = company as Record<string, unknown>;
  if (!isString(c.slug) || !SLUG_RE.test(c.slug)) return `Невірний slug: ${c.slug}`;
  if (!isString(c.name) || c.name.length > 200) return "Невірна назва компанії";
  if (!isString(c.url) || c.url.length > 500) return "Невірне посилання";
  if (!isString(c.period) || c.period.length > 100) return "Невірний період";
  if (!isString(c.description) || c.description.length > 3000) return "Опис занадто довгий";
  if (c.caseUrl !== undefined && (!isString(c.caseUrl) || !CASE_URL_RE.test(c.caseUrl))) return `Невірне посилання на кейс: ${c.caseUrl}`;
  if (c.casePending !== undefined && typeof c.casePending !== "boolean") return "casePending має бути булевим";
  if (c.productType !== undefined && !isString(c.productType)) return "Невірний тип продукту";
  if (c.role !== undefined && !isString(c.role)) return "Невірна роль";
  if (c.tools !== undefined && !isString(c.tools)) return "Невірні інструменти";
  if (c.icon !== undefined) {
    const err = validateImagePath(c.icon);
    if (err) return err;
  }
  if (c.achievements !== undefined) {
    if (!Array.isArray(c.achievements) || c.achievements.some((a) => !isString(a))) return "Невірні досягнення";
  }
  return validateImageRows(c.imageRows);
}

function validateTimelineItem(item: unknown): string | null {
  if (!item || typeof item !== "object") return "Невірний запис досвіду";
  const t = item as Record<string, unknown>;
  if (!isString(t.period) || !isString(t.company) || !isString(t.role) || !isString(t.desc)) return "Невірний запис досвіду";
  if (t.desc.length > 3000) return "Опис досвіду занадто довгий";
  return null;
}

function validateHomeContent(content: unknown): string | null {
  if (!content || typeof content !== "object") return "Невірна структура home.json";
  const c = content as Record<string, unknown>;
  for (const locale of ["uk", "en"]) {
    const loc = c[locale] as Record<string, unknown> | undefined;
    if (!loc) return `Немає локалі ${locale}`;
    if (!Array.isArray(loc.about) || loc.about.some((p) => !isString(p))) return `Невірний "about" для ${locale}`;
    if (!Array.isArray(loc.companies)) return `Невірні companies для ${locale}`;
    const seenSlugs = new Set<string>();
    for (const company of loc.companies) {
      const err = validateCompany(company);
      if (err) return err;
      const slug = (company as Record<string, unknown>).slug as string;
      if (seenSlugs.has(slug)) return `Дублікат slug: ${slug}`;
      seenSlugs.add(slug);
    }
    if (!Array.isArray(loc.timeline)) return `Невірний timeline для ${locale}`;
    for (const item of loc.timeline) {
      const err = validateTimelineItem(item);
      if (err) return err;
    }
  }
  return null;
}

function validateImgRef(img: unknown, required: boolean): string | null {
  if (img === undefined) return required ? "Відсутнє зображення" : null;
  if (!img || typeof img !== "object") return "Невірне зображення";
  const i = img as Record<string, unknown>;
  if (!isString(i.label)) return "Невірний підпис зображення";
  if (!isString(i.ratio) || !/^\d+\/\d+$/.test(i.ratio)) return `Невірне співвідношення сторін: ${i.ratio}`;
  if (i.src !== undefined) {
    const err = validateImagePath(i.src);
    if (err) return err;
  }
  if (i.videoSrc !== undefined) {
    const err = validateImagePath(i.videoSrc);
    if (err) return err;
  }
  return null;
}

function validateSites(sites: unknown): string | null {
  if (!Array.isArray(sites)) return "Невірний список сайтів";
  for (const site of sites) {
    if (!site || typeof site !== "object") return "Невірний сайт";
    const s = site as Record<string, unknown>;
    if (!isString(s.url)) return "Невірний URL сайту";
    if (s.src !== undefined) {
      const err = validateImagePath(s.src);
      if (err) return err;
    }
  }
  return null;
}

function validateBlock(block: unknown): string | null {
  if (!block || typeof block !== "object") return "Невірний блок";
  const b = block as Record<string, unknown>;
  switch (b.t) {
    case "meta":
      if (!Array.isArray(b.items) || b.items.some((it) => !it || !isString(it.label) || !isString(it.value))) return "Невірний блок meta";
      return null;
    case "caption":
      return isString(b.text) ? null : "Невірний блок caption";
    case "statement":
      return isString(b.text) ? null : "Невірний блок statement";
    case "dark-section": {
      if (!isString(b.caption) || !isString(b.statement)) return "Невірний блок dark-section";
      const imgErr = validateImgRef(b.img, false);
      if (imgErr) return imgErr;
      if (b.video !== undefined) {
        const v = b.video as Record<string, unknown>;
        if (!v || !isString(v.src) || !isString(v.ratio)) return "Невірне відео";
        const err = validateImagePath(v.src);
        if (err) return err;
      }
      if (b.carousel !== undefined) {
        const err = validateSites(b.carousel);
        if (err) return err;
      }
      return null;
    }
    case "dark-slider":
      if (!isString(b.caption) || !Array.isArray(b.slides)) return "Невірний блок dark-slider";
      for (const s of b.slides) {
        if (!s || !isString(s.text) || !isString(s.imgLabel) || !isString(s.imgRatio)) return "Невірний слайд";
        if (s.caption !== undefined && !isString(s.caption)) return "Невірний підзаголовок слайду";
        if (s.imgSrc !== undefined) {
          const err = validateImagePath(s.imgSrc);
          if (err) return err;
        }
        if (s.videoSrc !== undefined) {
          const err = validateImagePath(s.videoSrc);
          if (err) return err;
        }
      }
      return null;
    case "light-section": {
      if (!isString(b.caption) || !isString(b.statement)) return "Невірний блок light-section";
      return validateImgRef(b.img, true);
    }
    case "figures":
      if (!isString(b.caption) || !Array.isArray(b.items)) return "Невірний блок figures";
      for (const it of b.items) {
        if (!it || !isString(it.value) || !isString(it.label) || !isString(it.icon)) return "Невірна фігура";
      }
      return null;
    case "img":
      return isString(b.label) && isString(b.ratio) ? null : "Невірний блок img";
    case "proposal":
      if (!Array.isArray(b.items)) return "Невірний блок proposal";
      for (const it of b.items) {
        if (!it || !isString(it.n) || !isString(it.text)) return "Невірний пункт proposal";
      }
      return null;
    case "quotes":
      if (!Array.isArray(b.groups)) return "Невірний блок quotes";
      for (const g of b.groups) {
        if (!g || !isString(g.caption) || !Array.isArray(g.items)) return "Невірна група quotes";
        for (const it of g.items) {
          if (!it || !isString(it.text)) return "Невірна цитата";
          if (it.author !== undefined && !isString(it.author)) return "Невірний автор цитати";
        }
      }
      return null;
    case "white-section":
      return isString(b.caption) && isString(b.statement) ? null : "Невірний блок white-section";
    case "bullets":
      if (!isString(b.text) || !Array.isArray(b.items) || b.items.some((i) => !isString(i))) return "Невірний блок bullets";
      return null;
    case "bullets-card":
      if (!isString(b.sectionCaption) || !isString(b.text) || !Array.isArray(b.items) || b.items.some((i) => !isString(i))) return "Невірний блок bullets-card";
      return null;
    case "before-after": {
      if (!isString(b.caption) || !isString(b.statement)) return "Невірний блок before-after";
      if (b.beforeLabel !== undefined && !isString(b.beforeLabel)) return "Невірний підпис кнопки «До»";
      if (b.afterLabel !== undefined && !isString(b.afterLabel)) return "Невірний підпис кнопки «Після»";
      const beforeErr = validateImgRef(b.before, true);
      if (beforeErr) return beforeErr;
      return validateImgRef(b.after, true);
    }
    case "showcase":
      if (!isString(b.caption) || !isString(b.statement)) return "Невірний блок showcase";
      return validateSites(b.sites);
    default:
      return `Невідомий тип блоку: ${b.t}`;
  }
}

function validateCaseContent(content: unknown): string | null {
  if (!content || typeof content !== "object") return "Невірна структура блоку кейсу";
  const c = content as Record<string, unknown>;
  if (!isString(c.eyebrow) || !isString(c.title)) return "Невірний заголовок кейсу";
  if (!Array.isArray(c.steps) || c.steps.some((s) => !s || !isString(s.label) || !isString(s.href))) return "Невірні кроки навігації";
  if (!Array.isArray(c.blocks)) return "blocks має бути масивом";
  for (const block of c.blocks) {
    const err = validateBlock(block);
    if (err) return err;
  }
  return null;
}

function validateCaseFile(data: unknown): string | null {
  if (!data || typeof data !== "object") return "Невірна структура кейсу";
  const c = data as Record<string, unknown>;
  if (c.status !== undefined && c.status !== "draft" && c.status !== "published") return "Невірний status кейсу";
  for (const locale of ["uk", "en"]) {
    const err = validateCaseContent(c[locale]);
    if (err) return `${err} (${locale})`;
  }
  return null;
}

const FILE_VALIDATORS: Record<string, (data: unknown) => string | null> = {
  "src/data/home.json": validateHomeContent,
};

function findValidator(path: string): ((data: unknown) => string | null) | null {
  if (FILE_VALIDATORS[path]) return FILE_VALIDATORS[path];
  const caseMatch = path.match(CASE_FILE_RE);
  if (caseMatch && !STATIC_CASE_SLUGS.has(caseMatch[1])) return validateCaseFile;
  return null;
}

export async function POST(req: NextRequest) {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  if (!GITHUB_TOKEN) return NextResponse.json({ error: "GITHUB_TOKEN не налаштований" }, { status: 500 });

  // Proxy already blocks unauthenticated requests to /api/admin/*, but the
  // session is re-checked here since this route performs a write to GitHub.
  const session = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (!verifySessionToken(session)) {
    return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });
  }

  const body = await req.json();
  const files = body?.files;
  if (!files || typeof files !== "object" || Array.isArray(files) || Object.keys(files).length === 0) {
    return NextResponse.json({ error: "Немає файлів для збереження" }, { status: 400 });
  }

  const serialized: Record<string, string> = {};
  for (const [path, data] of Object.entries(files)) {
    const validator = findValidator(path);
    if (!validator) return NextResponse.json({ error: `Невідомий файл: ${path}` }, { status: 400 });
    const err = validator(data);
    if (err) return NextResponse.json({ error: err }, { status: 400 });
    serialized[path] = JSON.stringify(data, null, 2) + "\n";
  }

  try {
    await commitFiles(GITHUB_TOKEN, serialized, "Update site content via admin panel");
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Помилка збереження в GitHub" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

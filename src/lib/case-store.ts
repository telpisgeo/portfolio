import fs from "fs";
import path from "path";
import type { CaseContent } from "@/lib/case-blocks";

export type CaseStatus = "draft" | "published";

export type CaseFile = {
  status?: CaseStatus;
  uk: CaseContent;
  en: CaseContent;
};

const CASES_DIR = path.join(process.cwd(), "src/data/cases");

// Slugs already served by their own dedicated route — excluded from the
// generic [slug] JSON-case lookup and from the admin's case list, so the
// two systems never collide.
export const STATIC_CASE_SLUGS = new Set(["eschool-2", "eschool", "westudy", "snov"]);

export function listCaseSlugs(): string[] {
  if (!fs.existsSync(CASES_DIR)) return [];
  return fs
    .readdirSync(CASES_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(/\.json$/, ""))
    .filter((slug) => !STATIC_CASE_SLUGS.has(slug));
}

export function readCaseFile(slug: string): CaseFile | null {
  const file = path.join(CASES_DIR, `${slug}.json`);
  if (!fs.existsSync(file)) return null;
  try {
    return JSON.parse(fs.readFileSync(file, "utf-8")) as CaseFile;
  } catch {
    return null;
  }
}

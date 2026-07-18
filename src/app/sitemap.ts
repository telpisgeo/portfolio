import type { MetadataRoute } from "next";
import { translations } from "@/lib/translations";
import { listDynamicCaseSlugs } from "@/lib/case-store";

const BASE = "https://www.telpis.com.ua";
const LOCALES = ["uk", "en"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  // Locale-agnostic paths (without the leading /<locale> segment).
  const staticPaths = [
    "",
    "/cases/eschool-2",
    "/cases/westudy",
    "/cases/snov",
    "/odesa",
  ];

  // Cases served through the generic [slug] route — kept in sync with the
  // same sources the page itself uses (legacy translations + JSON files).
  const caseSlugs = [
    ...new Set([...Object.keys(translations.uk.cases), ...listDynamicCaseSlugs()]),
  ];
  const casePaths = caseSlugs.map((slug) => `/cases/${slug}`);

  const paths = [...staticPaths, ...casePaths];
  const now = new Date();

  // One <url> entry per locale, each carrying the full hreflang alternate set
  // so the uk/en versions are reciprocally linked.
  return LOCALES.flatMap((locale) =>
    paths.map((path) => ({
      url: `${BASE}/${locale}${path}`,
      lastModified: now,
      changeFrequency: (path === "" ? "monthly" : "yearly") as "monthly" | "yearly",
      priority: path === "" ? 1 : 0.7,
      alternates: {
        languages: {
          uk: `${BASE}/uk${path}`,
          en: `${BASE}/en${path}`,
          "x-default": `${BASE}/uk${path}`,
        },
      },
    })),
  );
}

import type { MetadataRoute } from "next";
import { translations } from "@/lib/translations";
import { isCaseDraft, listDynamicCaseSlugs } from "@/lib/case-store";
import { CASES_TRANSLATED_EN, SITE_URL as BASE } from "@/lib/seo";

const LOCALES = ["uk", "en"] as const;

// No lastModified / priority / changeFrequency: Google ignores the last two,
// and a build-time "now" date would make the first one untrustworthy.
export default function sitemap(): MetadataRoute.Sitemap {
  // Home — fully translated, listed in both locales with reciprocal hreflang.
  const home = LOCALES.map((locale) => ({
    url: `${BASE}/${locale}`,
    alternates: {
      languages: { uk: `${BASE}/uk`, en: `${BASE}/en`, "x-default": `${BASE}/uk` },
    },
  }));

  // Cases served through the page routes + the generic [slug] route.
  const caseSlugs = [
    ...["eschool-2", "westudy", "snov"].filter((s) => !isCaseDraft(s)),
    ...Object.keys(translations.uk.cases),
    ...listDynamicCaseSlugs().filter((s) => !isCaseDraft(s)),
  ];
  const casePaths = [...new Set(caseSlugs)].map((slug) => `/cases/${slug}`);

  // While EN case copy is still Ukrainian, only the UA URL is indexed
  // (EN canonicalises to it — see CASES_TRANSLATED_EN in lib/seo.ts).
  const cases = casePaths.flatMap((path) =>
    CASES_TRANSLATED_EN
      ? LOCALES.map((locale) => ({
          url: `${BASE}/${locale}${path}`,
          alternates: {
            languages: { uk: `${BASE}/uk${path}`, en: `${BASE}/en${path}`, "x-default": `${BASE}/uk${path}` },
          },
        }))
      : [{ url: `${BASE}/uk${path}` }],
  );

  // Graph-design landing page — separate section, own "ua"/"en" segments.
  const graph = (["ua", "en"] as const).map((locale) => ({
    url: `${BASE}/graph/${locale}`,
    alternates: {
      languages: { uk: `${BASE}/graph/ua`, en: `${BASE}/graph/en`, "x-default": `${BASE}/graph/ua` },
    },
  }));

  return [...home, ...cases, ...graph];
}

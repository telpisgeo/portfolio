import type { Metadata } from "next";
import type { Locale } from "@/lib/translations";

export const SITE_URL = "https://www.telpis.com.ua";

/**
 * Build canonical + hreflang alternates for a page.
 *
 * @param locale current page locale
 * @param path   locale-relative path, no trailing slash (e.g. "" for the
 *               home page, "/cases/eschool-2" for a case)
 */
export function localeAlternates(locale: Locale, path = ""): Metadata["alternates"] {
  return {
    canonical: `${SITE_URL}/${locale}${path}`,
    languages: {
      uk: `${SITE_URL}/uk${path}`,
      en: `${SITE_URL}/en${path}`,
      "x-default": `${SITE_URL}/uk${path}`,
    },
  };
}

const OG_IMAGE: Record<Locale, string> = {
  uk: `${SITE_URL}/og-ua-v2.png`,
  en: `${SITE_URL}/og-en-v2.png`,
};

/** schema.org Person structured data for the home page. */
export function personJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: locale === "uk" ? "Георгій Тельпіс" : "Georgiy Telpis",
    url: `${SITE_URL}/${locale}`,
    jobTitle: locale === "uk" ? "Продуктовий дизайнер" : "Product Designer",
    email: "gtelpis@gmail.com",
    sameAs: [
      "https://www.linkedin.com/in/georgiy-telpis-229bbb47/",
      "https://www.instagram.com/gtelpis/",
      "https://dribbble.com/gtelpis",
    ],
  };
}

/**
 * Full metadata for a case study page: concise title, descriptive summary,
 * canonical/hreflang alternates and Open Graph tags.
 *
 * @param path locale-relative path, e.g. "/cases/eschool-2"
 * @param eyebrow short case label (e.g. "Єдина школа")
 * @param summary one-line description of the case (the long hero title works well)
 */
export function caseMetadata(
  locale: Locale,
  path: string,
  eyebrow: string,
  summary: string,
): Metadata {
  const suffix = locale === "uk" ? "Кейс" : "Case study";
  const title = `${eyebrow} · ${suffix} — Георгій Тельпіс`;
  return {
    title,
    description: summary,
    alternates: localeAlternates(locale, path),
    openGraph: {
      title,
      description: summary,
      url: `${SITE_URL}/${locale}${path}`,
      siteName: "Георгій Тельпіс",
      locale: locale === "uk" ? "uk_UA" : "en_US",
      type: "article",
      images: [{ url: OG_IMAGE[locale], width: 1200, height: 628 }],
    },
  };
}

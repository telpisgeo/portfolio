import type { Metadata } from "next";
import type { Locale } from "@/lib/translations";

export const SITE_URL = "https://www.telpis.com.ua";

/**
 * Whether EN case-study copy is translated. While `false`, EN case pages
 * point their canonical at the UA version and are left out of hreflang and
 * the sitemap, so Google doesn't treat Ukrainian text as an English page.
 * Set to `false` again if a new case ships with UA-only text.
 */
export const CASES_TRANSLATED_EN = true;

export const SITE_NAME: Record<Locale, string> = {
  uk: "Георгій Тельпіс",
  en: "Georgiy Telpis",
};

/** Home-page title, also reused for the graph-design section name. */
export const HOME_TITLE: Record<Locale, string> = {
  uk: "Георгій Тельпіс. Продуктовий дизайнер.",
  en: "Georgiy Telpis. Product Designer.",
};

export const HOME_DESCRIPTION: Record<Locale, string> = {
  uk: "Досвід запуску складних продуктів в доменах EdTech та MarTech від ідеї до релізу.",
  en: "Experience launching complex products in EdTech and MarTech domains from idea to release.",
};

const OG_LOCALE: Record<Locale, string> = { uk: "uk_UA", en: "en_US" };

/** 1200×630 Open Graph image per locale. */
export const OG_IMAGE: Record<Locale, string> = {
  uk: `${SITE_URL}/og-ua-v2.png`,
  en: `${SITE_URL}/og-en-v2.png`,
};

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

/**
 * Shared Open Graph + Twitter card metadata, so every page carries url,
 * siteName, locale, image and a large-image Twitter card.
 */
export function socialMetadata(
  locale: Locale,
  url: string,
  title: string,
  description: string,
  type: "website" | "article" = "website",
): Pick<Metadata, "openGraph" | "twitter"> {
  return {
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME[locale],
      locale: OG_LOCALE[locale],
      type,
      images: [{ url: OG_IMAGE[locale], width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE[locale]],
    },
  };
}

const SAME_AS = [
  "https://www.linkedin.com/in/georgiy-telpis-229bbb47/",
  "https://www.instagram.com/gtelpis/",
  "https://dribbble.com/gtelpis",
];

/** schema.org Person structured data (no personal email — it gets scraped). */
export function personJsonLd(locale: Locale, url = `${SITE_URL}/${locale}`) {
  const isUk = locale === "uk";
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: SITE_NAME[locale],
    alternateName: isUk ? "Georgiy Telpis" : "Георгій Тельпіс",
    url,
    image: `${SITE_URL}/images/hero-photo-face2.webp`,
    jobTitle: isUk ? "Продуктовий дизайнер" : "Product Designer",
    description: HOME_DESCRIPTION[locale],
    knowsAbout: ["Product design", "UX/UI design", "B2B SaaS", "EdTech", "MarTech", "Design systems"],
    knowsLanguage: ["uk", "en"],
    sameAs: SAME_AS,
  };
}

/** schema.org WebSite structured data for the home page. */
export function websiteJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME[locale],
    inLanguage: locale,
    publisher: { "@id": `${SITE_URL}/#person` },
  };
}

/** Article + BreadcrumbList structured data for a case study. */
export function caseJsonLd(locale: Locale, path: string, eyebrow: string, title: string) {
  const url = `${SITE_URL}/${locale}${path}`;
  const isUk = locale === "uk";
  return [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: title,
      alternativeHeadline: eyebrow,
      url,
      mainEntityOfPage: url,
      // Case bodies are Ukrainian until the EN copy exists.
      inLanguage: CASES_TRANSLATED_EN ? locale : "uk",
      image: OG_IMAGE[locale],
      author: { "@id": `${SITE_URL}/#person` },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: SITE_NAME[locale], item: `${SITE_URL}/${locale}` },
        { "@type": "ListItem", position: 2, name: isUk ? "Кейси" : "Case studies", item: `${SITE_URL}/${locale}#works` },
        { "@type": "ListItem", position: 3, name: eyebrow, item: url },
      ],
    },
  ];
}

/**
 * Full metadata for a case study page: concise title, descriptive summary,
 * canonical/hreflang alternates and Open Graph / Twitter tags.
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
  const title = `${eyebrow} · ${suffix} — ${SITE_NAME[locale]}`;
  const url = `${SITE_URL}/${locale}${path}`;

  let alternates: Metadata["alternates"];
  if (CASES_TRANSLATED_EN) {
    alternates = localeAlternates(locale, path);
  } else if (locale === "uk") {
    alternates = { canonical: url };
  } else {
    // Untranslated EN copy → consolidate signals on the UA page.
    alternates = { canonical: `${SITE_URL}/uk${path}` };
  }

  return {
    title,
    description: summary,
    alternates,
    ...socialMetadata(locale, url, title, summary, "article"),
  };
}

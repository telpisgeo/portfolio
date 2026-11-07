import { caseJsonLd } from "@/lib/seo";
import type { Locale } from "@/lib/translations";

/** Article + BreadcrumbList structured data for a case-study page. */
export default function CaseJsonLd({
  locale,
  path,
  eyebrow,
  title,
}: {
  locale: Locale;
  path: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(caseJsonLd(locale, path, eyebrow, title)) }}
    />
  );
}

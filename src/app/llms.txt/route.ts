import homeJson from "@/data/home.json";
import type { HomeContent } from "@/lib/home-content";
import { isCaseDraft } from "@/lib/case-store";
import { HOME_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/seo";

// Built from the same JSON the site renders, so it never drifts from the admin.
export const dynamic = "force-static";

export function GET() {
  const home = homeJson as unknown as HomeContent;
  const companies = home.en.companies.filter((c) => !c.caseUrl || !isCaseDraft(c.caseUrl.split("/").pop() ?? ""));

  const lines: string[] = [
    `# ${SITE_NAME.en} (${SITE_NAME.uk})`,
    "",
    `> Product designer portfolio. ${HOME_DESCRIPTION.en} Content is available in Ukrainian (/uk) and English (/en).`,
    "",
    "## Main pages",
    "",
    `- [Home (EN)](${SITE_URL}/en): about, selected works, experience timeline, testimonials`,
    `- [Home (UA)](${SITE_URL}/uk): same content in Ukrainian`,
    "",
    "## Case studies",
    "",
  ];

  for (const c of companies) {
    const caseUrl = c.caseUrl?.replace(/^\/uk\//, "/en/");
    const desc = (c.description ?? "").replace(/\s+/g, " ").trim();
    const link = caseUrl ? `[${c.name}](${SITE_URL}${caseUrl})` : c.name;
    lines.push(`- ${link} (${c.period}, ${c.role}): ${desc}`);
  }

  lines.push(
    "",
    "## Optional",
    "",
    `- [CV, English (PDF)](${SITE_URL}/Georgiy_Telpis_uxui_(product)_designer-en.pdf)`,
    `- [CV, Ukrainian (PDF)](${SITE_URL}/Georgiy_Telpis_uxui_(product)_designer-ua.pdf)`,
    `- [Sitemap](${SITE_URL}/sitemap.xml)`,
    "",
  );

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

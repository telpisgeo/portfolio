import { listCaseSlugs, readCaseFile } from "@/lib/case-store";
import homeJson from "@/data/home.json";
import type { HomeContent } from "@/lib/home-content";
import CasesListClient, { type CaseListItem } from "./CasesListClient";

function linkedSlugs(): Set<string> {
  const home = homeJson as unknown as HomeContent;
  const linked = new Set<string>();
  for (const locale of ["uk", "en"] as const) {
    for (const company of home[locale].companies) {
      const match = company.caseUrl?.match(/^\/(?:uk|en)\/cases\/([a-z0-9-]+)$/);
      if (match) linked.add(match[1]);
    }
  }
  return linked;
}

export default function AdminCasesPage() {
  const linked = linkedSlugs();
  const cases: CaseListItem[] = listCaseSlugs().map((slug) => {
    const file = readCaseFile(slug);
    return {
      slug,
      status: file?.status ?? "published",
      title: file?.uk.title || file?.en.title || "",
      linkedFromHome: linked.has(slug),
    };
  });

  return <CasesListClient cases={cases} />;
}

import type { HomeCompany, PetProject } from "@/lib/home-content";

export type WorkScreen = {
  src: string;
  title: string;
  description: string;
  caseUrl?: string;
};

export type WorkItem = {
  slug: string;
  name: string;
  url?: string;
  icon?: string;
  productType?: string;
  role?: string;
  period?: string;
  tools?: string;
  description: string;
  achievements?: string[];
  note?: string;
  caseUrl?: string;
  casePending?: boolean;
  screens: WorkScreen[];
};

// Placeholder copy until per-screen content is added to home.json.
function stubScreen(src: string, n: number, locale: string): WorkScreen {
  const uk = locale === "uk";
  return {
    src,
    title: uk ? `Назва екрана ${n}` : `Screen title ${n}`,
    description: uk
      ? "Тут буде опис екрана: що це за інтерфейс, яку задачу він вирішує і що саме я робив."
      : "Screen description goes here: what this interface is, the problem it solves and what I did.",
  };
}

export function companyToWorkItem(c: HomeCompany, locale: string): WorkItem {
  let n = 0;
  const screens = c.imageRows
    .filter((r) => r.active !== false)
    .flatMap((r) =>
      (Array.isArray(r.value) ? r.value : [r.value]).map((src): WorkScreen => {
        n += 1;
        const stub = stubScreen(src, n, locale);
        return {
          src,
          title: r.title || stub.title,
          description: r.description || stub.description,
          caseUrl: r.caseUrl,
        };
      }),
    );
  return {
    slug: c.slug,
    name: c.name,
    url: c.url,
    icon: c.icon,
    productType: c.productType,
    role: c.role,
    period: c.period,
    tools: c.tools,
    description: c.description,
    achievements: c.achievements,
    caseUrl: c.caseUrl,
    casePending: c.casePending,
    screens,
  };
}

export function petToWorkItem(p: PetProject, locale: string): WorkItem {
  return {
    slug: p.slug,
    name: p.name,
    url: p.url,
    icon: p.icon,
    productType: p.productType,
    role: p.role,
    period: p.period,
    tools: p.tools,
    description: p.description,
    note: p.note,
    screens: p.image ? [stubScreen(p.image, 1, locale)] : [],
  };
}

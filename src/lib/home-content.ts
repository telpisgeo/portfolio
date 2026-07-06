export type HomeCompany = {
  slug: string;
  name: string;
  url: string;
  caseUrl?: string;
  casePending?: boolean;
  period: string;
  productType?: string;
  role?: string;
  icon?: string;
  description: string;
  achievements?: string[];
  tools?: string;
  imageRows: (string | string[])[];
};

export type TimelineItem = {
  period: string;
  company: string;
  role: string;
  desc: string;
};

export type HomeLocaleContent = {
  about: string[];
  companies: HomeCompany[];
  timeline: TimelineItem[];
};

export type HomeContent = Record<"uk" | "en", HomeLocaleContent>;

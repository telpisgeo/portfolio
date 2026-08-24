export type HomeImageRow = { value: string | string[]; active?: boolean };

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
  imageRows: HomeImageRow[];
};

export type TimelineItem = {
  period: string;
  company: string;
  role: string;
  desc: string;
  icon?: string;
};

export type Testimonial = {
  quote: string;
  fullQuote: string;
  name: string;
  role: string;
  company: string;
  companyIcon?: string;
  sourceUrl?: string;
  photo?: string;
};

export type HomeLocaleContent = {
  about: string[];
  companies: HomeCompany[];
  timeline: TimelineItem[];
  testimonials: Testimonial[];
};

export type HomeContent = Record<"uk" | "en", HomeLocaleContent>;

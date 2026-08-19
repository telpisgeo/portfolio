import type { HomeCompany, TimelineItem, Testimonial } from "./home-content";

export type GraphLocaleContent = {
  cvUrl: string;
  about: string[];
  companies: HomeCompany[];
  timeline: TimelineItem[];
  testimonials: Testimonial[];
};

export type GraphContent = Record<"uk" | "en", GraphLocaleContent>;

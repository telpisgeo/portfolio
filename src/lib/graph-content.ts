import type { HomeCompany, TimelineItem, Testimonial } from "./home-content";

export type HeroContent = {
  /** Text after the (non-editable, randomized) greeting — e.g. "я Георгій, ...". */
  text1: string;
  /** Second paragraph, shown below the greeting line. */
  text2: string;
};

export type GraphLocaleContent = {
  cvUrl: string;
  hero: HeroContent;
  worksTitle: string;
  about: string[];
  companies: HomeCompany[];
  timeline: TimelineItem[];
  testimonials: Testimonial[];
};

export type GraphContent = Record<"uk" | "en", GraphLocaleContent>;

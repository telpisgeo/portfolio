import type { HomeImageRow } from "./home-content";

export type AdsProject = {
  /** Latin slug, also the upload folder under public/images/works/. */
  slug: string;
  name: string;
  /** Short label of the work type, e.g. "Meta ads", "Motion", "Email". */
  kind?: string;
  /** Free-form period, e.g. "2025". */
  period?: string;
  /** Context, idea and result. No invented numbers. */
  description: string;
  /** Hidden projects are not rendered on /ads (per locale). */
  hidden?: boolean;
  /** Same shape as on /graph: images, videos, pairs, posters, `once`. */
  imageRows: HomeImageRow[];
};

export type AdsLocaleContent = {
  /** Text after the (non-editable, randomized) greeting, same as on /graph. */
  hero: { text1: string; text2: string };
  worksTitle: string;
  projects: AdsProject[];
};

export type AdsContent = Record<"uk" | "en", AdsLocaleContent>;

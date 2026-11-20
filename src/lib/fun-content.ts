import funJson from "@/data/fun.json";

/** One image/video of a work. */
export type FunSlide = {
  src: string;
  /** Aspect ratio as "width/height". */
  ratio: string;
  /** Still shown while a video downloads (videos only). */
  poster?: string;
};

/** One tile of the /fun masonry wall: an image or a short video, plus optional variations (carousel on the detail page). */
export type FunItem = {
  /** Stable URL slug of the detail page (`/<locale>/fun/<id>`). */
  id: string;
  /** `/images/...` path (image or video) or a Vercel Blob video URL. */
  src: string;
  /** Aspect ratio as "width/height" — reserves the tile height before the media loads. */
  ratio: string;
  /** Still shown while a video downloads (videos only). */
  poster?: string;
  /** Extra variations after the cover; the detail page shows `[cover, ...more]` as a carousel. */
  more?: FunSlide[];
  /** Optional title: detail-page heading and image alt (not shown under wall tiles). */
  caption?: string;
  /** Optional longer text shown on the detail page. */
  description?: string;
};

export type FunContent = { items: FunItem[] };

export const FUN_CONTENT = funJson as unknown as FunContent;

export function isFunVideo(src: string): boolean {
  return /\.(webm|mp4|mov)$/i.test(src) || src.includes(".public.blob.vercel-storage.com/");
}

export function funSlides(item: FunItem): FunSlide[] {
  return [{ src: item.src, ratio: item.ratio, poster: item.poster }, ...(item.more ?? [])];
}

export function newFunId(): string {
  return Math.random().toString(36).slice(2, 10);
}

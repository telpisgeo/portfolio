"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { WorkItem } from "@/lib/work-items";

const VIDEO_EXT_RE = /\.(webm|mp4|mov)$/i;

type Props = {
  items: WorkItem[];
  locale: string;
  /** Sticky company timeline above the list (works only). */
  showTimeline?: boolean;
};

type Open = { item: number; screen: number } | null;

// Arrow icon exported from Figma (Portfolio-Graphic design, node 567:4114), pointing up-right.
function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden className={className}>
      <path
        d="M8 9V2H1C0.447715 2 0 1.55228 0 1C0 0.447715 0.447715 0 1 0H10V9C10 9.55229 9.55229 10 9 10C8.44772 10 8 9.55229 8 9Z"
        fill="currentColor"
      />
      <path
        d="M8.11797 0.698359C8.51327 0.312671 9.14639 0.320464 9.53208 0.715766C9.91776 1.11107 9.90997 1.74418 9.51467 2.12987L2.11246 9.35206C1.71715 9.73775 1.08404 9.72996 0.698349 9.33465C0.312662 8.93935 0.320455 8.30623 0.715757 7.92055L8.11797 0.698359Z"
        fill="currentColor"
      />
    </svg>
  );
}

// Style of the "Дивитись кейс" link in a work header.
const HEADER_LINK =
  "inline-flex items-center gap-1.5 self-start text-[15px] font-bold text-[#515151] hover:text-primary transition-colors";

function CompanyIcon({ item, size = 36 }: { item: WorkItem; size?: number }) {
  return item.icon ? (
    <Image src={item.icon} alt={item.name} width={size} height={size} className="rounded-xl" style={{ width: size, height: size }} />
  ) : (
    <div className="rounded-xl bg-muted flex items-center justify-center" style={{ width: size, height: size }}>
      <span className="text-muted-foreground/60 text-xs font-medium">{item.name.charAt(0)}</span>
    </div>
  );
}

function ScreenScroller({
  item,
  onOpen,
}: {
  item: WorkItem;
  onOpen: (screen: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [canNext, setCanNext] = useState(false);
  const [canPrev, setCanPrev] = useState(false);

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    setCanPrev(el.scrollLeft > 4);
  }, []);

  useEffect(() => {
    update();
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(update);
    ro.observe(el);
    // Images/videos change scrollWidth as they load.
    el.addEventListener("load", update, true);
    el.addEventListener("loadedmetadata", update, true);
    return () => {
      ro.disconnect();
      el.removeEventListener("load", update, true);
      el.removeEventListener("loadedmetadata", update, true);
    };
  }, [update]);

  return (
    <div className="relative">
      <div
        ref={ref}
        onScroll={update}
        className="px-[max(1.5rem,calc((100vw_-_1440px)/2_+_1.5rem))] sm:px-[max(3rem,calc((100vw_-_1440px)/2_+_3rem))] scroll-px-[max(1.5rem,calc((100vw_-_1440px)/2_+_1.5rem))] sm:scroll-px-[max(3rem,calc((100vw_-_1440px)/2_+_3rem))] flex gap-3 overflow-x-auto no-scrollbar snap-x snap-proximity"
      >
        {item.screens.map((s, i) => (
          <figure key={s.src} className="shrink-0 snap-start flex flex-col gap-3">
            <div
              role="button"
              tabIndex={0}
              aria-label={s.title}
              onClick={() => onOpen(i)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onOpen(i);
                }
              }}
              className="group relative h-[260px] sm:h-[400px] rounded-xl overflow-hidden bg-muted cursor-zoom-in"
            >
              {VIDEO_EXT_RE.test(s.src) ? (
                <video src={s.src} className="h-full w-auto" autoPlay loop muted playsInline />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element -- natural width drives the horizontal rail
                <img src={s.src} alt={s.title} loading="lazy" draggable={false} className="h-full w-auto max-w-none" />
              )}
              <span className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 text-foreground shadow flex items-center justify-center opacity-0 group-hover:opacity-100 max-sm:opacity-100 transition-opacity">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                </svg>
              </span>
            </div>
            <figcaption className="text-sm text-muted-foreground">{s.title}</figcaption>
          </figure>
        ))}
      </div>
      {(["prev", "next"] as const).map((dir) =>
        (dir === "prev" ? canPrev : canNext) ? (
          <button
            key={dir}
            type="button"
            aria-label={dir === "prev" ? "Previous" : "Next"}
            onClick={() =>
              ref.current?.scrollBy({ left: (dir === "prev" ? -1 : 1) * ref.current.clientWidth * 0.8, behavior: "smooth" })
            }
            className={`absolute ${dir === "prev" ? "left-4" : "right-4"} top-[130px] sm:top-[200px] -translate-y-1/2 w-11 h-11 rounded-full bg-white shadow-lg flex items-center justify-center text-foreground hover:scale-105 transition-transform`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d={dir === "prev" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} />
            </svg>
          </button>
        ) : null,
      )}
    </div>
  );
}

function Drawer({
  item,
  screen,
  locale,
  onClose,
  onNav,
}: {
  item: WorkItem;
  screen: number;
  locale: string;
  onClose: () => void;
  onNav: (delta: number) => void;
}) {
  const uk = locale === "uk";
  const [shown, setShown] = useState(false);
  const s = item.screens[screen];

  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(true));
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(id);
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") onNav(-1);
      else if (e.key === "ArrowRight") onNav(1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onNav]);

  const rows: { label: string; value: React.ReactNode }[] = [];
  if (item.role) rows.push({ label: uk ? "Роль" : "Role", value: item.role });
  if (item.tools) rows.push({ label: uk ? "Інструменти" : "Tools", value: item.tools });
  if (item.period) rows.push({ label: uk ? "Роки" : "Years", value: item.period });

  const navBtn = "w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-secondary-foreground flex items-center justify-center transition-colors disabled:opacity-30 disabled:hover:bg-white/10";

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={s.title}>
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-footer-bg/90 backdrop-blur-sm transition-opacity duration-300 ${shown ? "opacity-100" : "opacity-0"}`}
      />
      <div
        onClick={onClose}
        className={`absolute inset-y-0 left-0 right-[480px] hidden sm:flex items-center justify-center p-10 transition-opacity duration-300 ${shown ? "opacity-100" : "opacity-0"}`}
      >
        {VIDEO_EXT_RE.test(s.src) ? (
          <video key={s.src} src={s.src} onClick={(e) => e.stopPropagation()} className="max-w-full max-h-full rounded-xl shadow-2xl" autoPlay loop muted playsInline controls />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element -- natural size, fitted to the viewport
          <img key={s.src} src={s.src} alt={s.title} onClick={(e) => e.stopPropagation()} className="max-w-full max-h-full rounded-xl shadow-2xl object-contain" />
        )}
      </div>
      <aside
        className={`absolute bg-secondary text-secondary-foreground shadow-2xl overflow-y-auto transition-transform duration-300 ease-out
          sm:top-0 sm:right-0 sm:h-full sm:w-[480px] sm:max-w-full ${shown ? "sm:translate-x-0" : "sm:translate-x-full"}
          max-sm:bottom-0 max-sm:inset-x-0 max-sm:max-h-[85vh] max-sm:rounded-t-3xl ${shown ? "max-sm:translate-y-0" : "max-sm:translate-y-full"}`}
      >
        <div className="p-6 sm:p-8 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button type="button" aria-label="Previous" className={navBtn} disabled={screen === 0} onClick={() => onNav(-1)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6" /></svg>
              </button>
              <button type="button" aria-label="Next" className={navBtn} disabled={screen === item.screens.length - 1} onClick={() => onNav(1)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>
              </button>
            </div>
            <button type="button" aria-label="Close" className={navBtn} onClick={onClose}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
          </div>

          <div className="sm:hidden -mx-2">
            {VIDEO_EXT_RE.test(s.src) ? (
              <video key={s.src} src={s.src} className="w-full rounded-xl" autoPlay loop muted playsInline />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element -- natural size
              <img key={s.src} src={s.src} alt={s.title} className="w-full rounded-xl" />
            )}
          </div>

          <div className="flex items-start justify-between gap-4 pb-6 border-b border-secondary-foreground/15">
            <div>
              <p className="text-sm text-secondary-foreground/60">{item.name}</p>
              <h3 className="text-2xl font-medium text-secondary-foreground mt-0.5">{s.title}</h3>
            </div>
            <CompanyIcon item={item} size={40} />
          </div>

          <p className="text-lg text-secondary-foreground/80 leading-relaxed">{s.description}</p>

          {rows.length > 0 && (
            <dl className="rounded-2xl bg-white/5 px-5 py-1">
              {rows.map((r, i) => (
                <div key={r.label} className={`flex justify-between gap-6 py-4 text-sm ${i > 0 ? "border-t border-secondary-foreground/15" : ""}`}>
                  <dt className="text-secondary-foreground/60 shrink-0">{r.label}</dt>
                  <dd className="text-secondary-foreground text-right">{r.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {s.caseUrl && (
            <Link
              href={s.caseUrl}
              className="flex items-center justify-center gap-2 w-full rounded-full bg-primary text-primary-foreground font-medium px-6 py-4 hover:brightness-95 transition"
            >
              {uk ? "Дивитись кейс" : "View case"}
              <ArrowIcon className="rotate-45" />
            </Link>
          )}
        </div>
      </aside>
    </div>
  );
}

export default function WorksSection({ items, locale, showTimeline = false }: Props) {
  const uk = locale === "uk";
  const [active, setActive] = useState(items[0]?.slug ?? "");
  const [open, setOpen] = useState<Open>(null);

  useEffect(() => {
    if (!showTimeline) return;
    const LINE = 180;
    function compute() {
      let cur = items[0]?.slug ?? "";
      for (const it of items) {
        const el = document.getElementById(`work-${it.slug}`);
        if (el && el.getBoundingClientRect().top <= LINE) cur = it.slug;
      }
      setActive(cur);
    }
    compute();
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, [items, showTimeline]);

  const close = useCallback(() => setOpen(null), []);
  const nav = useCallback(
    (delta: number) =>
      setOpen((o) => {
        if (!o) return o;
        const next = o.screen + delta;
        if (next < 0 || next >= items[o.item].screens.length) return o;
        return { ...o, screen: next };
      }),
    [items],
  );

  return (
    <>
      {showTimeline && (
        <div className="sticky top-16 z-30 bg-white border-b border-border">
          <div className="max-w-[1440px] mx-auto px-6 sm:px-12">
            <div className="flex gap-6 sm:gap-10 overflow-x-auto no-scrollbar">
              {items.map((it) => {
                const isActive = active === it.slug;
                return (
                  <a
                    key={it.slug}
                    href={`#work-${it.slug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(`work-${it.slug}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className={`relative shrink-0 py-3 text-sm leading-tight transition-colors ${isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    <span className="block font-medium">{it.name}</span>
                    {it.period && <span className="block text-xs opacity-70 mt-0.5">{it.period}</span>}
                    <span className={`absolute left-0 right-0 -bottom-px h-0.5 bg-foreground transition-opacity ${isActive ? "opacity-100" : "opacity-0"}`} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col">
        {items.map((item, index) => (
          <section
            key={item.slug}
            id={`work-${item.slug}`}
            className={`w-full scroll-mt-32 ${index === 0 ? "" : "mt-20 border-t border-border"}`}
          >
            <div className={`max-w-[1440px] w-full mx-auto px-6 sm:px-12 ${index === 0 ? "pt-16" : "pt-20"}`}>
            <div className="grid grid-cols-1 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-6 md:gap-16 mb-10">
              <div className="flex flex-col items-start gap-3 text-[#515151]">
                <CompanyIcon item={item} />
                <div className="flex flex-col min-w-0">
                  <div className="flex flex-wrap items-center gap-x-3">
                    {item.url ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 self-start text-xl font-bold leading-[31px] hover:text-primary transition-colors"
                      >
                        {item.name}
                        <ArrowIcon />
                      </a>
                    ) : (
                      <h3 className="text-xl font-bold leading-[31px]">{item.name}</h3>
                    )}
                    {item.isPet && (
                      <span className="rounded-full border border-[#515151]/25 px-2.5 py-0.5 text-xs font-medium leading-5">
                        {uk ? "Pet-проєкт" : "Pet project"}
                      </span>
                    )}
                  </div>
                  {item.productType && <p className="text-[15px] leading-[31px]">{item.productType}</p>}
                  <p className="text-[15px] leading-[31px]">
                    {[item.role, item.period?.replace("→", "—")].filter(Boolean).join(" · ")}
                  </p>
                </div>
              </div>

              {/* md+: start level with the company name (icon 36 + gap 12), like chrsl.net */}
              <div className="flex flex-col gap-5 md:pt-12">
                <p className="text-xl text-foreground/80 leading-relaxed">{item.description}</p>
                {item.achievements && item.achievements.length > 0 && (
                  <ul className="flex flex-col gap-2">
                    {item.achievements.map((a, i) => (
                      <li key={i} className="flex gap-2.5 text-base text-foreground/70 leading-relaxed">
                        <span aria-hidden className="text-foreground/40">•</span>
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {item.note && <p className="text-sm text-muted-foreground">{item.note}</p>}
                {item.casePending && (
                  <p className="text-sm text-muted-foreground">{uk ? "Кейс готується до публікації" : "Case coming soon"}</p>
                )}
                {item.caseUrl && (
                  <Link href={item.caseUrl} className={HEADER_LINK}>
                    {uk ? "Дивитись кейс" : "View case"}
                    <ArrowIcon className="rotate-45" />
                  </Link>
                )}
              </div>
            </div>

            </div>

            {item.screens.length > 0 && (
              <ScreenScroller item={item} onOpen={(screen) => setOpen({ item: index, screen })} />
            )}
          </section>
        ))}
      </div>

      {open && (
        <Drawer item={items[open.item]} screen={open.screen} locale={locale} onClose={close} onNav={nav} />
      )}
    </>
  );
}

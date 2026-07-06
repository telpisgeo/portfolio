"use client";

import { useEffect, useRef, useState } from "react";

export type ShowcaseSite = { url: string; src?: string };

// Timeline per slide (ms): fade in → pause → scroll long page → pause → fade out
const ENTER = 700;
const HOLD = 600;
const SCROLL = 7000;
const END_HOLD = 900;
const EXIT = 500;
const TOTAL = ENTER + HOLD + SCROLL + END_HOLD + EXIT;

const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;

function PlaceholderPage({ url }: { url: string }) {
  return (
    <div className="w-full h-full flex flex-col gap-4 p-5">
      <div className="h-[30%] shrink-0 rounded-lg bg-black/[0.06] flex items-center justify-center">
        <span className="text-sm text-black/30">{url}</span>
      </div>
      <div className="h-[4%] w-1/2 shrink-0 rounded bg-black/[0.05]" />
      <div className="grid grid-cols-3 gap-4 h-[18%] shrink-0">
        <div className="rounded-lg bg-black/[0.05]" />
        <div className="rounded-lg bg-black/[0.05]" />
        <div className="rounded-lg bg-black/[0.05]" />
      </div>
      <div className="h-[22%] shrink-0 rounded-lg bg-black/[0.06]" />
      <div className="h-[4%] w-2/3 shrink-0 rounded bg-black/[0.05]" />
      <div className="grid grid-cols-2 gap-4 h-[16%] shrink-0">
        <div className="rounded-lg bg-black/[0.05]" />
        <div className="rounded-lg bg-black/[0.05]" />
      </div>
      <div className="flex-1 rounded-lg bg-black/[0.07]" />
    </div>
  );
}

export default function SiteShowcase({ sites }: { sites: ShowcaseSite[] }) {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);

  const frameRef = useRef<HTMLDivElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const fillRef = useRef<HTMLDivElement | null>(null);
  const elapsedRef = useRef(0);

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      elapsedRef.current += now - last;
      last = now;
      const t = elapsedRef.current;

      const frame = frameRef.current;
      const viewport = viewportRef.current;
      const inner = innerRef.current;
      if (frame && viewport && inner) {
        const dist = Math.max(0, inner.offsetHeight - viewport.clientHeight);

        let opacity = 1;
        let scale = 1;
        let y = 0;

        if (t < ENTER) {
          const p = t / ENTER;
          opacity = p;
          scale = 0.97 + 0.03 * p;
        } else if (t < ENTER + HOLD) {
          // resting at top of the page
        } else if (t < ENTER + HOLD + SCROLL) {
          y = -dist * easeInOutSine((t - ENTER - HOLD) / SCROLL);
        } else if (t < ENTER + HOLD + SCROLL + END_HOLD) {
          y = -dist;
        } else {
          opacity = 1 - (t - ENTER - HOLD - SCROLL - END_HOLD) / EXIT;
          y = -dist;
        }

        frame.style.opacity = String(opacity);
        frame.style.transform = `scale(${scale})`;
        inner.style.transform = `translateY(${y}px)`;
      }
      if (fillRef.current) fillRef.current.style.width = `${Math.min(100, (t / TOTAL) * 100)}%`;

      if (t >= TOTAL) {
        elapsedRef.current = 0;
        setActive((prev) => (prev + 1) % sites.length);
      } else {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, active, sites.length]);

  const goTo = (i: number) => {
    elapsedRef.current = 0;
    if (fillRef.current) fillRef.current.style.width = "0%";
    setActive(((i % sites.length) + sites.length) % sites.length);
  };

  const site = sites[active];

  return (
    <div className="flex flex-col">
      {/* Stage */}
      <div
        className="w-full rounded-2xl overflow-hidden relative flex items-center justify-center"
        style={{ aspectRatio: "1144 / 640", background: "#EFEDEA" }}
      >
        {/* Browser window — remounts per slide so styles start fresh */}
        <div
          key={active}
          ref={frameRef}
          className="w-[78%] h-[84%] bg-white rounded-xl shadow-[0_30px_60px_rgba(0,0,0,0.16),0_4px_12px_rgba(0,0,0,0.07)] overflow-hidden flex flex-col"
          style={{ opacity: 0 }}
        >
          {/* Chrome bar */}
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-black/[0.07] bg-white shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
            <span className="ml-3 flex-1 bg-[#f1f1f3] rounded text-[12px] text-black/40 px-3 py-1 text-center">{site.url}</span>
          </div>
          {/* Scrolling page */}
          <div ref={viewportRef} className="relative flex-1 overflow-hidden">
            <div
              ref={innerRef}
              className={`absolute top-0 left-0 w-full will-change-transform ${site.src ? "" : "h-[300%]"}`}
            >
              {site.src ? (
                <img src={site.src} alt={site.url} className="w-full h-auto block" />
              ) : (
                <PlaceholderPage url={site.url} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Controls — same pattern as DarkSlider */}
      <div className="flex items-center justify-center gap-4 pt-7">
        <button
          onClick={() => goTo(active - 1)}
          className="w-9 h-9 rounded-full bg-secondary-foreground/15 hover:bg-secondary-foreground/25 flex items-center justify-center transition-colors shrink-0"
          aria-label="Попередній"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8L10 13" stroke="var(--secondary-foreground)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div className="flex items-center gap-2 bg-secondary-foreground/10 rounded-full px-3 h-9">
          {sites.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="h-2 rounded-full overflow-hidden bg-secondary-foreground/20 transition-all duration-300 hover:bg-secondary-foreground/30"
              style={{ width: i === active ? 48 : 8 }}
              aria-label={`Сайт ${i + 1}`}
            >
              {i === active && <div ref={fillRef} className="h-full bg-primary rounded-full" style={{ width: "0%" }} />}
            </button>
          ))}
        </div>

        <button
          onClick={() => setPlaying((p) => !p)}
          className="w-9 h-9 rounded-full bg-secondary-foreground/15 hover:bg-secondary-foreground/25 flex items-center justify-center transition-colors shrink-0"
          aria-label={playing ? "Зупинити" : "Запустити"}
        >
          {playing ? (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <rect x="2" y="1.5" width="3" height="9" rx="1" fill="var(--secondary-foreground)"/>
              <rect x="7" y="1.5" width="3" height="9" rx="1" fill="var(--secondary-foreground)"/>
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M3 1.5L10 6L3 10.5V1.5Z" fill="var(--secondary-foreground)"/>
            </svg>
          )}
        </button>

        <button
          onClick={() => goTo(active + 1)}
          className="w-9 h-9 rounded-full bg-secondary-foreground/15 hover:bg-secondary-foreground/25 flex items-center justify-center transition-colors shrink-0"
          aria-label="Наступний"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 3L11 8L6 13" stroke="var(--secondary-foreground)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

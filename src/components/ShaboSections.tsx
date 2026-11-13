"use client";

import Image from "next/image";
import Link from "next/link";
import ShaboSignature from "@/components/ShaboSignature";
import { SLIDE1_ELLIPSES } from "@/components/shaboEllipses";
import { SIG5 } from "@/components/shaboSig5";
import { Forum, Open_Sans } from "next/font/google";
import { useEffect, useRef, useState } from "react";

// SHABO brand fonts (shabo.ua uses Forum + Open Sans), loaded only on this page.
const forum = Forum({ subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"], weight: "400", display: "swap" });
const openSans = Open_Sans({ subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"], display: "swap" });

// Temporary page for the SHABO test assignment (/shabo). Content lives here on
// purpose (not in /src/data + admin): the page is deleted after the review.

// SHABO brand palette from shabo.ua (--bg-lighter, --bg-ligth2, --black, --light-brown),
// scoped to this temporary page through CSS variables.
const SHABO_THEME = {
  "--background": "#faf8f5",
  "--muted": "#eeede7",
  "--foreground": "#242021",
  "--shabo-gold": "#c1986a",
} as React.CSSProperties;

/** A carousel slide: a plain image, or layers (flat colour + gradient blobs that float + foreground). */
export type PostSlide =
  | string
  | { bg: string; blobs: string; fg: string; /** draw the handwritten signature (slide 5) when the slide is first shown */ signature?: boolean }
  // Slide 1: live gradient ellipses (SVG) behind the bottle layer `fg`; they slide so the dark part of the gradient travels sideways.
  | { bg: string; ellipses: "slide1"; fg: string }
  // Layered slide whose shapes and text come in when the slide first becomes active (the logo stays put).
  | { bg: string; shapes: string[]; texts: string[]; logo: string };

/** Per-slide text of the Instagram mockup: the music line under the account name and the caption under the likes. */
export type PostMeta = { music: string; caption: string };

/** Small "voice message" player under a section's description (design only for now: no audio file yet). */
export type ShaboVoice = { /** Audio file in /public (m4a/mp3/webm). Without it the player only simulates playback. */ src?: string; /** Shown until the file's real length is known. */ duration: string };

export type ShaboSection = {
  id: string;
  /** Voice message from the author shown under the description. */
  voice?: ShaboVoice;
  title: string;
  description: string;
  /** Mockup image (WebP in /public). `null` → grey placeholder until the real asset is added. */
  image: string | null;
  /** Width / height of the mockup (or of the placeholder). */
  ratio: [number, number];
  alt: string;
  /** Instagram-style carousel laid over the slide area of the mockup (WebP in /public). */
  slides?: PostSlide[];
  /** Music + caption shown for each slide (same order as `slides`); painted over the baked-in text of the mockup. */
  meta?: PostMeta[];
  /** Interactive envelope that opens and reveals the postcard (replaces the image). */
  envelope?: boolean;
  /** Carousel advances by itself (pauses on hover/touch). */
  autoplay?: boolean;
};

type Props = {
  sections: ShaboSection[];
  logo: string;
  photo: string;
  name: string;
};

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

// Same word-by-word rise as the hero on the home page: each word slides up out of a clip mask.
function RiseWords({ text, show, start = 0, step = 60 }: { text: string; show: boolean; start?: number; step?: number }) {
  return (
    <>
      {text.split(" ").map((w, i) => (
        <span key={i}>
          <span className="inline-block overflow-hidden align-bottom" style={{ padding: "0.12em 0.08em", margin: "-0.12em -0.08em" }}>
            <span
              className="inline-block"
              style={{
                transform: show ? "translateY(0)" : "translateY(110%)",
                transition: `transform 700ms ${EASE} ${start + i * step}ms`,
              }}
            >
              {w}
            </span>
          </span>{" "}
        </span>
      ))}
    </>
  );
}

const fadeUp = (show: boolean, delay: number): React.CSSProperties => ({
  opacity: show ? 1 : 0,
  transform: show ? "translateY(0)" : "translateY(24px)",
  transition: `opacity 800ms ${EASE} ${delay}ms, transform 800ms ${EASE} ${delay}ms`,
});

const imgReveal = (show: boolean): React.CSSProperties => ({
  opacity: show ? 1 : 0,
  transform: show ? "translateY(0) scale(1)" : "translateY(40px) scale(0.96)",
  transition: `opacity 1000ms ${EASE} 1300ms, transform 1200ms ${EASE} 1300ms`,
});

// Video slide (WebM/MP4): plays muted on a loop only while it is the visible slide of the carousel.
function SlideVideo({ src, label }: { src: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.intersectionRatio >= 0.6) el.play().catch(() => {});
        else el.pause();
      },
      { root: el.closest("[data-carousel]"), threshold: [0, 0.6] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <video ref={ref} src={src} aria-label={label} muted loop playsInline preload="auto" className="absolute inset-0 w-full h-full object-cover" />;
}

// The six Figma ellipses of slide 1. They start in the first Figma frame (69:20213), smoothly move/stretch
// into the second one (69:20243) and back; the radial gradient inside each ellipse goes with it.
function SlideEllipses() {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 645 855" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        {SLIDE1_ELLIPSES.map((e, i) => (
          <radialGradient key={i} id={`shabo-e${i}`} cx="0.5" cy="0.5" r="0.5" gradientTransform={`matrix(${e.m.join(" ")})`}>
            <stop offset="0" stopColor="#162dae" />
            <stop offset="0.41" stopColor="#a9153f" stopOpacity="0.5" />
          </radialGradient>
        ))}
        <filter id="shabo-eblur" x="-10%" y="-50%" width="120%" height="200%"><feGaussianBlur stdDeviation="10" /></filter>
      </defs>
      {SLIDE1_ELLIPSES.map((e, i) => (
        <g
          key={i}
          className="shabo-slide"
          style={{ ["--from" as string]: `matrix(${e.from.join(",")})`, ["--to" as string]: `matrix(${e.to.join(",")})` }}
        >
          <ellipse cx={e.w / 2} cy={e.h / 2} rx={e.w / 2} ry={e.h / 2} fill={`url(#shabo-e${i})`} filter={e.blur ? "url(#shabo-eblur)" : undefined} />
        </g>
      ))}
    </svg>
  );
}

// Signature that writes itself: every stroke is drawn at once with one shared duration and easing.
function DrawnSignature({ on }: { on: boolean }) {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 645 855" preserveAspectRatio="xMidYMid slice" fill="none" aria-hidden>
      <g transform={`translate(${SIG5.x} ${SIG5.y})`}>
        {SIG5.paths.map((d, i) => (
          <path
            key={i}
            d={d}
            stroke={SIG5.stroke}
            strokeWidth={SIG5.width}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            style={{
              strokeDasharray: 1,
              strokeDashoffset: on ? 0 : 1,
              transition: on ? "stroke-dashoffset 2400ms cubic-bezier(0.45, 0, 0.25, 1) 500ms" : "none",
            }}
          />
        ))}
      </g>
    </svg>
  );
}

// A static gradient shape: the image as is, plus a moving gradient clipped to the image's own alpha,
// so the outline never changes and only the dark part of the gradient travels sideways.
function GradientShape({ src, delay = 0 }: { src: string; delay?: number }) {
  return (
    <>
      <Image src={src} alt="" fill sizes="(min-width: 768px) 520px, 90vw" className="object-cover" />
      <div
        className="shabo-grad absolute inset-0"
        style={{
          WebkitMaskImage: `url(${src})`,
          maskImage: `url(${src})`,
          WebkitMaskSize: "cover",
          maskSize: "cover",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          animationDelay: `${-delay}s`,
        }}
      />
    </>
  );
}

// Full-frame layer that fades in (and rises or scales a little) once `on` is true.
function Reveal({ on, delay, from, children }: { on: boolean; delay: number; from: "up" | "scale"; children: React.ReactNode }) {
  const hidden = from === "up" ? "translateY(5%)" : "scale(0.94)";
  return (
    <div
      className="absolute inset-0"
      style={{
        opacity: on ? 1 : 0,
        transform: on ? "none" : hidden,
        transition: `opacity 900ms ${EASE} ${delay}ms, transform 1100ms ${EASE} ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// Instagram-like carousel placed over the slide area of the mockup image (slide area =
// 8.0%–77.9% of the post height; the baked-in dots below it are covered and redrawn).
function PostCarousel({ slides, alt, autoplay = false, meta }: { slides: PostSlide[]; alt: string; autoplay?: boolean; meta?: PostMeta[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(0);
  // Slides that have been active at least once keep their revealed state (animation plays once).
  const [shown, setShown] = useState<number[]>([0]);
  useEffect(() => {
    setShown((s) => (s.includes(idx) ? s : [...s, idx]));
  }, [idx]);
  const paused = useRef(false);
  const visible = useRef(false);
  // Optional autoplay: advances every 3.2 s while the carousel is on screen, loops back to the
  // first slide, and pauses while the user hovers / touches / drags it.
  useEffect(() => {
    const el = ref.current;
    if (!autoplay || !el || slides.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([e]) => (visible.current = e.intersectionRatio >= 0.6), { threshold: [0.6] });
    io.observe(el);
    const on = () => (paused.current = true);
    const off = () => (paused.current = false);
    el.addEventListener("pointerenter", on);
    el.addEventListener("pointerleave", off);
    el.addEventListener("touchstart", on, { passive: true });
    el.addEventListener("touchend", () => window.setTimeout(off, 4000), { passive: true });
    const timer = window.setInterval(() => {
      if (paused.current || !visible.current) return;
      const cur = Math.round(el.scrollLeft / el.clientWidth);
      el.scrollTo({ left: ((cur + 1) % slides.length) * el.clientWidth, behavior: "smooth" });
    }, 3200);
    return () => {
      io.disconnect();
      window.clearInterval(timer);
      el.removeEventListener("pointerenter", on);
      el.removeEventListener("pointerleave", off);
    };
  }, [autoplay, slides.length]);
  const many = slides.length > 1;
  const go = (n: number) => {
    const el = ref.current;
    if (!el) return;
    el.scrollTo({ left: Math.max(0, Math.min(slides.length - 1, n)) * el.clientWidth, behavior: "smooth" });
  };
  // Instagram look: small light-grey circle with a thin dark-grey chevron, sized relative to the post.
  const arrow = "absolute -translate-y-1/2 z-10 grid place-items-center aspect-square rounded-full bg-white/65 text-[#7a7a7a] cursor-pointer transition-[opacity,scale,background-color] duration-200 hover:scale-[1.2] hover:bg-white/85 active:scale-105";
  // Desktop: fixed-size circles outside the post so they never cover the slide; mobile (no room
  // beside the post) keeps small circles over its edges.
  const arrowSize = { top: "43%" };
  const arrowOut = "w-[26px] md:w-7 md:bg-white/50 md:text-foreground/35 md:hover:bg-white md:hover:text-foreground/80 md:hover:scale-[1.3]";
  return (
    <>
      <style>{`
        @keyframes shabo-meta-in { from { opacity: 0; } to { opacity: 1; } }
        /* the shapes never move or resize; only the dark part of their gradient slides left ↔ right inside them */
        @keyframes shabo-slide { from { transform: var(--from); } to { transform: var(--to); } }
        .shabo-slide { animation: shabo-slide 9s ease-in-out infinite alternate; }
        @keyframes shabo-xfade { from { opacity: 0; } to { opacity: 1; } }
        .shabo-xfade { animation: shabo-xfade 6s ease-in-out infinite alternate; }
        @keyframes shabo-grad { from { background-position: 0% 0; } to { background-position: 100% 0; } }
        .shabo-grad { background-image: linear-gradient(90deg, rgba(48, 30, 170, 0) 0%, rgba(48, 30, 170, 0.55) 50%, rgba(48, 30, 170, 0) 100%); background-size: 260% 100%; animation: shabo-grad 8s ease-in-out infinite alternate; }
        @media (prefers-reduced-motion: reduce) { .shabo-grad, .shabo-xfade, .shabo-slide { animation: none; } }
      `}</style>
      <div
        ref={ref}
        data-carousel
        onScroll={(e) => setIdx(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
        className="[scrollbar-width:none] [&::-webkit-scrollbar]:hidden absolute inset-x-0 flex overflow-x-auto overflow-y-hidden snap-x snap-mandatory overscroll-x-contain"
        style={{ top: "8.05%", height: "70.7%", background: "#0c1013" }}
      >
        {slides.map((src, k) => (
          <div
            key={k}
            className="relative shrink-0 w-full h-full snap-center"
            style={{
              opacity: k === idx ? 1 : 0.55,
              transform: k === idx ? "scale(1)" : "scale(0.97)",
              transition: `opacity 500ms ${EASE}, transform 600ms ${EASE}`,
            }}
          >
            {typeof src !== "string" ? (
              <div role="img" aria-label={`${alt}, слайд ${k + 1}`} className="absolute inset-0 overflow-hidden" style={{ background: src.bg }}>
                {"fg" in src ? (
                  <>
                    {/* gradient shapes stay put; only their gradient moves */}
                    {"ellipses" in src ? <SlideEllipses /> : <GradientShape src={src.blobs} delay={k * 2.3} />}
                    <Image src={src.fg} alt="" fill sizes="(min-width: 768px) 520px, 90vw" className="object-cover" />
                    {"signature" in src && src.signature && <DrawnSignature on={shown.includes(k)} />}
                  </>
                ) : (
                  <>
                    {/* shapes ease in first (gradient keeps sliding), then the text lines one after another; everything stays once shown */}
                    {src.shapes.map((s, n) => (
                      <Reveal key={s} on={shown.includes(k)} delay={150 + n * 160} from="scale">
                        <GradientShape src={s} delay={k * 2.3 + n * 1.7} />
                      </Reveal>
                    ))}
                    {src.texts.map((s, n) => (
                      <Reveal key={s} on={shown.includes(k)} delay={150 + src.shapes.length * 160 + n * 220} from="up">
                        <Image src={s} alt="" fill sizes="(min-width: 768px) 520px, 90vw" className="object-cover" />
                      </Reveal>
                    ))}
                    <Image src={src.logo} alt="" fill sizes="(min-width: 768px) 520px, 90vw" className="object-cover" />
                  </>
                )}
              </div>
            ) : /\.(webm|mp4)$/i.test(src) ? (
              <SlideVideo src={src} label={`${alt}, слайд ${k + 1}`} />
            ) : (
              <Image src={src} alt={`${alt}, слайд ${k + 1}`} fill sizes="(min-width: 768px) 520px, 90vw" className="object-cover" />
            )}
          </div>
        ))}
      </div>
      {meta && meta.length > 0 && (
        // Live text over the baked-in header/caption of the mockup; sizes use container-width units so it scales with the post.
        <div className="absolute inset-0 pointer-events-none" style={{ containerType: "inline-size" }}>
          <div className="absolute flex items-center gap-[1.2cqw] text-white/90 whitespace-nowrap overflow-hidden" style={{ left: "11.8%", top: "4.1%", width: "62%", height: "2.5%", background: "#0c1013", fontSize: "2.85cqw", lineHeight: 1 }}>
            <svg className="shrink-0" style={{ width: "2.6cqw", height: "2.6cqw" }} viewBox="0 0 24 24" fill="currentColor"><path d="M9 3v11.3A3.5 3.5 0 1 0 11 17.5V7.6l8-1.6v6.3A3.5 3.5 0 1 0 21 15.5V3.6z" /></svg>
            <span key={idx} className="truncate" style={{ animation: "shabo-meta-in 400ms ease-out" }}>{meta[Math.min(idx, meta.length - 1)].music}</span>
          </div>
          <div className="absolute text-white/90 overflow-hidden" style={{ left: "2.5%", top: "90.6%", width: "95%", height: "8.6%", background: "#0c1013", fontSize: "3.2cqw", lineHeight: 1.5 }}>
            <p key={idx} style={{ animation: "shabo-meta-in 400ms ease-out" }}>
              <strong className="font-semibold text-white">SHABO.</strong> {meta[Math.min(idx, meta.length - 1)].caption}
            </p>
          </div>
        </div>
      )}
      {many && (
        <>
          <button type="button" aria-label="Попередній слайд" onClick={() => go(idx - 1)} className={`${arrow} ${arrowOut} left-[2.5%] md:-left-11 ${idx === 0 ? "opacity-0 pointer-events-none" : ""}`} style={arrowSize}>
            <svg className="w-[52%] h-[52%]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M15 5l-7 7 7 7" /></svg>
          </button>
          <button type="button" aria-label="Наступний слайд" onClick={() => go(idx + 1)} className={`${arrow} ${arrowOut} right-[2.5%] md:-right-11 ${idx === slides.length - 1 ? "opacity-0 pointer-events-none" : ""}`} style={arrowSize}>
            <svg className="w-[52%] h-[52%]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5l7 7-7 7" /></svg>
          </button>
          <div className="absolute inset-x-0 flex items-center justify-center gap-[5px]" style={{ top: "78.9%", height: "2.9%", background: "#0c1013" }}>
            {slides.map((_, k) => (
              <button
                key={k}
                type="button"
                aria-label={`Слайд ${k + 1}`}
                onClick={() => go(k)}
                className={`block rounded-full cursor-pointer transition-[width,background-color] duration-300 ${k === idx ? "bg-[#6c8cf5]" : "bg-white/35 hover:bg-white/60"}`}
                style={{ width: k === idx ? 14 : 6, height: 6 }}
              />
            ))}
          </div>
        </>
      )}
    </>
  );
}

// Envelope assets exported from Figma (Social media → "Postcard in envelope", node 45:30).
// All layers share one coordinate space of 1134×1375 (open envelope, incl. shadows).
const ENV = { w: 1134, h: 1375, hinge: 594 };
// Whole composition (envelope + confetti flying out to the right / above), same units as ENV.
// The envelope stays centred (it never moves); the confetti scatters on both sides of it.
const ENV_COMP = { w: 2180, h: 1520, top: 145, left: 523 };
// New card (with the two gold stars) and its position inside the envelope box.
const ENV_CARD = { x: 103, y: 81, w: 950, h: 670 };
// Confetti pieces [file, x, y, w, h] in ENV units; they scatter out of the envelope mouth when it opens.
const ENV_CONFETTI: [string, number, number, number, number][] = [
  ["c01", 1166, 268, 62, 61],
  ["c02", 1583, 216, 60, 59],
  ["c03", 1088, 253, 60, 61],
  ["c04", 1051, -145, 63, 65],
  ["c05", 1668, 196, 57, 58],
  ["c06", 1587, -2, 57, 58],
  ["c07", 1304, 182, 65, 63],
  ["c08", 1183, 267, 64, 64],
  ["c09", 1094, 450, 57, 58],
  ["c10", 1503, 283, 63, 63],
  ["c11", 1453, 212, 63, 63],
  ["c12", 1352, 268, 63, 63],
  ["c13", 1237, 331, 58, 58],
  ["c14", 1816, 47, 64, 66],
  ["c16", 1302, 177, 63, 62],
  ["c17", 1408, 349, 61, 62],
  ["c18", 1554, 312, 57, 58],
  ["c19", 1359, 422, 59, 60],
  ["c20", 1763, 227, 52, 54],
  ["c21", 1139, 548, 59, 60],
  ["c22", 1223, 517, 60, 62],
  ["c23", 1634, 373, 58, 57],
  ["c24", 1402, 493, 62, 63],
  ["c25", 1516, 459, 58, 58],
  ["c26", 1764, 355, 58, 57],
  ["c27", 1263, 685, 45, 54],
  ["c28", 1395, 624, 61, 62],
  ["c29", 1580, 599, 55, 57],
  ["c30", 1763, 489, 62, 61],
  ["c15", 1075, 394, 52, 52],
];
const ENV_MOUTH = { x: 560, y: 330 };
const ENV_CONFETTI_POS = ENV_CONFETTI.map(([n, x, y, w, h], i) => {
  const nx = x > ENV.w ? ENV.w + (x - ENV.w) * 0.7 : x;
  return [n, i % 2 ? ENV.w - nx - w : nx, y, w, h] as [string, number, number, number, number];
});
const ENV_DIR = "/images/works/shabo/envelope";
const pct = (v: number, total: number) => `${(v / total) * 100}%`;
const envBox = (x: number, y: number, w: number, h: number): React.CSSProperties => ({
  position: "absolute",
  left: pct(x, ENV.w),
  top: pct(y, ENV.h),
  width: pct(w, ENV.w),
  height: pct(h, ENV.h),
});

// Closed envelope → the flap swings up (3D), the postcard slides out. Opens on its own once the
// section is shown; click toggles it.
function EnvelopeCard({ show, alt }: { show: boolean; alt: string }) {
  const [open, setOpen] = useState(false);
  const auto = useRef(false);
  useEffect(() => {
    if (!show || auto.current) return;
    auto.current = true;
    const t = window.setTimeout(() => setOpen(true), 2400);
    return () => window.clearTimeout(t);
  }, [show]);

  const flapMs = 900;
  const img = (name: string, w: number, h: number, extra?: React.CSSProperties) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={`${ENV_DIR}/${name}.webp`} alt="" width={w} height={h} draggable={false} className="block w-full h-full select-none" style={extra} />
  );

  return (
    <button
      type="button"
      onClick={() => setOpen((o) => !o)}
      aria-label={alt}
      aria-pressed={open}
      className="relative h-full max-w-full cursor-pointer outline-none"
      style={{ aspectRatio: `${ENV_COMP.w} / ${ENV_COMP.h}` }}
    >
      <style>{`@keyframes shabo-drift { from { translate: 0 -0.6%; rotate: -4deg; } to { translate: 0.4% 0.8%; rotate: 5deg; } }`}</style>
      <div
        className="absolute"
        style={{
          left: pct(ENV_COMP.left, ENV_COMP.w),
          top: pct(ENV_COMP.top, ENV_COMP.h),
          width: pct(ENV.w, ENV_COMP.w),
          height: pct(ENV.h, ENV_COMP.h),
          containerType: "inline-size",
          perspective: "2600px",
          // the envelope never moves sideways; closed it only sits a little higher
          transform: open ? "translate(0, 0)" : "translate(0, -21%)",
          transition: `transform 1100ms ${EASE} ${open ? 500 : 0}ms`,
        }}
      >
      <div style={envBox(0, 588, ENV.w, ENV.h - 588)}>{img("body", ENV.w, ENV.h - 588)}</div>

      {/* flap: closed face hangs down from the hinge, open face stands up behind the card */}
      <div
        style={{
          ...envBox(0, 0, ENV.w, ENV.hinge),
          transformOrigin: "50% 100%",
          transformStyle: "preserve-3d",
          transform: open ? "rotateX(0deg)" : "rotateX(180deg)",
          transition: `transform ${flapMs}ms cubic-bezier(0.45, 0, 0.2, 1) ${open ? 150 : 350}ms, z-index 0s linear ${open ? 550 : 450}ms`,
          zIndex: open ? 2 : 6,
        }}
      >
        <div className="absolute inset-0" style={{ backfaceVisibility: "hidden" }}>{img("flap-open", ENV.w, ENV.hinge)}</div>
        <div
          className="absolute"
          style={{ left: pct(8, ENV.w), top: 0, width: pct(1122, ENV.w), height: pct(601, ENV.hinge), backfaceVisibility: "hidden", transform: "rotateX(180deg)" }}
        >
          {img("flap-closed", 1122, 601)}
        </div>
      </div>

      <div
        style={{
          ...envBox(ENV_CARD.x, ENV_CARD.y, ENV_CARD.w, ENV_CARD.h),
          zIndex: 3,
          transform: open ? "translateY(0)" : "translateY(78%)",
          opacity: open ? 1 : 0,
          transition: `transform 1100ms ${EASE} ${open ? 800 : 0}ms, opacity 300ms ease ${open ? 800 : 700}ms`,
        }}
      >
        {img("card", ENV_CARD.w, ENV_CARD.h)}
      </div>
      {ENV_CONFETTI_POS.map(([n, x, y, w, h], i) => {
        // Deterministic pseudo-random delay and spin per piece, so it looks scattered rather than choreographed.
        const r1 = ((i * 37) % 100) / 100;
        const r2 = ((i * 61) % 100) / 100;
        const dx = ((ENV_MOUTH.x - x - w / 2) / ENV.w) * 100;
        const dy = ((ENV_MOUTH.y - y - h / 2) / ENV.w) * 100;
        const spin = (r1 - 0.5) * 540;
        return (
          <div
            key={n}
            style={{
              ...envBox(x, y, w, h),
              zIndex: 4,
              pointerEvents: "none",
              opacity: open ? 1 : 0,
              transform: open ? "translate(0, 0) rotate(0deg) scale(1)" : `translate(${dx}cqw, ${dy}cqw) rotate(${spin}deg) scale(0.2)`,
              transition: open
                ? `transform ${1000 + r2 * 700}ms cubic-bezier(0.2, 0.9, 0.3, 1.12) ${1000 + r1 * 600}ms, opacity 300ms ease ${1000 + r1 * 600}ms`
                : `transform 500ms ease ${r2 * 150}ms, opacity 300ms ease ${r2 * 150}ms`,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${ENV_DIR}/confetti/${n}.webp`}
              alt=""
              draggable={false}
              className="block w-full h-full select-none"
              style={open ? { animation: `shabo-drift ${3.5 + r2 * 3}s ease-in-out ${2.6 + r1}s infinite alternate` } : undefined}
            />
          </div>
        );
      })}
      <div style={{ ...envBox(0, 588, ENV.w, ENV.h - 588), zIndex: 5 }}>{img("front", ENV.w, ENV.h - 588)}</div>
      </div>
    </button>
  );
}

// Voice-message pill (messenger style): avatar, play button, waveform and duration.
// While "playing" the waveform fills with gold; without an audio file this only simulates the progress.
const VOICE_BARS = Array.from({ length: 34 }, (_, i) => 22 + Math.round(Math.abs(Math.sin(i * 1.7) * 0.6 + Math.sin(i * 0.43 + 1) * 0.4) * 78));

function VoiceNote({ voice, photo, show }: { voice: ShaboVoice; photo: string; show: boolean }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const src = voice.src ?? null;
  const [duration, setDuration] = useState(0); // seconds, 0 until the file's metadata is known
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0..1
  const [note, setNote] = useState<string | null>(null);

  // The metadata may already be loaded before React hydrates (the event is then missed).
  useEffect(() => {
    const d = audioRef.current?.duration;
    if (d && Number.isFinite(d)) setDuration(d);
  }, []);

  const fallbackTotal = (() => {
    const [m, s] = voice.duration.split(":").map(Number);
    return (m || 0) * 60 + (s || 0) || 30;
  })();
  const total = src && duration > 0 ? duration : fallbackTotal;

  // No audio file: simulate the progress so the design can still be judged.
  useEffect(() => {
    if (src || !playing) return;
    const id = window.setInterval(() => {
      setProgress((p) => {
        const n = p + 0.1 / fallbackTotal;
        if (n >= 1) {
          setPlaying(false);
          return 0;
        }
        return n;
      });
    }, 100);
    return () => window.clearInterval(id);
  }, [src, playing, fallbackTotal]);

  const toggle = () => {
    const el = audioRef.current;
    if (src && el) {
      if (el.paused) {
        // one voice at a time
        document.querySelectorAll("audio").forEach((a) => a !== el && a.pause());
        el.play().then(() => setPlaying(true)).catch(() => setNote("Не вдалося відтворити"));
      } else {
        el.pause();
      }
    } else {
      setPlaying((v) => !v);
    }
  };

  const left = Math.max(0, Math.round(total * (1 - progress)));
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const clock = playing || progress > 0 ? fmt(left) : src && duration > 0 ? fmt(Math.round(duration)) : voice.duration;

  const seek = (k: number) => {
    const el = audioRef.current;
    const v = (k + 0.5) / VOICE_BARS.length;
    if (src && el && duration > 0) el.currentTime = v * duration;
    setProgress(v);
  };

  return (
    <div className="mt-4 md:mt-5 flex flex-col items-center gap-2" style={fadeUp(show, 1100)}>
      <div className="inline-flex items-center gap-3 rounded-full bg-white/80 border border-foreground/10 shadow-[0_1px_2px_rgba(36,32,33,0.04),0_8px_24px_-12px_rgba(36,32,33,0.18)] pl-2 pr-4 py-2">
        <Image src={photo} alt="" width={36} height={36} className="w-9 h-9 rounded-full object-cover shrink-0 -mr-5" />
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Пауза" : "Відтворити голосове повідомлення"}
          aria-pressed={playing}
          className="relative z-10 grid place-items-center w-9 h-9 shrink-0 rounded-full bg-[var(--shabo-gold)] text-white ring-2 ring-white/80 cursor-pointer transition-transform duration-200 hover:scale-105 active:scale-95"
        >
          {playing ? (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><rect x="2.5" y="2" width="3" height="10" rx="1" /><rect x="8.5" y="2" width="3" height="10" rx="1" /></svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><path d="M4 2.2v9.6a.6.6 0 0 0 .92.5l7.4-4.8a.6.6 0 0 0 0-1L4.92 1.7A.6.6 0 0 0 4 2.2z" /></svg>
          )}
        </button>
        <div className="flex items-center gap-[2.5px] h-7">
          {VOICE_BARS.map((h, k) => (
            <button
              key={k}
              type="button"
              tabIndex={-1}
              aria-label={`Перемотати до ${Math.round(((k + 0.5) / VOICE_BARS.length) * 100)}%`}
              onClick={() => seek(k)}
              className="h-full flex items-center cursor-pointer"
            >
              <span
                className="block w-[3px] rounded-full transition-colors duration-150"
                style={{ height: `${h * 0.28}px`, background: k / VOICE_BARS.length < progress ? "var(--shabo-gold)" : "rgba(36,32,33,0.22)" }}
              />
            </button>
          ))}
        </div>
        <span className="text-xs tabular-nums text-foreground/55 w-8 text-right">{clock}</span>
      </div>
      {src && (
        <audio
          ref={audioRef}
          src={src}
          preload="metadata"
          onLoadedMetadata={(e) => Number.isFinite(e.currentTarget.duration) && setDuration(e.currentTarget.duration)}
          onTimeUpdate={(e) => e.currentTarget.duration && setProgress(e.currentTarget.currentTime / e.currentTarget.duration)}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => {
            setPlaying(false);
            setProgress(0);
          }}
        />
      )}
      {note && <span className="text-xs text-foreground/50">{note}</span>}
    </div>
  );
}

export default function ShaboSections({ sections, logo, photo, name }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  // Sections that were already shown keep their final state (animation plays once).
  const [seen, setSeen] = useState<number[]>([0]);
  useEffect(() => {
    setSeen((s) => (s.includes(active) ? s : [...s, active]));
  }, [active]);
  const total = sections.length + 1; // + closing screen
  const closing = active === sections.length;

  // Track which snap section is in view for the dot navigation.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const els = Array.from(root.querySelectorAll<HTMLElement>("[data-snap]"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && e.intersectionRatio >= 0.6) setActive(els.indexOf(e.target as HTMLElement));
        }
      },
      { root, threshold: [0.6] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // One wheel gesture / key press = one full section (mouse wheels and trackpad inertia
  // would otherwise scroll the page gradually). Touch keeps native scroll-snap.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let locked = false;
    const sections = () => Array.from(root.querySelectorAll<HTMLElement>("[data-snap]"));
    const step = (dir: 1 | -1) => {
      if (locked) return;
      const els = sections();
      const cur = Math.round(root.scrollTop / root.clientHeight);
      const next = Math.min(els.length - 1, Math.max(0, cur + dir));
      if (next === cur) return;
      locked = true;
      els[next].scrollIntoView({ behavior: "smooth" });
      window.setTimeout(() => (locked = false), 800);
    };
    const onWheel = (e: WheelEvent) => {
      // Horizontal swipe over a carousel: let it scroll natively.
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && (e.target as HTMLElement).closest("[data-carousel]")) return;
      e.preventDefault();
      if (Math.abs(e.deltaY) < 4) return;
      step(e.deltaY > 0 ? 1 : -1);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown" || (e.key === " " && !e.shiftKey)) {
        e.preventDefault();
        step(1);
      } else if (e.key === "ArrowUp" || e.key === "PageUp" || (e.key === " " && e.shiftKey)) {
        e.preventDefault();
        step(-1);
      }
    };
    root.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    return () => {
      root.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const goTo = (i: number) => {
    rootRef.current?.querySelectorAll<HTMLElement>("[data-snap]")[i]?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className={`fixed inset-0 bg-background text-foreground ${openSans.className}`} style={SHABO_THEME}>
      <div ref={rootRef} className="[scrollbar-width:none] [&::-webkit-scrollbar]:hidden h-full overflow-y-auto snap-y snap-mandatory scroll-smooth">
        {sections.map((s, i) => (
          <section
            key={s.id}
            id={s.id}
            data-snap
            className="snap-start snap-always h-dvh flex flex-col items-center gap-5 md:gap-6 px-4 md:px-8 lg:px-12 pt-8 md:pt-6 pb-4 md:pb-10"
          >
            <header className="flex flex-col items-center text-center max-w-[760px] shrink-0 md:shrink md:flex-1 md:justify-center">
              <div style={fadeUp(seen.includes(i), 100)}>
                <Image src={logo} alt="SHABO" width={610} height={190} unoptimized className="h-6 md:h-8 w-auto mb-4 md:mb-6" priority={i === 0} />
              </div>
              <h2 className={`${forum.className} text-lg md:text-2xl font-normal text-foreground leading-tight`}>
                <RiseWords text={s.title} show={seen.includes(i)} start={250} step={60} />
              </h2>
              <p className="text-sm md:text-base text-foreground/65 leading-relaxed">
                <RiseWords text={s.description} show={seen.includes(i)} start={600} step={22} />
              </p>
              {s.voice && <VoiceNote voice={s.voice} photo={photo} show={seen.includes(i)} />}
            </header>

            {/* Stage keeps the Figma proportions on desktop (2500×1532, post ≈79% of its height,
                card ≈69% of its width); on mobile it simply fills the remaining height. */}
            <div className="flex-1 md:flex-none min-h-0 w-full flex items-center justify-center">
              <div
                className="shabo-stage w-full h-full md:h-auto md:aspect-[2500/1532] max-w-[1440px] bg-muted flex items-center justify-center p-4 md:p-0"
                style={{ opacity: seen.includes(i) ? 1 : 0, transition: `opacity 800ms ${EASE} 900ms` }}
              >
                {s.envelope ? (
                  <div className="h-full md:h-[88%] max-w-full flex items-center justify-center" style={imgReveal(seen.includes(i))}>
                    <EnvelopeCard show={seen.includes(i)} alt={s.alt} />
                  </div>
                ) : s.image ? (
                  <div className="relative h-full md:h-[79%] max-w-full" style={{ aspectRatio: `${s.ratio[0]} / ${s.ratio[1]}`, ...imgReveal(seen.includes(i)) }}>
                    <Image
                      src={s.image}
                      alt={s.alt}
                      fill
                      sizes="(min-width: 768px) 520px, 90vw"
                      className="object-contain"
                      priority={i === 0}
                    />
                    {s.slides && s.slides.length > 0 && <PostCarousel slides={s.slides} alt={s.alt} autoplay={s.autoplay} meta={s.meta} />}
                  </div>
                ) : (
                  <div
                    className="w-full md:w-[69%] max-h-full bg-black/[0.06]"
                    style={{ aspectRatio: `${s.ratio[0]} / ${s.ratio[1]}`, ...imgReveal(seen.includes(i)) }}
                    role="img"
                    aria-label={s.alt}
                  />
                )}
              </div>
            </div>
          </section>
        ))}

        <section data-snap className="snap-start snap-always h-dvh flex flex-col items-center justify-center gap-8 px-4">
          <Link href="/" className="group flex flex-col items-center gap-[17px]" aria-label={name}>
            <div
              className="rounded-full overflow-hidden w-[86px] h-[86px]"
              style={{
                opacity: closing ? 1 : 0,
                transform: closing ? "scale(1)" : "scale(0.86)",
                filter: closing ? "blur(0px)" : "blur(16px)",
                transition: closing
                  ? "opacity 900ms cubic-bezier(0.16, 1, 0.3, 1), transform 1100ms cubic-bezier(0.16, 1, 0.3, 1), filter 900ms cubic-bezier(0.16, 1, 0.3, 1)"
                  : "none",
                willChange: "opacity, transform, filter",
              }}
            >
              <Image src={photo} alt="" width={86} height={86} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
            </div>
            <ShaboSignature
              play={closing}
              delay={450}
              label={name}
              className="w-[min(88vw,372px)] h-auto transition-opacity duration-500 group-hover:opacity-70"
            />
          </Link>
        </section>
      </div>

      <nav aria-label="Секції" className="hidden md:flex fixed right-6 top-1/2 -translate-y-1/2 z-10 flex-col gap-3">
        {Array.from({ length: total }).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Секція ${i + 1}`}
            aria-current={active === i}
            className="p-1"
          >
            <span className={`block rounded-full transition-all ${active === i ? "w-2.5 h-6 bg-[var(--shabo-gold)]" : "w-2.5 h-2.5 bg-foreground/25 hover:bg-foreground/50"}`} />
          </button>
        ))}
      </nav>
    </div>
  );
}

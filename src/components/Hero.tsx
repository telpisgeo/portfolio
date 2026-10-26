"use client";

import { useState, useEffect, useRef } from "react";

const greetingsUk = ["Привіт", "Hello", "Hola", "Bonjour", "Ciao", "Hallo", "Olá", "Witaj", "Ahoj", "Sveiki"];
const greetingsEn = ["Hello", "Hola", "Bonjour", "Ciao", "Hallo", "Olá", "Sveiki"];

// Defaults match the original hardcoded copy — used whenever a page doesn't
// pass its own text1/text2 (e.g. the main homepage).
const DEFAULT_TEXT1: Record<"uk" | "en", string> = {
  uk: "я Георгій, продуктовий дизайнер з досвідом запуску продуктів для освітніх та маркетингових мультиканальних платформ.",
  en: "I'm Georgiy, a product designer with experience launching products for educational and multichannel marketing platforms.",
};
// No default second paragraph on the main homepage; pages may still pass their own text2.
const DEFAULT_TEXT2: Record<"uk" | "en", string> = { uk: "", en: "" };

// Site colors for the circles that fly out of the photo (photos come later); the hero background
// (--secondary) is left out on purpose, otherwise they would be invisible.
const BALL_COLORS = [
  "var(--primary)",
  "var(--secondary-foreground)",
  "var(--border)",
  "var(--muted-foreground)",
];
const SPAWN_PER_CLICK = 6;
const MAX_BALLS = 60;
const BALL_SIZE = 64;
const BALL_LIFE_MS: [number, number] = [5000, 6000];
const BALL_FADE_MS = 300;

type Ball = { id: number; size: number; color: string };
type Sim = { x: number; y: number; vx: number; vy: number; size: number; el: HTMLDivElement | null; born: number; ttl: number; dying: boolean };

type HeroProps = {
  locale: string;
  /** Text after the (non-editable, randomized) greeting — e.g. "я Георгій, ...". */
  text1?: string;
  /** Second paragraph, shown below the greeting line. */
  text2?: string;
};

export default function Hero({ locale, text1, text2 }: HeroProps) {
  const isUk = locale === "uk";
  const [greeting, setGreeting] = useState(isUk ? "Привіт" : "Hello");

  useEffect(() => {
    const list = isUk ? greetingsUk : greetingsEn;
    setGreeting(list[Math.floor(Math.random() * list.length)]);
  }, [isUk]);

  // --- "game": click the photo → circles fly out and bounce around inside the hero ---
  const sectionRef = useRef<HTMLElement>(null);
  const slotRef = useRef<HTMLSpanElement>(null);
  const sim = useRef(new Map<number, Sim>());
  const raf = useRef(0);
  const lastT = useRef(0);
  const nextId = useRef(0);
  const [balls, setBalls] = useState<Ball[]>([]);

  // Animation step lives in a ref so it can schedule itself (rAF loop) without a self-referencing callback.
  const step = useRef<(t: number) => void>(() => {});
  useEffect(() => {
    step.current = (t: number) => {
      const sec = sectionRef.current;
      if (sec) {
        const dt = Math.min(32, t - (lastT.current || t)) / 16.67;
        const W = sec.clientWidth;
        const H = sec.clientHeight;
        sim.current.forEach((b, id) => {
          if (!b.dying && t - b.born > b.ttl) {
            b.dying = true;
            const done = () => {
              sim.current.delete(id);
              setBalls((prev) => prev.filter((x) => x.id !== id));
            };
            const inner = b.el?.firstElementChild;
            if (inner) {
              const a = inner.animate([{ transform: "scale(1)" }, { transform: "scale(0)" }], { duration: BALL_FADE_MS, fill: "forwards" });
              a.onfinish = done;
            } else {
              done();
            }
          }
          b.x += b.vx * dt;
          b.y += b.vy * dt;
          if (b.x < 0) { b.x = 0; b.vx = Math.abs(b.vx); }
          else if (b.x + b.size > W) { b.x = W - b.size; b.vx = -Math.abs(b.vx); }
          if (b.y < 0) { b.y = 0; b.vy = Math.abs(b.vy); }
          else if (b.y + b.size > H) { b.y = H - b.size; b.vy = -Math.abs(b.vy); }
          if (b.el) b.el.style.transform = `translate(${b.x}px, ${b.y}px)`;
        });
      }
      lastT.current = t;
      if (sim.current.size === 0) {
        raf.current = 0;
        return;
      }
      raf.current = requestAnimationFrame(step.current);
    };
  }, []);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const spawn = () => {
    const sec = sectionRef.current;
    const slot = slotRef.current;
    if (!sec || !slot) return;
    const sr = sec.getBoundingClientRect();
    const pr = slot.getBoundingClientRect();
    // the slot may be scaled by :hover, so use its center, not its corner
    const cx = pr.left + pr.width / 2 - sr.left;
    const cy = pr.top + pr.height / 2 - sr.top;
    const created: Ball[] = [];
    for (let k = 0; k < SPAWN_PER_CLICK; k++) {
      const id = nextId.current++;
      const size = BALL_SIZE;
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 3;
      sim.current.set(id, { x: cx - size / 2, y: cy - size / 2, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, size, el: null, born: performance.now(), ttl: BALL_LIFE_MS[0] + Math.random() * (BALL_LIFE_MS[1] - BALL_LIFE_MS[0]), dying: false });
      created.push({ id, size, color: BALL_COLORS[Math.floor(Math.random() * BALL_COLORS.length)] });
    }
    setBalls((prev) => {
      const next = [...prev, ...created];
      const dropped = next.splice(0, Math.max(0, next.length - MAX_BALLS));
      dropped.forEach((b) => sim.current.delete(b.id));
      return next;
    });
    if (!raf.current) raf.current = requestAnimationFrame((t) => step.current(t));
  };

  const line1 = text1 ?? DEFAULT_TEXT1[isUk ? "uk" : "en"];
  const line2 = text2 ?? DEFAULT_TEXT2[isUk ? "uk" : "en"];

  // "<greeting>, <я> [photo] <rest…>" — the photo slot sits right after the first word of line1.
  const [first, ...restWords] = line1.replace(/[.。]+$/, "").split(" ");
  const before = [`${greeting},`, first];
  let i = 0;
  const word = (w: string, key: string) => (
    <span key={key}>
      <span className="hero-word-clip">
        <span className="hero-word" style={{ "--i": i++ } as React.CSSProperties}>
          {w}
        </span>
      </span>{" "}
    </span>
  );

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-secondary">
      {/* circles from the photo-click game; behind the text, clipped to the hero */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {balls.map((b) => (
          <div
            key={b.id}
            ref={(el) => {
              const st = sim.current.get(b.id);
              if (!st || !el || st.el === el) return;
              st.el = el;
              el.style.transform = `translate(${st.x}px, ${st.y}px)`;
              el.firstElementChild?.animate(
                [{ transform: "scale(0)" }, { transform: "scale(1)" }],
                { duration: 350, easing: "cubic-bezier(0.34, 1.56, 0.64, 1)" },
              );
            }}
            className="absolute left-0 top-0"
            style={{ width: b.size, height: b.size }}
          >
            <div className="h-full w-full rounded-full" style={{ background: b.color }} />
          </div>
        ))}
      </div>
      <div className="relative z-10 max-w-[1440px] mx-auto px-6 sm:px-12 py-16 md:py-24 flex flex-col items-start">
        <h1 className="text-left text-[clamp(1.75rem,4vw,3.25rem)] font-medium text-secondary-foreground leading-[1.15] max-w-[19em]">
          {before.map((w, k) => word(w, `b${k}`))}
          <span
            ref={slotRef}
            role="button"
            tabIndex={0}
            aria-label={isUk ? "Запустити кружечки" : "Launch circles"}
            data-hero-photo-slot
            onClick={spawn}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                spawn();
              }
            }}
            className="relative z-20 inline-block cursor-pointer align-middle transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-[2] focus-visible:scale-[2] outline-none"
            style={{ width: "1.35em", height: "1.35em", margin: "-0.3em 0.04em" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- decorative inline portrait */}
            <img
              src="/images/hero-photo-face2.webp"
              alt=""
              width={400}
              height={400}
              className="hero-photo block h-full w-full rounded-full object-cover"
              style={{
                objectPosition: "50% 50%",
                ["--photo-delay" as string]: `${before.length * 70 + 150}ms`,
              }}
            />
          </span>{" "}
          {restWords.map((w, k) => word(w, `r${k}`))}
        </h1>
        {line2 && (
          <p className="mt-8 text-left text-[clamp(1.1rem,2vw,1.5rem)] text-secondary-foreground/80 leading-[1.3] max-w-[34em]">
            {line2}
          </p>
        )}
      </div>
    </section>
  );
}

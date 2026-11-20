"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { isFunVideo, type FunSlide } from "@/lib/fun-content";

// Scroll-snap carousel: native swipe/trackpad scrolling, plus arrows, dots and
// ←/→ keys. A single slide renders without any controls.
export default function FunCarousel({ slides, alt }: { slides: FunSlide[]; alt: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const many = slides.length > 1;

  function goTo(i: number) {
    const el = trackRef.current;
    if (!el) return;
    const next = Math.max(0, Math.min(slides.length - 1, i));
    el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
  }

  function onScroll() {
    const el = trackRef.current;
    if (!el) return;
    setIndex(Math.round(el.scrollLeft / el.clientWidth));
  }

  const arrow = "absolute top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-background-alt/90 text-foreground shadow flex items-center justify-center hover:bg-background-alt transition-colors disabled:opacity-0";

  return (
    <div
      className="relative"
      tabIndex={many ? 0 : undefined}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") goTo(index - 1);
        if (e.key === "ArrowRight") goTo(index + 1);
      }}
    >
      {/* Every slide fills the same box (cover), sized by the first slide's ratio and capped at 85vh. */}
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="flex w-full overflow-x-auto snap-x snap-mandatory max-h-[85vh] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ aspectRatio: slides[0].ratio }}
      >
        {slides.map((s, i) => (
          <div key={`${s.src}-${i}`} className="relative w-full h-full shrink-0 snap-center bg-black/[0.04]">
            {isFunVideo(s.src) ? (
              <video
                src={s.src}
                poster={s.poster || undefined}
                className="absolute inset-0 w-full h-full object-cover"
                controls
                autoPlay={i === 0}
                loop
                muted
                playsInline
              />
            ) : (
              <Image
                src={s.src}
                alt={alt}
                fill
                sizes="(min-width: 1024px) 60vw, 100vw"
                priority={i === 0}
                quality={90}
                className="object-cover"
              />
            )}
          </div>
        ))}
      </div>

      {many && (
        <>
          <button type="button" aria-label="Попередня" className={`${arrow} left-3`} disabled={index === 0} onClick={() => goTo(index - 1)}>←</button>
          <button type="button" aria-label="Наступна" className={`${arrow} right-3`} disabled={index === slides.length - 1} onClick={() => goTo(index + 1)}>→</button>
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Слайд ${i + 1}`}
                onClick={() => goTo(i)}
                className={`h-2 rounded-full transition-all ${i === index ? "w-5 bg-foreground" : "w-2 bg-foreground/30"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

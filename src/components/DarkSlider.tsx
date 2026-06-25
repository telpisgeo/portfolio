"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export type Slide = { caption?: string; text: string; imgLabel: string; imgRatio: string; imgSrc?: string };

const DURATION = 10000;

function ImgPlaceholder({ label, ratio }: { label: string; ratio: string }) {
  return (
    <div
      className="w-full bg-black/[0.06] border border-black/5 flex items-center justify-center"
      style={{ aspectRatio: ratio.replace("/", " / ") }}
    >
      <span className="text-sm text-[#FEF9DB]/35 px-4 text-center">{label}</span>
    </div>
  );
}

export default function DarkSlider({
  id,
  caption,
  slides,
}: {
  id?: string;
  caption: string;
  slides: Slide[];
}) {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const next = useCallback(() => {
    setActive((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    setActive((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const startInterval = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(next, DURATION);
  }, [next]);

  useEffect(() => {
    if (playing) {
      startInterval();
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing, startInterval]);

  const goTo = (i: number) => {
    setActive(i);
    if (playing) startInterval();
  };

  const handlePrev = () => {
    prev();
    if (playing) startInterval();
  };

  const handleNext = () => {
    next();
    if (playing) startInterval();
  };

  const slide = slides[active];

  return (
    <div id={id} className="scroll-mt-36 rounded-3xl bg-[#4A2C1A] overflow-hidden flex flex-col">
      <style>{`
        @keyframes dark-slider-progress {
          from { width: 0% }
          to { width: 100% }
        }
      `}</style>

      <div className="px-4 md:px-6 lg:px-8 pt-8 md:pt-10 lg:pt-12 pb-6 md:pb-7 lg:pb-8">
        <div className="max-w-[912px] mx-auto flex flex-col gap-4">
          <p className="text-sm font-bold text-[#FFCD00]">{slide.caption ?? caption}</p>
          <p className="text-[17px] md:text-[22px] lg:text-[30px] leading-[1.3] text-[#FEF9DB] font-normal">{slide.text}</p>
        </div>
      </div>

      <div className="max-w-[1144px] mx-auto w-full px-4 md:px-6 lg:px-8">
        {slide.imgSrc
          ? <img src={slide.imgSrc} alt={slide.imgLabel} className="w-full rounded-lg" />
          : <ImgPlaceholder label={slide.imgLabel} ratio={slide.imgRatio} />}
      </div>

      {slides.length > 1 && (
        <div className="flex items-center justify-center gap-4 py-7">
          {/* Prev arrow */}
          <button
            onClick={handlePrev}
            className="w-9 h-9 rounded-full bg-[#FEF9DB]/15 hover:bg-[#FEF9DB]/25 flex items-center justify-center transition-colors shrink-0"
            aria-label="Попередній"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8L10 13" stroke="#FEF9DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Dots in pill */}
          <div className="flex items-center gap-2 bg-[#FEF9DB]/10 rounded-full px-3 h-9">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="h-2 rounded-full overflow-hidden bg-[#FEF9DB]/20 transition-all duration-300 hover:bg-[#FEF9DB]/30"
                style={{ width: i === active ? 48 : 8 }}
                aria-label={`Слайд ${i + 1}`}
              >
                {i === active && (
                  <div
                    key={`${active}-${playing}`}
                    className="h-full bg-[#FFCD00] rounded-full"
                    style={
                      playing
                        ? { animation: `dark-slider-progress ${DURATION}ms linear forwards` }
                        : { width: "0%" }
                    }
                  />
                )}
              </button>
            ))}
          </div>

          {/* Play/pause */}
          <button
            onClick={() => setPlaying((p) => !p)}
            className="w-9 h-9 rounded-full bg-[#FEF9DB]/15 hover:bg-[#FEF9DB]/25 flex items-center justify-center transition-colors shrink-0"
            aria-label={playing ? "Зупинити" : "Запустити"}
          >
            {playing ? (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <rect x="2" y="1.5" width="3" height="9" rx="1" fill="#FEF9DB"/>
                <rect x="7" y="1.5" width="3" height="9" rx="1" fill="#FEF9DB"/>
              </svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M3 1.5L10 6L3 10.5V1.5Z" fill="#FEF9DB"/>
              </svg>
            )}
          </button>

          {/* Next arrow */}
          <button
            onClick={handleNext}
            className="w-9 h-9 rounded-full bg-[#FEF9DB]/15 hover:bg-[#FEF9DB]/25 flex items-center justify-center transition-colors shrink-0"
            aria-label="Наступний"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 3L11 8L6 13" stroke="#FEF9DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

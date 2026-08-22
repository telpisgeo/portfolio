"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Testimonial } from "@/lib/home-content";

type Props = {
  locale: string;
  testimonials: Testimonial[];
};

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function QuoteIcon({ className }: { className?: string }) {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M7.17 6C4.87 8.02 3.5 10.8 3.5 13.86c0 2.98 1.9 4.94 4.13 4.94 1.98 0 3.4-1.53 3.4-3.4 0-1.8-1.28-3.2-2.98-3.2-.28 0-.5.02-.68.07.2-1.9 1.66-3.9 3.4-5.1L7.17 6zm9.9 0c-2.3 2.02-3.67 4.8-3.67 7.86 0 2.98 1.9 4.94 4.13 4.94 1.98 0 3.4-1.53 3.4-3.4 0-1.8-1.28-3.2-2.98-3.2-.28 0-.5.02-.68.07.2-1.9 1.66-3.9 3.4-5.1L17.07 6z" />
    </svg>
  );
}

export default function Testimonials({ locale, testimonials }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const active = activeIndex !== null ? testimonials[activeIndex] : null;

  if (testimonials.length === 0) return null;

  useEffect(() => {
    if (!active) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveIndex(null);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [active]);

  return (
    <section className="max-w-[1440px] w-full mx-auto px-6 sm:px-12">
      <h2 className="text-4xl font-medium text-foreground mb-8">
        {locale === "uk" ? "Відгуки" : "Testimonials"}
      </h2>

      <div className="bg-surface-about rounded-lg overflow-hidden">
        {testimonials.map((item, i) => (
          <div
            key={item.name}
            className={`p-8 flex flex-col md:flex-row md:items-start gap-6 ${
              i > 0 ? "border-t border-border" : ""
            }`}
          >
            <div className="flex-1 flex flex-col gap-3">
              <QuoteIcon className="text-primary shrink-0" />
              <p className="text-3xl font-medium text-foreground leading-snug">{item.quote}</p>
              <button
                type="button"
                onClick={() => setActiveIndex(i)}
                className="w-fit text-sm font-medium text-foreground underline underline-offset-4 hover:opacity-70 transition-opacity"
              >
                {locale === "uk" ? "Читати повністю" : "Read all"}
              </button>
            </div>

            <div className="flex items-center gap-4 shrink-0 md:ml-auto md:mt-11 md:w-[262px]">
              {item.photo ? (
                <Image
                  src={item.photo}
                  alt={item.name}
                  width={56}
                  height={56}
                  className="w-14 h-14 rounded-full object-cover shrink-0"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-muted shrink-0" />
              )}
              <div className="flex flex-col items-start gap-1">
                {item.companyIcon && (
                  <Image
                    src={item.companyIcon}
                    alt={item.company}
                    width={72}
                    height={19}
                    className="h-4 w-auto mb-0.5"
                  />
                )}
                <p className="text-base font-semibold text-foreground leading-tight">{item.name}</p>
                <p className="text-sm text-foreground/70 leading-tight max-w-[190px]">{item.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {active && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm animate-[fadeIn_0.3s_ease]"
            onClick={() => setActiveIndex(null)}
          />
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            onClick={() => setActiveIndex(null)}
          >
            <div
              role="dialog"
              aria-modal="true"
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-[720px] max-h-[85vh] overflow-y-auto bg-white rounded-3xl p-8 sm:p-12 shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setActiveIndex(null)}
                aria-label={locale === "uk" ? "Закрити" : "Close"}
                className="absolute top-6 right-6 w-9 h-9 flex items-center justify-center rounded-full hover:bg-muted transition-colors text-muted-foreground"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>

              <QuoteIcon className="text-primary mb-6" />

              <div className="flex flex-col gap-4 text-lg text-foreground leading-relaxed pr-6">
                {active.fullQuote.split("\n\n").map((paragraph, pi) => (
                  <p key={pi}>{paragraph}</p>
                ))}
              </div>

              <div className="flex items-center justify-between gap-4 mt-10 pt-6 border-t border-border">
                <div className="flex items-center gap-3 min-w-0">
                  {active.photo ? (
                    <Image
                      src={active.photo}
                      alt={active.name}
                      width={44}
                      height={44}
                      className="w-11 h-11 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold shrink-0">
                      {initials(active.name)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-base font-medium text-foreground truncate">{active.name}</p>
                    <p className="text-sm text-muted-foreground truncate">{active.role}</p>
                  </div>
                </div>

                {active.sourceUrl && (
                  <a
                    href={active.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-white bg-[#0A66C2] rounded-full pl-3 pr-4 py-2.5 hover:brightness-95 transition-all shrink-0"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.85 0-2.14 1.44-2.14 2.94v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56z" />
                    </svg>
                    Verify
                  </a>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

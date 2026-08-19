"use client";

import { useState, useEffect } from "react";
import InteractiveCollage from "./InteractiveCollage";

const greetingsUk = ["Привіт", "Hello", "Hola", "Bonjour", "Ciao", "Hallo", "Olá", "Witaj", "Ahoj", "Sveiki"];
const greetingsEn = ["Hello", "Hola", "Bonjour", "Ciao", "Hallo", "Olá", "Sveiki"];

// Defaults match the original hardcoded copy — used whenever a page doesn't
// pass its own text1/text2 (e.g. the main homepage).
const DEFAULT_TEXT1: Record<"uk" | "en", string> = {
  uk: "я Георгій, продуктовий дизайнер з досвідом запуску продуктів для освітніх платформ та маркетингових мультиканальних сервісів.",
  en: "I'm Georgiy, a product designer with experience launching products for educational platforms and multichannel marketing services.",
};
const DEFAULT_TEXT2: Record<"uk" | "en", string> = {
  uk: "Використовую сучасні підходи до проєктування та роблю прототипи з допомогою ШІ для тестування нових ідей в продукті.",
  en: "I use modern design practices and build AI prototypes to test new product ideas quickly.",
};

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

  const line1 = text1 ?? DEFAULT_TEXT1[isUk ? "uk" : "en"];
  const line2 = text2 ?? DEFAULT_TEXT2[isUk ? "uk" : "en"];

  return (
    <section className="relative bg-secondary overflow-hidden" style={{ minHeight: "calc(100vh - 64px)" }}>
      {/* Main content */}
      <div className="max-w-[1440px] mx-auto px-6 sm:px-12 h-full flex flex-row items-end gap-0" style={{ minHeight: "calc(100vh - 64px)" }}>

        {/* Left: text */}
        <div className="flex-1 flex flex-col justify-end pb-[135px] pr-8 z-10 hero-text">
          <h1 className="text-[clamp(1.35rem,2.8vw,2.25rem)] font-medium text-secondary-foreground leading-[1.25] max-w-[740px]">
            {greeting}, {line1}
          </h1>
          <p className="mt-8 text-[clamp(1.35rem,2.8vw,2.25rem)] font-medium text-secondary-foreground leading-[1.25] max-w-[740px] hero-text-second">
            {line2}
          </p>
        </div>

        {/* Right: interactive collage (hidden below 700px) — above text so pieces drag over it */}
        <div className="shrink-0 w-[280px] md:w-[360px] lg:w-[474px] hidden [@media(min-width:700px)]:flex items-end justify-center pb-[135px] relative z-20 hero-image">
          <InteractiveCollage resetLabel={isUk ? "Зібрати назад" : "Put it back"} />
        </div>
      </div>

      {/* Animated scroll arrow */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="text-secondary-foreground animate-arrow-bounce">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </div>
    </section>
  );
}

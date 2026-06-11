"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

const greetingsUk = ["Привіт", "Hello", "Hola", "Bonjour", "Ciao", "Hallo", "Olá", "Witaj", "Ahoj", "Sveiki"];
const greetingsEn = ["Hello", "Hola", "Bonjour", "Ciao", "Hallo", "Olá", "Sveiki"];

type HeroProps = {
  locale: string;
};

export default function Hero({ locale }: HeroProps) {
  const isUk = locale === "uk";
  const [greeting, setGreeting] = useState(isUk ? "Привіт" : "Hello");

  useEffect(() => {
    const list = isUk ? greetingsUk : greetingsEn;
    setGreeting(list[Math.floor(Math.random() * list.length)]);
  }, [isUk]);

  return (
    <section className="relative bg-[#4f2a16] overflow-hidden" style={{ minHeight: "calc(100vh - 64px)" }}>
      {/* Main content */}
      <div className="max-w-[1440px] mx-auto px-6 sm:px-12 h-full flex flex-row items-end gap-0" style={{ minHeight: "calc(100vh - 64px)" }}>

        {/* Left: text */}
        <div className="flex-1 flex flex-col justify-end pb-[135px] pr-8 z-10 hero-text">
          <p className="text-[clamp(1.35rem,2.8vw,2.25rem)] font-medium text-[#fef9db] leading-[1.25] max-w-[740px]">
            {isUk
              ? `${greeting}, я Георгій, продуктовий дизайнер з досвідом запуску продуктів для освітніх платформ та маркетингових мультиканальних сервісів.`
              : `${greeting}, I'm Georgiy, a product designer with experience launching products for educational platforms and multichannel marketing services.`}
          </p>
          <p className="mt-8 text-[clamp(1.35rem,2.8vw,2.25rem)] font-medium text-[#fef9db] leading-[1.25] max-w-[740px] hero-text-second">
            {isUk
              ? "Використовую сучасні підходи до проєктування та роблю прототипи з допомогою ШІ для тестування нових ідей в продукті."
              : "I use modern design practices and build AI prototypes to test new product ideas quickly."}
          </p>
        </div>

        {/* Right: collage (hidden below 700px) */}
        <div className="shrink-0 w-[280px] md:w-[360px] lg:w-[474px] hidden [@media(min-width:700px)]:flex justify-center pb-[135px] hero-image">
          <Image
            src="/images/hero-collage.png"
            alt="Георгій Тельпіс"
            width={474}
            height={622}
            quality={100}
            unoptimized
            className="object-contain object-bottom w-full h-auto"
            priority
          />
        </div>
      </div>

      {/* Animated scroll arrow */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="text-[#fef9db] animate-arrow-bounce">
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

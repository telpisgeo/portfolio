"use client";

import { useState } from "react";
import Link from "next/link";
import { useHideOnScroll } from "@/lib/useHideOnScroll";

type NavbarProps = {
  locale: string;
  otherLocale: string;
  otherLabel: string;
  cvUrl: string;
  cvButton: string;
  contactLabel: string;
  worksLabel: string;
  aboutLabel: string;
  variant?: "dark" | "light" | "case";
  hideOnScroll?: boolean;
};

export default function Navbar({
  locale,
  otherLocale,
  otherLabel,
  contactLabel,
  worksLabel,
  aboutLabel,
  variant = "dark",
  hideOnScroll = false,
}: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const hidden = useHideOnScroll(hideOnScroll) && !menuOpen;

  const isDark = variant === "dark";

  const bg = isDark ? "bg-[#4f2a16] border-white/10" : variant === "case" ? "bg-[#FCF9DF] border-border" : "bg-background border-border";
  const dropdownBg = isDark ? "bg-[#4f2a16] border-white/10" : "bg-background border-border";
  const text = isDark ? "text-[#fef9db]" : "text-foreground";
  const textMuted = isDark ? "text-[#fef9db]/70" : "text-foreground/50";
  const hoverText = isDark ? "hover:text-[#fef9db]" : "hover:text-foreground";
  const hoverBg = isDark ? "hover:bg-white/10" : "hover:bg-muted";
  const burgerColor = isDark ? "bg-[#fef9db]" : "bg-foreground";
  const dropdownText = isDark ? "text-[#fef9db]/80 border-white/10" : "text-foreground/80 border-border";
  const dropdownMuted = isDark ? "text-[#fef9db]/50" : "text-muted-foreground";
  const homeLabel = locale === "uk" ? "← Головна" : "← Home";

  return (
    <header
      className={`sticky top-0 z-40 border-b ${bg} transition-[transform,translate] duration-300 will-change-transform ${hidden ? "-translate-y-full" : "translate-y-0"}`}
    >
      <nav className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 h-16 flex items-center justify-between gap-4">

        {/* Left: back link or name */}
        {isDark ? (
          <Link
            href={`/${locale}`}
            className="flex items-center shrink-0"
            onClick={() => setMenuOpen(false)}
          >
            <span className={`text-sm font-medium ${text} leading-tight`}>
              {locale === "uk" ? "Тельпіс Георгій" : "Georgiy Telpis"}
            </span>
          </Link>
        ) : (
          <Link
            href={`/${locale}`}
            className="group flex items-center gap-2 shrink-0"
            onClick={() => setMenuOpen(false)}
          >
            <span className="inline-flex items-center overflow-hidden w-4">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="shrink-0 translate-x-1 group-hover:translate-x-0 transition-transform duration-200 ease-out text-foreground"
              >
                <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className={`text-sm font-medium ${text} leading-tight`}>
              {locale === "uk" ? "Головна" : "Home"}
            </span>
          </Link>
        )}

        {/* Center: nav links — only when enough space */}
        <div className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          <a
            href={`/${locale}#works`}
            className={`px-4 py-2 text-sm font-medium ${textMuted} ${hoverText} transition-colors rounded-full ${hoverBg}`}
          >
            {worksLabel}
          </a>
          <a
            href={`/${locale}#about`}
            className={`px-4 py-2 text-sm font-medium ${textMuted} ${hoverText} transition-colors rounded-full ${hoverBg}`}
          >
            {aboutLabel}
          </a>
        </div>

        {/* Right: lang switcher + contact + burger */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href={`/${otherLocale}`}
            className={`text-sm font-medium ${textMuted} ${hoverText} transition-all px-4 py-2 rounded-full ${hoverBg} hidden sm:block`}
          >
            {otherLabel}
          </Link>

          <a
            href={locale === "uk" ? "/cv-telpis-ua.pdf" : "/cv-telpis-en.pdf"}
            download
            className={`hidden md:inline-flex items-center justify-center h-9 px-5 rounded-full border text-sm font-medium transition-colors whitespace-nowrap ${isDark ? "border-[#fef9db]/30 text-[#fef9db] hover:bg-white/10" : "border-border text-foreground hover:bg-muted"}`}
          >
            {locale === "uk" ? "Завантажити CV" : "Download CV"}
          </a>

          <a
            href="mailto:gtelpis@gmail.com"
            className="hidden md:inline-flex items-center justify-center h-9 px-5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/85 transition-colors whitespace-nowrap"
          >
            {contactLabel}
          </a>

          {/* Burger — until lg */}
          <button
            className={`lg:hidden flex flex-col justify-center items-center w-9 h-9 gap-[5px] rounded-md ${hoverBg} transition-colors`}
            aria-label="Меню"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className={`block h-[1.5px] w-5 ${burgerColor} transition-all origin-center ${menuOpen ? "rotate-45 translate-y-[6.5px]" : ""}`} />
            <span className={`block h-[1.5px] w-5 ${burgerColor} transition-all ${menuOpen ? "opacity-0 scale-x-0" : ""}`} />
            <span className={`block h-[1.5px] w-5 ${burgerColor} transition-all origin-center ${menuOpen ? "-rotate-45 -translate-y-[6.5px]" : ""}`} />
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className={`lg:hidden border-t ${dropdownBg} px-6 py-4 flex flex-col gap-1`}>
          <a
            href={`/${locale}#works`}
            className={`py-3 text-sm font-medium border-b ${dropdownText}`}
            onClick={() => setMenuOpen(false)}
          >
            {worksLabel}
          </a>
          <a
            href={`/${locale}#about`}
            className={`py-3 text-sm font-medium border-b ${dropdownText}`}
            onClick={() => setMenuOpen(false)}
          >
            {aboutLabel}
          </a>
          <a
            href="mailto:gtelpis@gmail.com"
            className={`py-3 text-sm font-medium border-b ${dropdownText}`}
            onClick={() => setMenuOpen(false)}
          >
            {contactLabel}
          </a>
          <a
            href={locale === "uk" ? "/cv-telpis-ua.pdf" : "/cv-telpis-en.pdf"}
            download
            className={`py-3 text-sm font-medium border-b ${dropdownText}`}
            onClick={() => setMenuOpen(false)}
          >
            {locale === "uk" ? "Завантажити CV" : "Download CV"}
          </a>
          <Link
            href={`/${otherLocale}`}
            className={`py-3 text-sm font-medium ${dropdownMuted}`}
            onClick={() => setMenuOpen(false)}
          >
            {otherLabel}
          </Link>
        </div>
      )}
    </header>
  );
}

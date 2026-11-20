import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { translations, type Locale } from "@/lib/translations";
import { localeAlternates, SITE_URL, socialMetadata } from "@/lib/seo";
import { FUN_CONTENT } from "@/lib/fun-content";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FunWall from "@/components/FunWall";

const COPY = {
  uk: {
    title: "Fun: концепти, ілюстрації та драфти — Георгій Тельпіс",
    heading: "Girls Just Want to Have Fun",
    description: "Неофіційне портфоліо Георгія Тельпіса: концепти, ілюстрації, експерименти й чернетки, які не потрапили в кейси. Усе, що я роблю заради фану.",
    empty: "Скоро тут щось з'явиться.",
  },
  en: {
    title: "Fun: concepts, illustrations and drafts — Georgiy Telpis",
    heading: "Girls Just Want to Have Fun",
    description: "The unofficial side of Georgiy Telpis's portfolio: concepts, illustrations, experiments and drafts that never made it into the case studies. Everything I make just for fun.",
    empty: "Something will show up here soon.",
  },
} as const;

export function generateStaticParams() {
  return [{ locale: "uk" }, { locale: "en" }];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "uk" && locale !== "en") return {};
  const c = COPY[locale];
  return {
    title: c.title,
    description: c.description,
    alternates: localeAlternates(locale, "/fun"),
    ...socialMetadata(locale, `${SITE_URL}/${locale}/fun`, c.title, c.description),
  };
}

export default async function FunPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== "uk" && locale !== "en") notFound();
  const t = translations[locale as Locale];
  const c = COPY[locale];
  const otherLocale = locale === "uk" ? "en" : "uk";
  const otherLabel = locale === "uk" ? "EN" : "UA";

  return (
    <div className="min-h-screen flex flex-col bg-background [--background:#ffffff]">
      <Navbar
        locale={locale}
        otherLocale={otherLocale}
        otherLabel={otherLabel}
        cvUrl={t.cvUrl}
        cvButton={t.cvButton}
        contactLabel={t.navContactLabel}
        variant="case"
        hideOnScroll
      />
      <main className="flex-1 px-4 md:px-8 lg:px-12 pt-14 pb-16">
        <div className="max-w-[1440px] mx-auto">
          <h1 className="text-[22px] md:text-[28px] lg:text-[36px] font-bold text-foreground leading-[1.25] text-center mb-8 md:mb-12">
            {c.heading}
          </h1>
          <FunWall items={FUN_CONTENT.items} empty={c.empty} locale={locale} />
        </div>
      </main>
      <Footer locale={locale} otherLocale={otherLocale} otherLabel={otherLabel} copyright={t.copyright} />
    </div>
  );
}

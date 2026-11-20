import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { translations, type Locale } from "@/lib/translations";
import { localeAlternates, SITE_URL, socialMetadata } from "@/lib/seo";
import { FUN_CONTENT, funSlides } from "@/lib/fun-content";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FunCarousel from "@/components/FunCarousel";
import FunWall from "@/components/FunWall";

const COPY = {
  uk: { back: "Fun", untitled: "Без назви", more: "Ще з Fun", suffix: "Fun — Георгій Тельпіс", fallback: "Неофіційна робота Георгія Тельпіса: концепт, ілюстрація або чернетка, зроблені заради фану." },
  en: { back: "Fun", untitled: "Untitled", more: "More from Fun", suffix: "Fun — Georgiy Telpis", fallback: "An unofficial piece by Georgiy Telpis: a concept, illustration or draft made just for fun." },
} as const;

export function generateStaticParams() {
  return ["uk", "en"].flatMap((locale) => FUN_CONTENT.items.map((it) => ({ locale, id: it.id })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; id: string }> }): Promise<Metadata> {
  const { locale, id } = await params;
  const item = FUN_CONTENT.items.find((it) => it.id === id);
  if ((locale !== "uk" && locale !== "en") || !item) return {};
  const title = item.caption || COPY[locale].untitled;
  const description = item.description || COPY[locale].fallback;
  return {
    title: `${title} — ${COPY[locale].suffix}`,
    description,
    alternates: localeAlternates(locale, `/fun/${id}`),
    ...socialMetadata(locale, `${SITE_URL}/${locale}/fun/${id}`, title, description),
  };
}

export default async function FunItemPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  if (locale !== "uk" && locale !== "en") notFound();
  const item = FUN_CONTENT.items.find((it) => it.id === id);
  if (!item) notFound();
  const t = translations[locale as Locale];
  const c = COPY[locale];
  const otherLocale = locale === "uk" ? "en" : "uk";
  const otherLabel = locale === "uk" ? "EN" : "UA";
  const others = FUN_CONTENT.items.filter((it) => it.id !== id);

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
        homeHref={`/${locale}/fun`}
        homeLabel={c.back}
        switchHref={`/${otherLocale}/fun/${id}`}
      />
      <main className="flex-1 px-4 md:px-8 lg:px-12 pt-8 md:pt-10 pb-16">
        <div className="max-w-[1440px] mx-auto">
          <article className="bg-[#FCF9DF] text-foreground rounded-3xl overflow-hidden flex flex-col lg:flex-row lg:items-stretch">
            <div className="lg:flex-1 min-w-0">
              <FunCarousel slides={funSlides(item)} alt={item.caption ?? ""} />
            </div>
            <div className="lg:w-[380px] lg:shrink-0 p-6 md:p-8 flex flex-col gap-3">
              <h1 className="text-[22px] md:text-[28px] font-bold leading-[1.25]">{item.caption || c.untitled}</h1>
              {item.description && (
                <p className="text-base md:text-lg leading-[1.4] whitespace-pre-line">{item.description}</p>
              )}
            </div>
          </article>

          {others.length > 0 && (
            <section className="mt-14">
              <h2 className="text-sm font-bold text-accent-foreground mb-4">{c.more}</h2>
              <FunWall items={others} empty="" locale={locale} />
            </section>
          )}
        </div>
      </main>
      <Footer locale={locale} otherLocale={otherLocale} otherLabel={otherLabel} copyright={t.copyright} />
    </div>
  );
}

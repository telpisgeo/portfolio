import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { translations, type Locale } from "@/lib/translations";
import { localeAlternates } from "@/lib/seo";

export function generateStaticParams() {
  return [{ locale: "uk" }, { locale: "en" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "uk" && locale !== "en") return {};
  const title = "Перлини Одеси — арт-проєкт · Георгій Тельпіс";
  const description =
    "Арт-проєкт «Перлини Одеси» — про знищені та зникаючі архітектурні пам'ятки Одеси, різноманіття архітектури міста та його історію.";
  return {
    title,
    description,
    alternates: localeAlternates(locale as Locale, "/odesa"),
    openGraph: {
      title,
      description,
      url: `https://www.telpis.com.ua/${locale}/odesa`,
      siteName: "Георгій Тельпіс",
      locale: locale === "uk" ? "uk_UA" : "en_US",
      type: "article",
    },
  };
}

const buildings = [
  {
    title: "Прибутковий будинок та гастрономічний магазин В. А. Дубініна. Пантелеймонівська, 82",
    image: "/odesa/dubinina.jpg",
    paragraphs: [
      "Прибутковий будинок купця та промисловця В. А. Дубініна. Власник будинку займався промисловим виробництвом рибних та м'ясних консервацій, був членом громадських та благодійних організацій.",
      "Будинок спочатку був спроєктований під гастрономічний магазин і побудований у стилі неокласицизму. Архітектором проєкту був А. С. Панпулов.",
      "Будинок був пам'ятником архітектури місцевого значення та був зруйнований у 2015 році. Цьому сприяла радикальна реконструкція кварталу, а також серія умисних підпалів.",
    ],
  },
  {
    title: "Прибутковий будинок О. Т. Донського. Пантелеймонівська, 104",
    image: "/odesa/donskyi.jpg",
    paragraphs: [
      "Прибутковий будинок О. Т. Донського був побудований у 1910 році. Будинок переважно призначався для здачі службовцям і торговцям. У будинку також був магазин.",
      "Попри те, що будинок мав мінімальне фасадне декорування, він мав оригінальне планування: будинок був вузьким і витягнутим.",
      "Будівля постраждала після масштабної реконструкції Привозу, а у 2015 була остаточно зруйнована.",
    ],
  },
  {
    title: "Старий залізничний вокзал Одеси",
    image: "/odesa/vokzal.jpg",
    paragraphs: [
      "Перший залізничний вокзал в Одесі з'явився в 1884 році. Будівля була побудована в неокласичному стилі за проєктом Шретера, але будував її Бернардацці, який виконував обов'язки міського архітектора.",
      "Під час Другої світової війни, у 1944 році, вокзал було підірвано німецькими військами, що відступали.",
    ],
  },
  {
    title: "Дача В. Ф. Докса, Генуезька, 37–39. Територія санаторію «Дружба»",
    image: "/odesa/doksa.jpg",
    paragraphs: [
      "Дача побудована в кінці 1890‑х років на Гагарінському плато, в Аркадії. Власником дачі був Віктор Федорович Докс, суддя і гласний Міської ради. Будинок побудований у стилі неоренесансу й німецького історизму.",
      "У радянський період дача використовувалась як адмінкорпус санаторію. З часом будівля руйнувалась, та остаточно була знищена в 2016 році будівельною компанією «Гефест».",
    ],
  },
  {
    title: "Міський павільйон та буфет «Єнні Ф. і Ко»",
    image: "/odesa/yenni.jpg",
    paragraphs: [
      "Рибний ресторан, буфет Єнні та ресторан «Маяк». Будівля знаходилася на Приморському бульварі, з лівого боку Потьомкінських сходів. Будівля була зруйнована в період Другої світової війни.",
      "Протягом останніх десятиліть об'єкт був у занедбаному стані та поступово зруйнувався.",
    ],
  },
];

export default async function OdesaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale !== "uk" && locale !== "en") notFound();

  const otherLocale = locale === "uk" ? "en" : "uk";
  const otherLabel = locale === "uk" ? "EN" : "UA";
  const t = translations[locale as Locale];

  return (
    <div className="min-h-screen flex flex-col bg-background">

      <Navbar
        locale={locale}
        otherLocale={otherLocale}
        otherLabel={otherLabel}
        cvUrl={t.cvUrl}
        cvButton={t.cvButton}
        worksLabel={t.navWorksLabel}
        aboutLabel={t.navAboutLabel}
        contactLabel={t.navContactLabel}
        variant="light"
      />

      <main className="flex-1 flex flex-col">

        {/* ── Hero / Intro ─────────────────────────────────── */}
        <section className="max-w-[1100px] mx-auto w-full px-6 pt-20 pb-16">
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest mb-8">
            Арт-проєкт
          </p>
          <h1 className="text-[56px] font-medium text-foreground leading-[1.08] mb-10 max-w-[700px]">
            Перлини Одеси
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-[660px]">
            Артпроєкт «Перлини Одеси» — це спроба привернути увагу до проблеми
            знищення архітектурних пам'яток Одеси, або будинків які перебувають
            на грані знищення. Показати різноманіття архітектури міста та її
            історію.
          </p>
        </section>

        {/* ── Buildings ────────────────────────────────────── */}
        {buildings.map((b, i) => (
          <div key={i}>
            <hr className="border-border" />

            {/* Illustration */}
            <div className="max-w-[1100px] mx-auto w-full px-6 py-10">
              <div className="rounded-[8px] overflow-hidden bg-muted">
                <Image
                  src={b.image}
                  alt={b.title}
                  width={1160}
                  height={817}
                  className="w-full h-auto"
                  priority={i === 0}
                />
              </div>
            </div>

            {/* Two-column text: title left / description right */}
            <div className="max-w-[1100px] mx-auto w-full px-6 pb-16">
              <div className="flex gap-16 items-start">
                {/* Title */}
                <div className="w-[280px] shrink-0">
                  <h2 className="text-base font-medium text-foreground leading-snug">
                    {b.title}
                  </h2>
                </div>
                {/* Description */}
                <div className="flex-1 min-w-0 flex flex-col gap-4">
                  {b.paragraphs.map((p, j) => (
                    <p key={j} className="text-base text-foreground/75 leading-relaxed">
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}

      </main>

      {/* ── Footer ──────────────────────────────────────────── */}
      <hr className="border-border" />
      <Footer
        locale={locale}
        otherLocale={otherLocale}
        otherLabel={otherLabel}
        copyright="© 2010–2026 Тельпіс Георгій"
      />

    </div>
  );
}

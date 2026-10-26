import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { translations, type Locale } from "@/lib/translations";
import { localeAlternates, personJsonLd } from "@/lib/seo";
import homeJson from "@/data/home.json";
import type { HomeContent } from "@/lib/home-content";
import { hasPetProjects } from "@/lib/pet-projects";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import OtherProjects from "@/components/OtherProjects";
import CvDownloadLink from "@/components/CvDownloadLink";
import WorksSection from "@/components/WorksSection";
import { companyToWorkItem, petToWorkItem } from "@/lib/work-items";
import Testimonials from "@/components/Testimonials";

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
  const t = translations[locale as Locale];
  const isUk = locale === "uk";
  return {
    title: isUk
      ? "Тельпіс Георгій. Продуктовий дизайнер."
      : "Georgiy Telpis. Product Designer.",
    description: isUk
      ? "Досвід запуску складних продуктів в доменах EdTech та MarTech від ідеї до релізу."
      : "Experience launching complex products in EdTech and MarTech domains from idea to release.",
    alternates: localeAlternates(locale as Locale, ""),
    openGraph: {
      title: isUk ? "Тельпіс Георгій. Продуктовий дизайнер." : "Georgiy Telpis. Product Designer.",
      description: isUk
        ? "Досвід запуску складних продуктів в доменах EdTech та MarTech від ідеї до релізу."
        : "Experience launching complex products in EdTech and MarTech domains from idea to release.",
      locale: isUk ? "uk_UA" : "en_US",
      type: "website",
      images: [{ url: isUk ? "https://www.telpis.com.ua/og-ua-v2.png" : "https://www.telpis.com.ua/og-en-v2.png", width: 1200, height: 628 }],
    },
  };
}

export default async function LocalePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (locale !== "uk" && locale !== "en") notFound();

  const t = translations[locale as Locale];
  const otherLocale = locale === "uk" ? "en" : "uk";
  const otherLabel = locale === "uk" ? "EN" : "UA";

  const home = (homeJson as unknown as HomeContent)[locale as "uk" | "en"];
  const companies = home.companies;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd(locale as Locale)) }}
      />
      <Navbar
        locale={locale}
        otherLocale={otherLocale}
        otherLabel={otherLabel}
        cvUrl={t.cvUrl}
        cvButton={t.cvButton}
        worksLabel={t.navWorksLabel}
        aboutLabel={t.navAboutLabel}
        showPetProjects={hasPetProjects(locale)}
        contactLabel={t.navContactLabel}
      />
      <Hero locale={locale} />

      <main className="flex-1 flex flex-col pb-16">

        {/* Projects */}
        <div id="works" className="flex flex-col">
          {home.worksTitle && (
            <div className="max-w-[1440px] w-full mx-auto px-6 sm:px-12">
              <h2 className="text-4xl font-medium text-foreground">
                {home.worksTitle}
              </h2>
            </div>
          )}
          {/* Side project first (newest), then the cases — one list and one timeline, no separate category. */}
          <WorksSection
            items={[
              ...(home.petProjects?.items ?? []).map((p) => petToWorkItem(p, locale)),
              ...companies.map((c) => companyToWorkItem(c, locale)),
            ]}
            locale={locale}
            showTimeline
          />
        </div>

      </main>

      {/* Testimonials */}
      <Testimonials locale={locale} testimonials={home.testimonials} />

      {/* About section */}
      <section
        id="about"
        aria-label={locale === "uk" ? "Досвід роботи та освіта" : "Work, experience & education"}
        className="mt-16 pt-16 pb-16 bg-surface-about"
      >
        <div className="max-w-[1440px] w-full mx-auto px-6 sm:px-12">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

            {/* Left: photo */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <Image
                src="/images/my_photo/photo_me.webp"
                alt=""
                width={1366}
                height={903}
                className="w-full max-w-md h-auto"
              />
            </div>

          {/* Right: About me text and the CV download button (the experience timeline is not shown; copy kept in docs/experience-timeline.md) */}
          <div className="flex flex-col">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-6">
              {locale === "uk" ? "Про мене" : "About me"}
            </p>
            <div className="flex flex-col gap-5 text-lg text-foreground/75 leading-relaxed mb-6">
              {home.about.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            {/* CV download button */}
            <div className="pt-6">
              <CvDownloadLink locale={locale} cvUrl={t.cvUrl} />
            </div>

          </div>

          </div>{/* end grid */}

        </div>
      </section>

      <Footer
        locale={locale}
        otherLocale={otherLocale}
        otherLabel={otherLabel}
        copyright={t.copyright}
      />
    </div>
  );
}

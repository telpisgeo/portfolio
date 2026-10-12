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

      <main className="flex-1 flex flex-col py-16">

        {/* Projects */}
        <div id="works" className="flex flex-col">
          {home.worksTitle && (
            <div className="max-w-[1440px] w-full mx-auto px-6 sm:px-12">
              <h2 className="text-4xl font-medium text-foreground">
                {home.worksTitle}
              </h2>
            </div>
          )}
          <WorksSection items={companies.map((c) => companyToWorkItem(c, locale))} locale={locale} showTimeline />
        </div>

      </main>

      {/* Pet projects */}
      {home.petProjects && home.petProjects.items.length > 0 && (
        <section id="pet-projects" className="scroll-mt-20 pb-16">
          <div className="max-w-[1440px] w-full mx-auto px-6 sm:px-12">
            <h2 className="text-4xl font-medium text-foreground">{home.petProjects.title}</h2>
          </div>
          <WorksSection items={home.petProjects.items.map((p) => petToWorkItem(p, locale))} locale={locale} />
        </section>
      )}

      {/* Testimonials */}
      <Testimonials locale={locale} testimonials={home.testimonials} />

      {/* About section */}
      <section id="about" className="mt-16 pt-16 pb-16 bg-surface-about">
        <div className="max-w-[1440px] w-full mx-auto px-6 sm:px-12">

          <h2 className="text-4xl font-medium text-foreground mb-16 leading-tight">
            {locale === "uk"
              ? "Досвід роботи та освіта"
              : "Work, experience & education"}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

            {/* Left: About me */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-6">
                {locale === "uk" ? "Про мене" : "About me"}
              </p>

              {/* Photo stack */}
              <div className="mb-8">
                <Image
                  src="/images/my_photo/photo_me.webp"
                  alt=""
                  width={1366}
                  height={903}
                  className="w-full max-w-md h-auto"
                />
              </div>

              <div className="flex flex-col gap-5 text-lg text-foreground/75 leading-relaxed">
                {home.about.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>

          {/* Right: Timeline */}
          <div className="flex flex-col">
            {home.timeline.map((item) => (
              <div key={item.company} className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-2 md:gap-8 py-10 border-b border-border last:border-0">
                <span className="text-sm text-muted-foreground pt-1.5 shrink-0">{item.period}</span>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 shrink-0">
                      {item.icon ? (
                        <Image
                          src={item.icon}
                          alt={item.company}
                          width={36}
                          height={36}
                          className="w-9 h-9 rounded-xl"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
                          <span className="text-muted-foreground/40 text-xs font-medium">
                            {item.company.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <h3 className="text-2xl font-medium text-foreground">{item.company}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 pl-12">{item.role}</p>
                  <p className="text-base text-foreground/75 leading-relaxed max-w-2xl">{item.desc}</p>
                </div>
              </div>
            ))}

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

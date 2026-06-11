import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { translations, type Locale } from "@/lib/translations";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import OtherProjects from "@/components/OtherProjects";


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
    openGraph: {
      title: isUk ? "Тельпіс Георгій. Продуктовий дизайнер." : "Georgiy Telpis. Product Designer.",
      description: isUk
        ? "Досвід запуску складних продуктів в доменах EdTech та MarTech від ідеї до релізу."
        : "Experience launching complex products in EdTech and MarTech domains from idea to release.",
      locale: isUk ? "uk_UA" : "en_US",
      type: "website",
      images: [{ url: isUk ? "/og-image-ua.png" : "/og-image-en.png", width: 1200, height: 628 }],
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        locale={locale}
        otherLocale={otherLocale}
        otherLabel={otherLabel}
        cvUrl={t.cvUrl}
        cvButton={t.cvButton}
        worksLabel={t.navWorksLabel}
        aboutLabel={t.navAboutLabel}
        contactLabel={t.navContactLabel}
      />
      <Hero locale={locale} />

      <main className="flex-1 flex flex-col py-16">

        {/* Projects */}
        <div id="works" className="flex flex-col gap-24">
          {t.companies.map((company) => (
            <div key={company.name} className="max-w-[1440px] w-full mx-auto px-6 sm:px-12">

              {/* Header row: icon placeholder + name + type */}
              <div className="flex items-center gap-3 mb-6">
                {/* Icon */}
                <div className="w-9 h-9 shrink-0">
                  {company.icon ? (
                    <Image
                      src={company.icon}
                      alt={company.name}
                      width={36}
                      height={36}
                      className="w-9 h-9 rounded-xl"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
                      <span className="text-muted-foreground/40 text-xs font-medium">
                        {company.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-0.5">
                  <a
                    href={company.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-medium text-foreground hover:underline underline-offset-2"
                  >{company.name}</a>
                  {company.productType && (
                    <span className="text-sm text-muted-foreground">{company.productType}</span>
                  )}
                </div>
              </div>

              {/* Screenshots */}
              {company.images && company.images.length > 0 && (
                <div className="flex flex-col gap-3 mb-4">
                  {company.images.map((src) => (
                    <div key={src} className="relative overflow-hidden rounded-[8px] bg-muted">
                      <Image
                        src={src}
                        alt={company.name}
                        width={1200}
                        height={800}
                        className="w-full h-auto"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Below screenshots: description left + details right */}
              <div className="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-4 md:gap-8 pt-3">

                {/* Left: description */}
                <div className="flex flex-col gap-5">
                  <p className="text-xl text-foreground/75 leading-relaxed max-w-[620px]">
                    {company.description}
                  </p>
                </div>

                {/* Right: meta details */}
                <div className="flex flex-col gap-4 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground/60 uppercase tracking-widest mb-1">
                      {locale === "uk" ? "Рік" : "Year"}
                    </p>
                    <p className="text-foreground">{company.period}</p>
                  </div>
                  {company.role && (
                    <div>
                      <p className="text-xs text-muted-foreground/60 uppercase tracking-widest mb-1">
                        {locale === "uk" ? "Роль" : "Role"}
                      </p>
                      <p className="text-foreground">{company.role}</p>
                    </div>
                  )}
                  {company.tools && (
                    <div>
                      <p className="text-xs text-muted-foreground/60 uppercase tracking-widest mb-1">
                        {locale === "uk" ? "Інструменти" : "Tools"}
                      </p>
                      <p className="text-muted-foreground leading-relaxed">{company.tools}</p>
                    </div>
                  )}
                </div>

              </div>

            </div>
          ))}
        </div>

      </main>

      {/* About section */}
      <section id="about" className="mt-16 pt-16 pb-16 bg-[#fdf8e7]">
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
              <div className="flex flex-col gap-5 text-lg text-foreground/75 leading-relaxed">
                {locale === "uk" ? (
                  <>
                    <p>Привіт, я Георгій — продуктовий дизайнер з досвідом понад 8 років у проєктуванні цифрових продуктів.</p>
                    <p>Спеціалізуюсь на EdTech та MarTech. Проходжу повний дизайн-цикл: від досліджень і архітектури інформації до специфікацій у Figma і передачі розробникам.</p>
                    <p>Маю досвід з інструментами імейл-маркетингу, автоматизацією розсилок у LinkedIn, конструкторами курсів та освітніми мобільними застосунками.</p>
                    <p>Захоплююсь прототипуванням з допомогою ШІ та вайб-кодингом — люблю коли ідея за кілька днів стає реальним продуктом, який можна протестувати на користувачах.</p>
                  </>
                ) : (
                  <>
                    <p>Hey, I&apos;m Georgiy — a product designer with 8+ years of experience in digital SaaS product design.</p>
                    <p>I specialize in EdTech and MarTech. I work across the full design cycle: from user research and IA to Figma specs and developer handoff. I do my best work as the first designer on a team — building processes from scratch.</p>
                    <p>I have experience with email marketing tools, LinkedIn outreach automation, course builders, and educational mobile apps.</p>
                    <p>I&apos;m into AI prototyping and vibe coding — I love when an idea becomes a real, testable product within days.</p>
                  </>
                )}
              </div>
            </div>

          {/* Right: Timeline */}
          <div className="flex flex-col">
            {(locale === "uk" ? [
              {
                period: "2025 — 2026",
                company: "Tatl Group · Єдина школа",
                role: "Product Designer",
                desc: "Спроєктував новий розділ детального аналізу успішності учня для батьків. Створив навчальну платформу відеокурсів для дітей у мобільному додатку. Розробив партнерську інтеграцію в системі, на сайті та в додатку. Оновив дизайн головного сайту платформи.",
              },
              {
                period: "2024 — 2025",
                company: "WeStudy",
                role: "Product Designer",
                desc: "Редизайн конструктора курсів — усунув ключові UX-проблеми, що призводили до відтоку. Спроєктував конструктор сайтів із 10+ типами компонентів. Провів серію юзабіліті-тестів, що виявили критичні точки тертя в онбордингу.",
              },
              {
                period: "2022 — 2024",
                company: "Snov.io",
                role: "Product Designer",
                desc: "Спроєктував інструменти для email та LinkedIn кампаній. Розробив інструменти лідогенерації: пошук по базі, одиночний і масовий email-пошук. Розробив браузерні розширення для лідогенерації. Покращив доставлення email: warm-up, перевірка доставлення та інші інструменти.",
              },
              {
                period: "2022",
                company: "SendPulse",
                role: "UI/UX Designer",
                desc: "Оновив редактор мультиканальних кампаній та редактор форм. Впровадив телефонію у CRM-систему. Спроєктував партнерську платформу. Розробив email-шаблони та сайти для конференцій.",
              },
              {
                period: "2016 — 2019",
                company: "Serpstat",
                role: "UI/UX Designer",
                desc: "Приєднався до команди стартапу на етапі формування. Заклав основу дизайн-системи та підходу до розробки задач. Проєктував інструменти аналізу ключових слів, відстеження позицій, аудиту сайту та аналізу конкурентів.",
              },
            ] : [
              {
                period: "2025 — 2026",
                company: "Tatl Group · Yedyna Shkola",
                role: "Product Designer",
                desc: "Designed a new detailed student performance analytics section for parents. Built a video course learning platform for children in the mobile app. Developed partner integration across the system, website, and app. Redesigned the main platform website.",
              },
              {
                period: "2024 — 2025",
                company: "WeStudy",
                role: "Product Designer",
                desc: "Redesigned the course builder — resolved key UX issues causing churn. Designed a website builder with 10+ component types. Ran usability testing sessions that uncovered critical friction points in onboarding.",
              },
              {
                period: "2022 — 2024",
                company: "Snov.io",
                role: "Product Designer",
                desc: "Designed tools for email and LinkedIn outreach campaigns. Built lead generation tools: database search, single and bulk email search. Created browser extensions for lead capture. Improved email deliverability tooling: warm-up, deliverability check, and related features.",
              },
              {
                period: "2022",
                company: "SendPulse",
                role: "UI/UX Designer",
                desc: "Updated the multichannel campaign editor and form editor. Implemented telephony in the CRM system. Designed a partner platform. Produced email templates and conference websites.",
              },
              {
                period: "2016 — 2019",
                company: "Serpstat",
                role: "UI/UX Designer",
                desc: "Joined the startup team at the formation stage. Laid the foundation for the design system and task development approach. Designed tools for keyword analysis, rank tracking, site audit, and competitor research.",
              },
            ]).map((item) => (
              <div key={item.company} className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-2 md:gap-8 py-10 border-b border-border last:border-0">
                <span className="text-sm text-muted-foreground pt-1.5 shrink-0">{item.period}</span>
                <div>
                  <h3 className="text-2xl font-medium text-foreground mb-1">{item.company}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{item.role}</p>
                  <p className="text-base text-foreground/75 leading-relaxed max-w-2xl">{item.desc}</p>
                </div>
              </div>
            ))}

            {/* CV download button */}
            <div className="pt-6">
              <a
                href={locale === "uk" ? "/cv-telpis-ua.pdf" : "/cv-telpis-en.pdf"}
                download
                className="inline-flex items-center gap-2 text-sm text-foreground border border-border rounded-full px-5 py-2.5 hover:bg-foreground hover:text-background transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                {locale === "uk" ? "Завантажити CV" : "Download CV"}
              </a>
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

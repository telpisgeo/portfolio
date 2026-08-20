import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { translations, type Locale } from "@/lib/translations";
import graphJson from "@/data/graph.json";
import type { GraphContent } from "@/lib/graph-content";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import CvDownloadLink from "@/components/CvDownloadLink";
import ShimmerImage from "@/components/ShimmerImage";
import Testimonials from "@/components/Testimonials";

const SITE_URL = "https://www.telpis.com.ua";

// This section uses its own URL locale segments ("ua"/"en") instead of the
// main site's "uk"/"en" — kept distinct per the graph-design page brief.
type GraphUrlLocale = "ua" | "en";

function toContentLocale(urlLocale: GraphUrlLocale): Locale {
  return urlLocale === "ua" ? "uk" : "en";
}

export function generateStaticParams() {
  return [{ locale: "ua" }, { locale: "en" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "ua" && locale !== "en") return {};
  const isUa = locale === "ua";
  const title = isUa
    ? "Тельпіс Георгій. Графічний дизайнер."
    : "Georgiy Telpis. Graphic Designer.";
  const description = isUa
    ? "Графічний дизайн: фірмові стилі, ілюстрації та візуальні матеріали."
    : "Graphic design: brand identities, illustrations and visual materials.";
  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/graph/${locale}`,
      languages: {
        uk: `${SITE_URL}/graph/ua`,
        en: `${SITE_URL}/graph/en`,
        "x-default": `${SITE_URL}/graph/ua`,
      },
    },
    openGraph: {
      title,
      description,
      locale: isUa ? "uk_UA" : "en_US",
      type: "website",
      images: [{ url: isUa ? `${SITE_URL}/og-ua-v2.png` : `${SITE_URL}/og-en-v2.png`, width: 1200, height: 628 }],
    },
  };
}

export default async function GraphLocalePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: urlLocale } = await params;

  if (urlLocale !== "ua" && urlLocale !== "en") notFound();

  const locale = toContentLocale(urlLocale);
  const t = translations[locale];
  const otherUrlLocale: GraphUrlLocale = urlLocale === "ua" ? "en" : "ua";
  const otherLabel = urlLocale === "ua" ? "EN" : "UA";
  const homeHref = `/graph/${urlLocale}`;
  const switchHref = `/graph/${otherUrlLocale}`;

  const graph = (graphJson as unknown as GraphContent)[locale];
  const companies = graph.companies;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar
        locale={locale}
        otherLocale={locale === "uk" ? "en" : "uk"}
        otherLabel={otherLabel}
        cvUrl={graph.cvUrl}
        cvButton={t.cvButton}
        worksLabel={t.navWorksLabel}
        aboutLabel={t.navAboutLabel}
        contactLabel={t.navContactLabel}
        homeHref={homeHref}
        switchHref={switchHref}
      />
      <Hero locale={locale} text1={graph.hero.text1} text2={graph.hero.text2} />

      <main className="flex-1 flex flex-col py-16">

        {/* Projects */}
        <div id="works" className="flex flex-col">
          <div className="max-w-[1440px] w-full mx-auto px-6 sm:px-12">
            <h2 className="text-4xl font-medium text-foreground">
              {locale === "uk" ? "Обрані кейси" : "Selected cases"}
            </h2>
          </div>
          {companies.map((company, index) => (
            <div
              key={company.name}
              className={`max-w-[1440px] w-full mx-auto px-6 sm:px-12 ${index === 0 ? "mt-12" : "mt-[176px]"}`}
            >

              {/* 3 columns: company (icon+name+type) | meta | what I did */}
              <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_3fr] gap-6 md:gap-10 mb-8">

                {/* Column 1: icon + name + company description */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
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
                    <a
                      href={company.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-lg font-medium text-foreground hover:underline underline-offset-2"
                    >
                      {company.name}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-40">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </a>
                  </div>
                  {company.productType && (
                    <span className="text-sm text-muted-foreground leading-relaxed">{company.productType}</span>
                  )}
                </div>

                {/* Column 2: meta details */}
                <div className="flex flex-col gap-4 text-sm">
                  {company.period && (
                    <div>
                      <p className="text-xs text-muted-foreground/60 uppercase tracking-widest mb-1">
                        {locale === "uk" ? "Роки" : "Years"}
                      </p>
                      <p className="text-foreground">{company.period}</p>
                    </div>
                  )}
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

                {/* Column 3: what I did + link */}
                <div className="flex flex-col gap-5">
                  <p className="text-xl text-foreground/75 leading-relaxed">
                    {company.description}
                  </p>
                  {company.achievements && company.achievements.length > 0 && (
                    <ul className="flex flex-col gap-2">
                      {company.achievements.map((a, i) => (
                        <li key={i} className="flex gap-2.5 text-base text-foreground/70 leading-relaxed">
                          <span aria-hidden className="text-foreground/40">•</span>
                          <span>{a}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {company.casePending && (
                    <p className="text-sm text-muted-foreground">
                      {locale === "uk" ? "Кейс готується до публікації" : "Case coming soon"}
                    </p>
                  )}
                  {company.caseUrl && (
                    <div>
                      <Link
                        href={company.caseUrl}
                        className="inline-flex items-center gap-2 text-sm font-medium text-primary-foreground bg-primary rounded-full px-5 py-2.5 hover:brightness-95 transition-all"
                      >
                        {locale === "uk" ? "Дивитись кейс" : "View case"}
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  )}
                </div>

              </div>

              {/* Screenshots */}
              {company.imageRows && (
                <div className="flex flex-col gap-3">
                  {company.imageRows.map((row, i) => (
                    Array.isArray(row) ? (
                      <div key={i} className="grid grid-cols-2 gap-3">
                        {(row as string[]).map((src) => (
                          <div key={src} className="relative overflow-hidden rounded-[8px] aspect-square">
                            <ShimmerImage src={src} alt={company.name} fill sizes="(min-width: 1440px) 660px, 45vw" className="object-cover" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div key={row as string} className="relative overflow-hidden rounded-[8px]">
                        <ShimmerImage src={row as string} alt={company.name} width={1200} height={800} className="w-full h-auto" />
                      </div>
                    )
                  ))}
                </div>
              )}

            </div>
          ))}
        </div>

      </main>

      {/* Testimonials */}
      <Testimonials locale={locale} testimonials={graph.testimonials} />

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
                {graph.about.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>

          {/* Right: Timeline */}
          <div className="flex flex-col">
            {graph.timeline.map((item) => (
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
              <CvDownloadLink locale={locale} cvUrl={graph.cvUrl} />
            </div>

          </div>

          </div>{/* end grid */}

        </div>
      </section>

      <Footer
        locale={locale}
        otherLocale={locale === "uk" ? "en" : "uk"}
        otherLabel={otherLabel}
        copyright={t.copyright}
      />
    </div>
  );
}

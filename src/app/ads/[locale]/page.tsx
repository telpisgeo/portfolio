import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { translations, type Locale } from "@/lib/translations";
import adsJson from "@/data/ads.json";
import type { AdsContent } from "@/lib/ads-content";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import ShimmerImage from "@/components/ShimmerImage";
import CenterPlayVideo from "@/components/CenterPlayVideo";

const VIDEO_EXT_RE = /\.(webm|mp4|mov)$/i;
// Videos named "*-once.<ext>" play a single time and stay on the last frame.
const ONCE_VIDEO_RE = /-once\.(webm|mp4|mov)$/i;

// Own social-free page: every social icon is hidden in the header and footer.
const NO_SOCIALS = ["LinkedIn", "Instagram", "Dribbble", "GitHub"];

// Own URL locale segments ("ua"/"en"), same as /graph.
type AdsUrlLocale = "ua" | "en";

function toContentLocale(urlLocale: AdsUrlLocale): Locale {
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
  return {
    title: isUa ? "Георгій Тельпіс. Рекламні креативи." : "Georgiy Telpis. Ad creatives.",
    description: isUa
      ? "Рекламні креативи: статика, моушн і відео для реклами та соцмереж."
      : "Ad creatives: static, motion and video for ads and social media.",
    // Private page: not indexed, not followed, no social preview.
    robots: { index: false, follow: false, nocache: true },
  };
}

export default async function AdsLocalePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: urlLocale } = await params;
  if (urlLocale !== "ua" && urlLocale !== "en") notFound();

  const locale = toContentLocale(urlLocale);
  const t = translations[locale];
  const otherUrlLocale: AdsUrlLocale = urlLocale === "ua" ? "en" : "ua";
  const otherLabel = urlLocale === "ua" ? "EN" : "UA";

  const ads = (adsJson as unknown as AdsContent)[locale];
  const projects = ads.projects.filter((p) => !p.hidden);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar
        locale={locale}
        otherLocale={locale === "uk" ? "en" : "uk"}
        otherLabel={otherLabel}
        cvUrl=""
        cvButton={t.cvButton}
        contactLabel={t.navContactLabel}
        homeHref={`/ads/${urlLocale}`}
        switchHref={`/ads/${otherUrlLocale}`}
        showCvButton={false}
        showPetProjects={false}
        showFunLink={false}
        hideSocials={NO_SOCIALS}
      />
      <Hero locale={locale} text1={ads.hero.text1} text2={ads.hero.text2} />

      <main className="flex-1 flex flex-col py-16">
        <div id="works" className="flex flex-col">
          {ads.worksTitle && projects.length > 0 && (
            <div className="max-w-[1440px] w-full mx-auto px-6 sm:px-12">
              <h2 className="text-4xl font-medium text-foreground">{ads.worksTitle}</h2>
            </div>
          )}
          {projects.map((project, index) => (
            <div
              key={project.slug}
              className={`max-w-[1440px] w-full mx-auto px-6 sm:px-12 ${index === 0 ? "mt-12" : "mt-[176px]"}`}
            >
              {/* 3 columns like /graph: name + type | years | description */}
              <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_3fr] gap-6 md:gap-10 mb-8">
                <div className="flex flex-col gap-3">
                  <span className="text-lg font-medium text-foreground">{project.name}</span>
                  {project.kind && (
                    <span className="text-sm text-muted-foreground leading-relaxed">{project.kind}</span>
                  )}
                </div>

                <div className="flex flex-col gap-4 text-sm">
                  {project.period && (
                    <div>
                      <p className="text-xs text-muted-foreground/60 uppercase tracking-widest mb-1">
                        {locale === "uk" ? "Роки" : "Years"}
                      </p>
                      <p className="text-foreground">{project.period}</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-5">
                  {project.description && (
                    <p className="text-xl text-foreground/75 leading-relaxed whitespace-pre-line">
                      {project.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {project.imageRows.filter((row) => row.active !== false).map((row, i) =>
                  Array.isArray(row.value) ? (
                    <div key={i} className="grid grid-cols-2 gap-3">
                      {row.value.map((src, j) => (
                        <div key={src} className="relative overflow-hidden rounded-[8px] aspect-square">
                          {VIDEO_EXT_RE.test(src) ? (
                            <CenterPlayVideo src={src} poster={row.posters?.[j]} className="absolute inset-0 w-full h-full object-cover" once={row.once ?? ONCE_VIDEO_RE.test(src)} />
                          ) : (
                            <ShimmerImage src={src} alt={project.name} fill sizes="(min-width: 1440px) 660px, 45vw" className="object-cover" />
                          )}
                        </div>
                      ))}
                    </div>
                  ) : VIDEO_EXT_RE.test(row.value) ? (
                    <div key={row.value} className="relative overflow-hidden rounded-[8px]">
                      <CenterPlayVideo src={row.value} poster={row.posters?.[0]} className="w-full h-auto" once={row.once ?? ONCE_VIDEO_RE.test(row.value)} />
                    </div>
                  ) : (
                    <div key={row.value} className="relative overflow-hidden rounded-[8px]">
                      <ShimmerImage src={row.value} alt={project.name} width={1200} height={800} className="w-full h-auto" />
                    </div>
                  ),
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer
        locale={locale}
        otherLocale={locale === "uk" ? "en" : "uk"}
        otherLabel={otherLabel}
        copyright={t.copyright}
        hideSocials={NO_SOCIALS}
      />
    </div>
  );
}

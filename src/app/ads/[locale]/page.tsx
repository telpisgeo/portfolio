import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import adsJson from "@/data/ads.json";
import type { AdsContent } from "@/lib/ads-content";
import ShimmerImage from "@/components/ShimmerImage";
import CenterPlayVideo from "@/components/CenterPlayVideo";

const VIDEO_EXT_RE = /\.(webm|mp4|mov)$/i;
// Videos named "*-once.<ext>" play a single time and stay on the last frame.
const ONCE_VIDEO_RE = /-once\.(webm|mp4|mov)$/i;

// Own URL locale segments ("ua"/"en"), same as /graph.
type AdsUrlLocale = "ua" | "en";

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
  const ads = (adsJson as unknown as AdsContent)[locale === "ua" ? "uk" : "en"];
  return {
    title: ads.title,
    description: ads.intro,
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

  const isUa = urlLocale === "ua";
  const ads = (adsJson as unknown as AdsContent)[isUa ? "uk" : "en"];
  const other: AdsUrlLocale = isUa ? "en" : "ua";
  const projects = ads.projects.filter((p) => !p.hidden);

  return (
    <div className="min-h-screen flex flex-col bg-white text-foreground">
      {/* Own header: no link to the main site, no social links. */}
      <header className="max-w-[1440px] w-full mx-auto px-6 sm:px-12 h-16 flex items-center justify-between">
        <Link href={`/ads/${urlLocale}`} className="text-base font-medium">
          Georgiy Telpis
        </Link>
        <div className="flex items-center gap-5 text-sm">
          <a href={`mailto:${ads.contactEmail}`} className="hover:underline underline-offset-2">
            {ads.contactLabel}
          </a>
          <Link
            href={`/ads/${other}`}
            className="border border-border rounded-full px-3 py-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            {isUa ? "EN" : "UA"}
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-6 sm:px-12 pt-16 pb-24">
        <h1 className="text-4xl sm:text-5xl font-medium leading-tight max-w-3xl">{ads.title}</h1>
        {ads.intro && (
          <p className="mt-5 text-xl text-foreground/75 leading-relaxed max-w-2xl">{ads.intro}</p>
        )}

        {ads.worksTitle && projects.length > 0 && (
          <h2 className="mt-20 text-4xl font-medium">{ads.worksTitle}</h2>
        )}

        {projects.map((project, index) => (
          <section key={project.slug} className={index === 0 ? "mt-12" : "mt-[120px]"}>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr] gap-6 md:gap-10 mb-8">
              <div className="flex flex-col gap-1.5">
                <h3 className="text-lg font-medium">{project.name}</h3>
                {(project.kind || project.period) && (
                  <p className="text-sm text-muted-foreground">
                    {[project.kind, project.period].filter(Boolean).join(" · ")}
                  </p>
                )}
              </div>
              {project.description && (
                <p className="text-xl text-foreground/75 leading-relaxed whitespace-pre-line">
                  {project.description}
                </p>
              )}
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
          </section>
        ))}
      </main>

      <footer className="border-t border-border">
        <div className="max-w-[1440px] w-full mx-auto px-6 sm:px-12 py-8 flex items-center justify-between text-sm text-muted-foreground">
          <span>© {new Date().getFullYear()} Georgiy Telpis</span>
          <a href={`mailto:${ads.contactEmail}`} className="hover:text-foreground transition-colors">
            {ads.contactEmail}
          </a>
        </div>
      </footer>
    </div>
  );
}

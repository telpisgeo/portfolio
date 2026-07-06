import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { translations, type Locale, type CaseBlock } from "@/lib/translations";
import { listCaseSlugs, readCaseFile } from "@/lib/case-store";
import { Caption, CaseBlockList } from "@/components/CaseBlocks";
import CaseStepsNav from "@/components/CaseStepsNav";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export function generateStaticParams() {
  const locales = ["uk", "en"] as const;
  const legacySlugs = Object.keys(translations.uk.cases);
  const jsonSlugs = listCaseSlugs();
  const slugs = [...new Set([...legacySlugs, ...jsonSlugs])];
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

function renderBlock(block: CaseBlock, i: number) {
  switch (block.type) {
    case "h3":
      return (
        <h3 key={i} className="text-xl font-medium text-foreground leading-snug mt-6">
          {block.text}
        </h3>
      );
    case "p":
      return (
        <p key={i} className="text-lg text-foreground/75 leading-relaxed">
          {block.text}
        </p>
      );
    case "ul":
      return (
        <ul key={i} className="flex flex-col gap-2">
          {block.items.map((item, j) => (
            <li key={j} className="text-lg text-foreground/75 leading-relaxed">
              — {item}
            </li>
          ))}
        </ul>
      );
    case "ul-bold":
      return (
        <ul key={i} className="flex flex-col gap-2">
          {block.items.map((item, j) => (
            <li key={j} className="text-lg text-foreground/75 leading-relaxed">
              — <strong className="text-foreground font-medium">{item.bold}</strong>{item.rest}
            </li>
          ))}
        </ul>
      );
    case "image":
      return (
        <div key={i} className="w-full rounded-[8px] overflow-hidden bg-muted my-4">
          <Image
            src={block.src}
            alt={block.alt ?? ""}
            width={1400}
            height={900}
            className="w-full h-auto"
            unoptimized={block.src.endsWith(".gif")}
          />
        </div>
      );
  }
}

export default async function CasePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  if (locale !== "uk" && locale !== "en") notFound();

  const t = translations[locale as Locale];

  // New JSON-based case system (src/data/cases/<slug>.json), managed via /admin/cases.
  const caseFile = readCaseFile(slug);
  if (caseFile) {
    if (caseFile.status === "draft") notFound();
    const oc = caseFile[locale as Locale];
    const otherLocale = locale === "uk" ? "en" : "uk";
    const otherLabel = locale === "uk" ? "EN" : "UA";
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
          variant="case"
          hideOnScroll
        />
        <main className="flex-1">
          <div className="px-4 md:px-8 lg:px-12 pt-14 pb-4">
            <header className="max-w-[912px] mx-auto flex flex-col gap-2">
              <Caption text={oc.eyebrow} />
              <h1 className="text-[22px] md:text-[28px] lg:text-[36px] font-bold text-foreground leading-[1.25]">{oc.title}</h1>
            </header>
          </div>
          <CaseStepsNav items={oc.steps} />
          <CaseBlockList blocks={oc.blocks} />
        </main>
        <Footer locale={locale} otherLocale={otherLocale} otherLabel={otherLabel} copyright={t.copyright} />
      </div>
    );
  }

  const c = t.cases[slug];

  if (!c) notFound();

  const currentCompany = t.companies.find((co) =>
    co.subcases?.some((sc) => sc.slug === slug)
  );
  const relatedCases = currentCompany?.subcases?.filter((sc) => sc.slug !== slug) ?? [];

  const relatedLabel = locale === "uk" ? "Інші кейси" : "Related cases";
  const otherLocale = locale === "uk" ? "en" : "uk";
  const otherLabel = locale === "uk" ? "EN" : "UA";

  const hasBlocks = c.blocks && c.blocks.length > 0;

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
        hideOnScroll
      />

      <main className="flex-1">
        {hasBlocks ? (
          /* Block-based layout */
          <article className="max-w-[1045px] mx-auto px-6 py-16">
            {/* Title */}
            <div className="max-w-[680px] mx-auto mb-10">
              <p className="text-sm text-muted-foreground mb-4">{c.subtitle}</p>
              <h1 className="text-4xl font-medium text-foreground leading-tight">{c.title}</h1>
            </div>

            {/* Blocks */}
            <div className="flex flex-col gap-4">
              {c.blocks!.map((block, i) => {
                if (block.type === "image") {
                  return renderBlock(block, i);
                }
                return (
                  <div key={i} className="max-w-[680px] mx-auto w-full">
                    {renderBlock(block, i)}
                  </div>
                );
              })}
            </div>

            {/* Related cases */}
            {relatedCases.length > 0 && (
              <div className="max-w-[680px] mx-auto mt-16 flex flex-col gap-3">
                <h3 className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest">
                  {relatedLabel}
                </h3>
                <div className="flex flex-col gap-2">
                  {relatedCases.map((sc) => (
                    <Link
                      key={sc.slug}
                      href={`/${locale}/cases/${sc.slug}`}
                      className="text-base text-foreground hover:text-foreground/60 transition-colors"
                    >
                      → {sc.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </article>
        ) : (
          /* Structured layout (legacy) */
          <article className="max-w-[740px] mx-auto px-6 py-16 flex flex-col gap-12">

            {/* Title */}
            <div>
              <p className="text-sm text-muted-foreground mb-4">{c.subtitle}</p>
              <h1 className="text-4xl font-medium text-foreground leading-tight">{c.title}</h1>
            </div>

            {/* Preview image */}
            {c.images.length > 0 && (
              <div className="rounded-[8px] overflow-hidden bg-muted">
                <Image
                  src={c.images[0]}
                  alt={c.title}
                  width={1400}
                  height={900}
                  className="w-full h-auto"
                  priority
                />
              </div>
            )}

            {/* Goals */}
            <section className="flex flex-col gap-3">
              <h3 className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest">
                {c.goalsTitle}
              </h3>
              <ul className="flex flex-col gap-2">
                {c.goals.map((g, i) => (
                  <li key={i} className="text-base text-foreground/75 leading-relaxed">
                    — {g}
                  </li>
                ))}
              </ul>
            </section>

            {/* Context */}
            <section className="flex flex-col gap-3">
              <h3 className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest">
                {c.contextTitle}
              </h3>
              <div className="flex flex-col gap-4">
                {c.context.map((p, i) => (
                  <p key={i} className="text-base text-foreground/75 leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>
            </section>

            {/* Problem */}
            {c.problem.length > 0 && (
              <section className="flex flex-col gap-3">
                <h3 className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest">
                  {c.problemTitle}
                </h3>
                <ul className="flex flex-col gap-3">
                  {c.problem.map((p, i) => (
                    <li key={i} className="text-base text-foreground/75 leading-relaxed">
                      — {p}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Solutions */}
            <section className="flex flex-col gap-3">
              <h3 className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest">
                {c.solutionsTitle}
              </h3>
              <div className="flex flex-col gap-10">
                {c.solutions.map((s, i) => (
                  <div key={i} className="flex flex-col gap-4">
                    <h4 className="text-lg font-medium text-foreground leading-snug">{s.heading}</h4>
                    {s.body.split("\n\n").map((p, j) => (
                      <p key={j} className="text-base text-foreground/75 leading-relaxed">
                        {p}
                      </p>
                    ))}
                    {s.images && s.images.length > 0 && (
                      <div className="flex flex-col gap-3 mt-2">
                        {s.images.map((src) => (
                          <div key={src} className="rounded-[8px] overflow-hidden bg-muted">
                            <Image
                              src={src}
                              alt={s.heading}
                              width={1400}
                              height={900}
                              className="w-full h-auto"
                              unoptimized={src.endsWith(".gif")}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Results */}
            <section className="flex flex-col gap-3">
              <h3 className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest">
                {c.metricsTitle}
              </h3>
              <p className="text-base text-foreground/75 leading-relaxed">{c.status}</p>
            </section>

            {/* Related cases */}
            {relatedCases.length > 0 && (
              <section className="flex flex-col gap-3">
                <h3 className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest">
                  {relatedLabel}
                </h3>
                <div className="flex flex-col gap-2">
                  {relatedCases.map((sc) => (
                    <Link
                      key={sc.slug}
                      href={`/${locale}/cases/${sc.slug}`}
                      className="text-base text-foreground hover:text-foreground/60 transition-colors"
                    >
                      → {sc.name}
                    </Link>
                  ))}
                </div>
              </section>
            )}

          </article>
        )}
      </main>

      <Footer
        locale={locale}
        otherLocale={otherLocale}
        otherLabel={otherLabel}
        copyright={t.copyright}
      />

    </div>
  );
}

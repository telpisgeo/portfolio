import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { translations, type Locale } from "@/lib/translations";
import type { CaseContent } from "@/lib/case-blocks";
import caseJson from "@/data/cases/eschool-2.json";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CaseStepsNav from "@/components/CaseStepsNav";
import { Caption, CaseBlockList } from "@/components/CaseBlocks";

export function generateStaticParams() {
  return [{ locale: "uk" }, { locale: "en" }];
}

const content = caseJson as unknown as Record<Locale, CaseContent>;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "uk" && locale !== "en") return {};
  const c = content[locale as Locale];
  return { title: `${c.eyebrow} — ${c.title}` };
}

export default async function EschoolV2Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale !== "uk" && locale !== "en") notFound();

  const t = translations[locale as Locale];
  const c = content[locale as Locale];
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
        {/* Hero: eyebrow + title */}
        <div className="px-4 md:px-8 lg:px-12 pt-14 pb-4">
          <header className="max-w-[912px] mx-auto flex flex-col gap-2">
            <Caption text={c.eyebrow} />
            <h1 className="text-[22px] md:text-[28px] lg:text-[36px] font-bold text-foreground leading-[1.25]">{c.title}</h1>
          </header>
        </div>

        {/* Sticky steps */}
        <CaseStepsNav items={c.steps} />

        <CaseBlockList blocks={c.blocks} />
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

import Image from "next/image";
import { notFound } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { translations, type Locale } from "@/lib/translations";

const VERSION = "V.1.2.0";

export function generateStaticParams() {
  return [{ locale: "uk" }, { locale: "en" }];
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
  const isUk = locale === "uk";

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex flex-col py-16">

        {/* Intro section */}
        <div className="w-full min-w-0 max-w-[800px] mx-auto px-6 mb-16" style={{ minWidth: "min(600px, 100%)" }}>
          <h1 className="text-4xl font-medium text-foreground mb-6 leading-tight">
            {t.name}
          </h1>

          {!isUk && t.bio && (
            <p className="text-muted-foreground text-lg leading-relaxed mb-10">
              {t.bio}
            </p>
          )}

          <div className="flex gap-4 items-center">
            <a
              href="mailto:gtelpis@gmail.com"
              className={buttonVariants({ variant: "default", size: "lg" })}
            >
              {t.emailButton}
            </a>

            <a
              href="https://www.linkedin.com/in/georgiy-telpis-229bbb47/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-primary hover:text-primary/70 transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>

            <a
              href="https://dribbble.com/gtelpis"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Dribbble"
              className="text-primary hover:text-primary/70 transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 111 111" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M55.4534 0C24.8398 0 0 24.8398 0 55.4534C0 86.0672 24.8398 110.907 55.4534 110.907C86.0069 110.907 110.907 86.0672 110.907 55.4534C110.907 24.8398 86.0069 0 55.4534 0ZM92.0814 25.5615C98.6974 33.6209 102.667 43.9056 102.787 55.0323C101.224 54.7318 85.5858 51.5439 69.828 53.5288C69.4672 52.7469 69.1664 51.9047 68.8056 51.0629C67.8431 48.7775 66.7607 46.4318 65.678 44.2064C83.1198 37.1094 91.059 26.8847 92.0814 25.5615ZM55.4534 8.17969C67.4823 8.17969 78.4888 12.6905 86.8491 20.0883C86.0069 21.2912 78.8496 30.8542 62.009 37.1694C54.2504 22.9151 45.6499 11.2471 44.3267 9.44271C47.875 8.60069 51.6043 8.17969 55.4534 8.17969ZM35.3051 12.6304C36.5681 14.3144 44.9883 26.0427 52.8672 39.9961C30.7339 45.8905 11.1869 45.7702 9.08185 45.7702C12.1492 31.0948 22.0731 18.8854 35.3051 12.6304ZM8.05939 55.5137C8.05939 55.0323 8.05939 54.5513 8.05939 54.0702C10.1043 54.1302 33.0796 54.431 56.7164 47.334C58.0999 49.9802 59.3629 52.6866 60.5659 55.3931C59.9642 55.5737 59.3026 55.7542 58.7013 55.9345C34.2825 63.8134 21.2912 85.3452 20.2086 87.1495C12.6905 78.7896 8.05939 67.6629 8.05939 55.5137ZM55.4534 102.847C44.5069 102.847 34.4028 99.1185 26.4035 92.8633C27.2455 91.1193 36.8685 72.5948 63.5728 63.2723C63.6931 63.212 63.7534 63.212 63.8737 63.1521C70.5496 80.4133 73.2564 94.9082 73.978 99.0582C68.2642 101.524 62.009 102.847 55.4534 102.847ZM81.8569 94.7279C81.3758 91.8409 78.8496 78.0077 72.6547 60.9866C87.5107 58.6409 100.502 62.4905 102.126 63.0318C100.081 76.2034 92.5025 87.5706 81.8569 94.7279Z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Projects / Experience */}
        {isUk ? (
          /* UK: project blocks with images */
          <div className="flex flex-col gap-16">
            {t.companies.map((company) => (
              <div key={company.name}>
                {/* Text block */}
                <div className="w-full max-w-[800px] mx-auto px-6 mb-6" style={{ minWidth: "min(600px, 100%)" }}>
                  <div className="mb-1">
                    <a
                      href={company.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg font-medium text-primary hover:text-primary/70 transition-colors"
                    >
                      {company.name}
                    </a>
                  </div>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {company.description}
                  </p>
                </div>

                {/* Images block */}
                {company.images && company.images.length > 0 && (
                  <div className="max-w-[1100px] w-full mx-auto px-6">
                    <div className="flex flex-col gap-3">
                      {company.images.map((src) => (
                        <div key={src} className="relative overflow-hidden rounded-md bg-muted">
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
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* EN: original experience section */
          <div className="max-w-[600px] w-full mx-auto px-6">
            <div className="space-y-8">
              <p className="text-xs text-muted-foreground tracking-widest uppercase">
                {t.experienceTitle}
              </p>

              <div className="space-y-6">
                {t.companies.map((company) => (
                  <div key={company.name}>
                    <div className="flex justify-between items-baseline mb-1">
                      <a
                        href={company.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary font-medium hover:text-primary/70 transition-colors"
                      >
                        {company.name}
                      </a>
                      <span className="text-sm text-muted-foreground">{company.period}</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {company.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>

      <footer className="px-6 py-6 border-t border-border mt-16">
        <div className="max-w-[600px] mx-auto flex justify-between items-center">
          <p className="text-xs text-muted-foreground">
            {t.copyright}
          </p>
          <div className="flex items-center gap-4">
            <a
              href={`/${otherLocale}`}
              className="text-xs text-primary hover:text-primary/70 transition-colors"
            >
              {otherLabel}
            </a>
            <p className="text-xs text-muted-foreground">{VERSION}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

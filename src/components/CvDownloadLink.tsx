"use client";

import * as amplitude from "@amplitude/unified";

export default function CvDownloadLink({ locale }: { locale: string }) {
  return (
    <a
      href={locale === "uk" ? "/CV_Georgiy_Telpis_senior_uiux_(product)_designer_ua.pdf" : "/CV_Georgiy_Telpis_senior_uiux_(product)_designer_en.pdf"}
      download
      onClick={() =>
        amplitude.track("CV Downloaded", { location: "footer", locale })
      }
      className="inline-flex items-center gap-2 text-sm font-medium bg-primary text-primary-foreground rounded-full px-5 py-2.5 hover:bg-primary/85 transition-colors"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      {locale === "uk" ? "Завантажити CV" : "Download CV"}
    </a>
  );
}

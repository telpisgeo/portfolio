import type { Metadata } from "next";
import { headers } from "next/headers";
import { Google_Sans } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import VercelAnalytics from "@/components/VercelAnalytics";
import Amplitude from "@/components/Amplitude";
import { OG_IMAGE, SITE_URL } from "@/lib/seo";
import "./globals.css";

// Self-hosted (no render-blocking request to Google) with Cyrillic support.
const googleSans = Google_Sans({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-google-sans",
});

export const metadata: Metadata = {
  title: "Георгій Тельпіс. Продуктовий дизайнер.",
  description: "Досвід запуску складних продуктів в доменах EdTech та MarTech від ідеї до релізу.",
  metadataBase: new URL(SITE_URL),
  applicationName: "Георгій Тельпіс",
  authors: [{ name: "Георгій Тельпіс", url: SITE_URL }],
  // Fallback for any page without its own social tags; pages override via socialMetadata().
  openGraph: {
    siteName: "Георгій Тельпіс",
    type: "website",
    images: [{ url: OG_IMAGE.uk, width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", images: [OG_IMAGE.uk] },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Set by the proxy from the first path segment (see src/proxy.ts).
  const lang = (await headers()).get("x-locale") === "en" ? "en" : "uk";
  return (
    <html
      lang={lang}
      className={`${googleSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        {children}
        <Amplitude />
        <VercelAnalytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

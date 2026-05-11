import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Георгій Тельпіс — Product Designer",
  description: "Product Designer, що проєктує B2B SaaS продукти — від дослідження до готового інтерфейсу. Досвід у лідогенерації, email-маркетингу та CRM-інструментах.",
  metadataBase: new URL("https://www.telpis.com.ua"),
  openGraph: {
    title: "Георгій Тельпіс — Product Designer",
    description: "Product Designer, що проєктує B2B SaaS продукти — від дослідження до готового інтерфейсу.",
    url: "https://www.telpis.com.ua",
    siteName: "Георгій Тельпіс",
    locale: "uk_UA",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="uk"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

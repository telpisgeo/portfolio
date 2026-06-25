import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import VercelAnalytics from "@/components/VercelAnalytics";
import Amplitude from "@/components/Amplitude";
import "./globals.css";

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
      className="h-full antialiased"
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

import Image from "next/image";
import SocialLinks from "./SocialLinks";

type FooterProps = {
  locale: string;
  otherLocale: string;
  otherLabel: string;
  copyright: string;
};

export default function Footer({ locale, copyright }: FooterProps) {
  return (
    <footer className="bg-footer-bg text-footer-text">
      {/* light cap: page bg curves down into the dark footer (dark fills the corners) */}
      <div className="bg-surface-about h-10 rounded-b-[40px]" aria-hidden />
      <div className="max-w-[1440px] w-full mx-auto px-6 sm:px-12 pt-20 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: contact + blurb + socials */}
          <div className="flex flex-col">
            <a
              href="mailto:gtelpis@gmail.com"
              className="text-[clamp(1.6rem,6vw,3.25rem)] font-medium leading-none hover:opacity-80 transition-opacity break-all w-fit"
            >
              gtelpis@gmail.com
            </a>

            <SocialLinks
              className="mt-8 flex items-center gap-5"
              linkClassName="text-footer-text/70 hover:text-footer-text transition-colors"
            />

            <p className="mt-10 text-xs text-footer-text/45">{copyright}</p>
          </div>

          {/* Right: illustration */}
          <div className="hidden lg:flex justify-end items-end">
            <Image
              src="/images/footer-illustration.webp"
              alt=""
              width={1200}
              height={634}
              className="w-full max-w-[620px] h-auto"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}

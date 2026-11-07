import SocialLinks from "./SocialLinks";
import FooterStage from "./FooterStage";

type FooterProps = {
  locale: string;
  otherLocale: string;
  otherLabel: string;
  copyright: string;
};

// One of these floats around the footer and swaps on every bounce (640×640 WebP).
const PHOTOS = [
  "/images/footer/face-double.webp",
  "/images/footer/selfie.webp",
  "/images/footer/portrait-painting.webp",
  "/images/footer/wood-sculpture.webp",
  "/images/footer/beetle.webp",
  "/images/footer/field.webp",
  "/images/footer/clay-head.webp",
  "/images/footer/black-head.webp",
  "/images/footer/wood-carving.webp",
];

// The mailto line: an epigraph from the end of "Song of Myself" (public domain), shown in the original.
const QUOTE = { text: "I stop somewhere waiting for you.", author: "Walt Whitman" };

export default function Footer({ copyright }: FooterProps) {
  return (
    <footer className="bg-footer-bg text-footer-text">
      {/* light cap: page bg curves down into the dark footer (dark fills the corners) */}
      <div className="bg-surface-about h-10 rounded-b-[40px]" aria-hidden />
      <FooterStage photos={PHOTOS} text={QUOTE.text} author={QUOTE.author} email="gtelpis@gmail.com">
        <SocialLinks
          className="mt-8 flex items-center justify-center gap-5"
          linkClassName="text-footer-text/70 hover:text-footer-text transition-colors"
        />

        <p className="mt-10 text-xs text-footer-text/45">{copyright}</p>
      </FooterStage>
    </footer>
  );
}

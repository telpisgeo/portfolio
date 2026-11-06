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

// Wording of the mailto line; it changes on every bounce of the photo.
const CTA: Record<string, string[]> = {
  uk: [
    "Напишіть мені, я не кусаюсь",
    "Є ідея? Напишіть, обговоримо",
    "Давайте зробимо щось круте",
    "Напишіть, поки я не написав першим",
    "Відповім швидше за дизайн-рев'ю",
    "Просто напишіть. Кава за мною",
    "Пишіть, відповім швидше, ніж вантажиться Figma",
    "Не соромтесь, привітайтесь",
    "Лист, який я із задоволенням прочитаю",
    "Ваш лист — моя улюблена нотифікація",
  ],
  en: [
    "Write to me, I don't bite",
    "Got an idea? Let's talk",
    "Let's make something great",
    "Write me before I write you first",
    "Faster than a design review",
    "Just write. Coffee's on me",
    "I reply faster than Figma loads",
    "Don't be shy, say hi",
    "An email I'd gladly read",
    "Your email is my favorite notification",
  ],
};

export default function Footer({ locale, copyright }: FooterProps) {
  return (
    <footer className="bg-footer-bg text-footer-text">
      {/* light cap: page bg curves down into the dark footer (dark fills the corners) */}
      <div className="bg-surface-about h-10 rounded-b-[40px]" aria-hidden />
      <FooterStage photos={PHOTOS} messages={CTA[locale] ?? CTA.en} email="gtelpis@gmail.com">
        <SocialLinks
          className="mt-8 flex items-center justify-center gap-5"
          linkClassName="text-footer-text/70 hover:text-footer-text transition-colors"
        />

        <p className="mt-10 text-xs text-footer-text/45">{copyright}</p>
      </FooterStage>
    </footer>
  );
}

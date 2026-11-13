import type { Metadata } from "next";
import ShaboSections, { type ShaboSection } from "@/components/ShaboSections";
import { OG_IMAGE_GRAPH, SITE_URL, socialMetadata } from "@/lib/seo";

// Temporary presentation page for the SHABO test assignment (telpis.com.ua/shabo).
// Hidden from search engines and robots.txt; delete this folder, the component,
// /public/images/works/shabo and the "/shabo" robots entry when the review is over.
export const metadata: Metadata = {
  title: "SHABO — тестове завдання",
  description: "Тестове завдання для дизайнера: два пости для Instagram та святкова листівка для SHABO.",
  robots: { index: false, follow: false },
  // Link preview uses the graph-design featured image, not the site-wide one.
  ...socialMetadata(
    "uk",
    `${SITE_URL}/shabo`,
    "SHABO — тестове завдання",
    "Тестове завдання для дизайнера: два пости для Instagram та святкова листівка для SHABO.",
    "website",
    OG_IMAGE_GRAPH.uk,
  ),
};

const SECTIONS: ShaboSection[] = [
  {
    id: "post-1",
    voice: { src: "/audio/shabo-post1.m4a", duration: "0:46" },
    title: "Пост №1. Презентація вина SHABO Reserve",
    description:
      "Мінімалістичний візуал для презентації вина, який не обмежується одним статичним банером. Карусель розкриває Reserve поступово: який у нього смак і аромат, з чим поєднується, що про нього кажуть виробники й як воно створювалось. Кожен слайд додає нову деталь, а глибокий винний фон і золотий акцент підкреслюють преміальність.",
    image: "/images/works/shabo/post-1.webp",
    ratio: [1935, 3634],
    alt: "Пост №1 — презентація вина SHABO Reserve в Instagram",
    // Carousel slides exported from Figma (Social media → Frame 36, node 57:5031).
    slides: [
      { bg: "#B00A39", ellipses: "slide1", fg: "/images/works/shabo/post-1-s1-fg.webp" },
      { bg: "#A9153F", shapes: ["/images/works/shabo/post-1-s2-shapes1-v2.webp"], texts: ["/images/works/shabo/post-1-s2-text1-v2.webp", "/images/works/shabo/post-1-s2-text2-v2.webp"], logo: "/images/works/shabo/post-1-logo-v2.webp" },
      { bg: "#A9153F", shapes: ["/images/works/shabo/post-1-s3-shapes1-v2.webp", "/images/works/shabo/post-1-s3-shapes2-v2.webp"], texts: ["/images/works/shabo/post-1-s3-text1-v2.webp", "/images/works/shabo/post-1-s3-text2-v2.webp"], logo: "/images/works/shabo/post-1-logo-v2.webp" },
      { bg: "#A9153F", shapes: ["/images/works/shabo/post-1-s4-shapes1-v2.webp", "/images/works/shabo/post-1-s4-shapes2-v2.webp", "/images/works/shabo/post-1-s4-shapes3-v2.webp"], texts: ["/images/works/shabo/post-1-s4-text1-v2.webp", "/images/works/shabo/post-1-s4-text2-v2.webp", "/images/works/shabo/post-1-s4-text3-v2.webp", "/images/works/shabo/post-1-s4-text4-v2.webp"], logo: "/images/works/shabo/post-1-logo-v2.webp" },
      { bg: "#A9153F", blobs: "/images/works/shabo/post-1-s5-quote-v2.webp", fg: "/images/works/shabo/post-1-s5-text.webp", signature: true },
    ],
    // One post with a carousel: the music and caption are the same for every slide (a single entry is reused).
    meta: [
      { music: "Yann Tiersen, La Valse d'Amélie", caption: "Shabo Reserve. Вино, яке варто дочекатись: смак, аромат та історія створення — гортайте слайди." },
    ],
  },
  {
    id: "post-2-v2",
    voice: { src: "/audio/shabo-post2.m4a", duration: "0:30" },
    title: "Пост №2. Концепція 2 — День святого Валентина",
    description:
      "Тут було більше часу й натхнення, тому замість однієї ідеї — кілька концепцій з анімацією. Рукописний каліграфічний леттеринг: сьогодні цінують крафтовість і те, що зроблено руками. Один зі слайдів може показати, як усе створювалось, — відео про процес зараз у тренді. Є й незвичні рішення, але why not?",
    image: "/images/works/shabo/post-2.webp",
    ratio: [1935, 3634],
    alt: "Пост №2, концепція 2 — День святого Валентина, SHABO в Instagram",
    // Animated slides (Figma Motion → WebM) come first, then the static WebP ones in their original order.
    slides: [
      "/images/works/shabo/post-2b-video-1.webm",
      "/images/works/shabo/post-2b-video-2.webm",
      "/images/works/shabo/post-2b-video-3.webm",
      ...[2, 4, 7, 9, 12].map((n) => `/images/works/shabo/post-2b-slide-${n}.webp`),
    ],
    meta: [
      { music: "AURORA, Runaway", caption: "Подарунок, який говорить замість слів. Вино з історією з 1822 року для найближчих людей." },
      { music: "Konstrakta, In corpore sano", caption: "Бульбашки, рожевий колір і ви двоє. Ігристе Shabo зробить 14 лютого по-справжньому святковим." },
      { music: "Christine and the Queens, Tilted", caption: "Влаштуйте побачення вдома: вино Shabo, тиха музика і вечір лише для вас двох. З Днем закоханих!" },
      { music: "Poli Genova, If Love Was a Crime", caption: "Кохання краще, коли воно рожеве. Natural Rosé Limited Edition вже чекає на вас." },
      { music: "Édith Piaf, La Vie en rose", caption: "Не знаєте, що подарувати на День святого Валентина? Пляшка Шабо завжди скаже «люблю»." },
      { music: "Robyn, Dancing On My Own", caption: "Кохання як хороше вино: з часом лише краще. Привітайте свою половинку з Днем святого Валентина." },
      { music: "MØ, Final Song", caption: "Два келихи, одна історія. Ігристе рожеве Shabo Special Edition для тих, хто святкує кохання щодня." },
      { music: "Stromae, Alors on danse", caption: "Любов — це шабівський настрій. Natural Rosé Limited Edition до Дня святого Валентина." },
    ],
  },
  {
    id: "card",
    voice: { src: "/audio/shabo-card.m4a", duration: "0:30" },
    title: "Листівка від SHABO з Новим роком та Різдвом для партнерів",
    description:
      "Антиква Cormorant додає історичної ваги, дрібний гротеск — сучасного контрасту. Ієрархія проста: бренд → продукт → одна фраза. Аудиторія — поціновувачі вина 30–50 років, які обирають якість та історію бренду, а не знижки.",
    image: null, // placeholder until the card is ready
    ratio: [1720, 1041],
    alt: "Листівка від SHABO у конверті — натисніть, щоб відкрити або закрити",
    envelope: true,
  },
];

export default function ShaboPage() {
  return (
    <ShaboSections
      sections={SECTIONS}
      logo="/images/works/shabo/logo.svg"
      photo="/images/hero-photo-face2.webp"
      name="Тельпіс Георгій"
    />
  );
}

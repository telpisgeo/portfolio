import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { translations, type Locale } from "@/lib/translations";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CaseStepsNav from "@/components/CaseStepsNav";
import DarkSlider from "@/components/DarkSlider";
import LazyVideo from "@/components/LazyVideo";

export function generateStaticParams() {
  return [{ locale: "uk" }, { locale: "en" }];
}

type Block =
  | { t: "meta"; id?: string; items: { label: string; value: string }[] }
  | { t: "dark-section"; id?: string; caption: string; statement: string; img: { label: string; ratio: string; src?: string } }
  | { t: "dark-slider"; id?: string; caption: string; slides: { caption?: string; text: string; imgLabel: string; imgRatio: string; imgSrc?: string }[] }
  | { t: "light-section"; id?: string; caption: string; statement: string; img: { label: string; ratio: string; src?: string; videoSrc?: string } }
  | { t: "figures"; id?: string; caption: string; items: { value: string; label: string; icon: string }[] }
  | { t: "white-section"; id?: string; caption: string; statement: string }
  | { t: "bullets-card"; id?: string; sectionCaption: string; text: string; items: string[] };

type Step = { label: string; href: string };

type CaseContent = {
  eyebrow: string;
  title: string;
  steps: Step[];
  blocks: Block[];
};

const blocksUk: Block[] = [
  {
    t: "meta",
    id: "context",
    items: [
      { label: "Роль", value: "Product Designer" },
      { label: "Команда", value: "Product manager, UX writer, Front-end розробник, Back-end розробник" },
      { label: "Таймінг", value: "6 місяців" },
      { label: "Інструменти", value: "Figma" },
    ],
  },

  {
    t: "dark-section",
    caption: "Про продукт",
    statement:
      "Snov.io — платформа для лідогенерації, створена для спеціалістів із продажів, рекрутерів та маркетологів. Сервіс знаходить контакти необхідних людей для аутрічу.",
    img: { label: "Snov.io — промо", ratio: "1144/658", src: "/images/works/snov/case-snov.io-promo-ua.webp" },
  },

  {
    t: "figures",
    caption: "Платформою користуються",
    items: [
      { value: "3 млн.", label: "юзерів", icon: "1" },
      { value: "300 тис.", label: "компаній", icon: "2" },
      { value: "180", label: "країн", icon: "3" },
    ],
  },

  {
    t: "white-section",
    id: "problems",
    caption: "Мета",
    statement:
      "Залучити користувачів, які використовують лише лідогенерацію з LinkedIn, та збільшити загальні показники утримання клієнтів Retention.",
  },

  {
    t: "white-section",
    caption: "Про кейс",
    statement:
      "Автоматизація LinkedIn необхідна всім, хто займається лідогенерацією з LinkedIn, а саме: автоматизація запитів на підключення, повідомлення, лайки постів та перегляди профілів.",
  },

  {
    t: "dark-slider",
    id: "research",
    caption: "Дизайн процес",
    slides: [
      {
        caption: "Дослідження. Аналіз конкурентів",
        text: "Основні конкуренти вже використовували мультиканальні кампанії, і першим кроком було дослідити всі механіки та можливості наявних рішень.",
        imgLabel: "Аналіз конкурентів",
        imgRatio: "1144/640",
        imgSrc: "/images/works/snov/discovery-1.webp",
      },
      {
        caption: "Дослідження. Low user flow",
        text: "Сценарій: коли мені потрібно згенерувати ліди, я збираю список контактів з обов'язковою наявністю посилань на профіль LinkedIn. Далі я створюю автоматичну мультиканальну кампанію.",
        imgLabel: "Low user flow",
        imgRatio: "1144/640",
        imgSrc: "/images/works/snov/discovery-2.webp",
      },
    ],
  },

  {
    t: "bullets-card",
    sectionCaption: "Інсайти",
    text: "Інсайти від Sales managers",
    items: [
      "Не використовувати ручні операції, автоматизувати все, що тільки можливо;",
      "Обмежувати автоматизацію в рамках лімітів LinkedIn, щоб сервіс не забанив акаунти;",
      "Використовувати рішення, які зможуть збільшити можливість надсилати запити та сповіщення, наприклад LinkedIn ротація.",
    ],
  },

  {
    t: "light-section",
    id: "decision",
    caption: "Концепт. LinkedIn профіль",
    statement:
      "Ми також оновили профіль LinkedIn, додали індекс Social Selling Index та важливу інформацію про Proxy для користувачів, яким потрібно розуміти місцезнаходження свого облікового запису.",
    img: { label: "LinkedIn профіль — концепт", ratio: "1144/822", videoSrc: "/images/works/snov/snov-linkedin-profile.webm" },
  },

  {
    t: "light-section",
    caption: "Концепт. LinkedIn кампанії",
    statement:
      "В останній версії ми додали такі основні дії, як View profile, Like post, Send connection requests, Follow, Messages та InMail. Це базові елементи, які потрібні для створення LinkedIn автоматизації.",
    img: { label: "LinkedIn кампанії — концепт", ratio: "1144/822", videoSrc: "/images/works/snov/snov-linkedin-fullflow.webm" },
  },

  {
    t: "bullets-card",
    id: "summary",
    sectionCaption: "Результати",
    text: "",
    items: [
      "Кількісний опитувальник показав позитивний відгук від користувачів, які відмітили дуже простий флоу створення LinkedIn кампаній, зручний аналіз результатів як однієї кампанії, так й декількох одночасно;",
      "Retention rate інструменту 80%;",
      "Кількість проданих слотів, та дохід від впровадженого функціоналу під NDA.",
    ],
  },
];

const blocksEn: Block[] = [
  {
    t: "meta",
    id: "context",
    items: [
      { label: "Role", value: "Product Designer" },
      { label: "Team", value: "Product manager, UX writer, Front-end developer, Back-end developer" },
      { label: "Timeline", value: "6 months" },
      { label: "Tools", value: "Figma" },
    ],
  },

  {
    t: "dark-section",
    caption: "About the product",
    statement:
      "Snov.io is a lead generation platform built for sales professionals, recruiters, and marketers. The service finds contact information for the right people to reach out to.",
    img: { label: "Snov.io — promo", ratio: "1144/658", src: "/images/works/snov/case-snov.io-promo-ua.webp" },
  },

  {
    t: "figures",
    caption: "Platform is used by",
    items: [
      { value: "3M", label: "users", icon: "1" },
      { value: "300K", label: "companies", icon: "2" },
      { value: "180", label: "countries", icon: "3" },
    ],
  },

  {
    t: "white-section",
    id: "problems",
    caption: "Goal",
    statement:
      "Engage users who only use LinkedIn lead generation and increase the overall customer retention rate.",
  },

  {
    t: "white-section",
    caption: "About the case",
    statement:
      "LinkedIn automation is essential for everyone doing lead generation on LinkedIn — automating connection requests, messages, post likes, and profile views.",
  },

  {
    t: "dark-slider",
    id: "research",
    caption: "Design process",
    slides: [
      {
        caption: "Research. Competitor analysis",
        text: "Key competitors were already using multichannel campaigns, so the first step was to explore all the mechanics and capabilities of existing solutions.",
        imgLabel: "Competitor analysis",
        imgRatio: "1144/640",
        imgSrc: "/images/works/snov/discovery-1.webp",
      },
      {
        caption: "Research. Low user flow",
        text: "Scenario: when I need to generate leads, I collect a list of contacts that must include LinkedIn profile links. Then I create an automated multichannel campaign.",
        imgLabel: "Low user flow",
        imgRatio: "1144/640",
        imgSrc: "/images/works/snov/discovery-2.webp",
      },
    ],
  },

  {
    t: "bullets-card",
    sectionCaption: "Insights",
    text: "Insights from Sales managers",
    items: [
      "Avoid manual operations — automate everything possible;",
      "Keep automation within LinkedIn's limits to prevent accounts from being banned;",
      "Use solutions that increase the ability to send requests and notifications, such as LinkedIn account rotation.",
    ],
  },

  {
    t: "light-section",
    id: "decision",
    caption: "Concept. LinkedIn profile",
    statement:
      "We also updated the LinkedIn profile, added the Social Selling Index and important Proxy information for users who need to understand the location of their account.",
    img: { label: "LinkedIn profile — concept", ratio: "1144/822", videoSrc: "/images/works/snov/snov-linkedin-profile.webm" },
  },

  {
    t: "light-section",
    caption: "Concept. LinkedIn campaigns",
    statement:
      "In the latest version we added core actions such as View profile, Like post, Send connection requests, Follow, Messages, and InMail. These are the essential building blocks for creating LinkedIn automation.",
    img: { label: "LinkedIn campaigns — concept", ratio: "1144/822", videoSrc: "/images/works/snov/snov-linkedin-fullflow.webm" },
  },

  {
    t: "bullets-card",
    id: "summary",
    sectionCaption: "Results",
    text: "",
    items: [
      "A quantitative survey showed positive feedback from users who found the LinkedIn campaign creation flow very simple and the analytics easy to use — both for individual campaigns and multiple campaigns at once;",
      "Tool retention rate: 80%;",
      "Number of sold seats and revenue from the shipped feature — under NDA.",
    ],
  },
];

const content: Record<Locale, CaseContent> = {
  uk: {
    eyebrow: "Snov.io",
    title: "Створення нового інструменту, який дав приріст продаж, та 80% retention",
    steps: [
      { label: "Контекст", href: "#context" },
      { label: "Мета", href: "#problems" },
      { label: "Дослідження", href: "#research" },
      { label: "Концепт", href: "#decision" },
      { label: "Результати", href: "#summary" },
    ],
    blocks: blocksUk,
  },
  en: {
    eyebrow: "Snov.io",
    title: "Building a new tool that drove sales growth and 80% retention",
    steps: [
      { label: "Context", href: "#context" },
      { label: "Goal", href: "#problems" },
      { label: "Research", href: "#research" },
      { label: "Concept", href: "#decision" },
      { label: "Results", href: "#summary" },
    ],
    blocks: blocksEn,
  },
};

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

function Caption({ text }: { text: string }) {
  return <p className="text-sm font-bold text-[#8D775E]">{text}</p>;
}

function ImgPlaceholder({ label, ratio, className = "rounded-lg" }: { label: string; ratio: string; className?: string }) {
  return (
    <div
      className={`w-full bg-black/[0.06] border border-black/5 flex items-center justify-center ${className}`}
      style={{ aspectRatio: ratio.replace("/", " / ") }}
    >
      <span className="text-sm text-[#171311]/35 px-4 text-center">{label}</span>
    </div>
  );
}

function renderBlock(block: Block, i: number) {
  switch (block.t) {
    case "meta":
      return (
        <div
          key={i}
          id={block.id}
          className="scroll-mt-36 rounded-2xl bg-[#FFFEF9] p-6 grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-6"
        >
          {block.items.map((m) => (
            <div key={m.label} className="flex flex-col gap-2">
              <p className="text-sm font-bold text-[#4A2C1A]">{m.label}</p>
              <p className="text-sm md:text-[16px] lg:text-lg font-medium text-[#171311]">{m.value}</p>
            </div>
          ))}
        </div>
      );
    case "dark-slider":
      return <DarkSlider key={i} id={block.id} caption={block.caption} slides={block.slides} />;
    case "dark-section":
      return (
        <div key={i} id={block.id} className="scroll-mt-36 rounded-3xl bg-[#4A2C1A] overflow-hidden flex flex-col">
          <div className="px-4 md:px-6 lg:px-8 pt-8 md:pt-10 lg:pt-12 pb-6 md:pb-7 lg:pb-8">
            <div className="max-w-[912px] mx-auto flex flex-col gap-4">
              <p className="text-sm font-bold text-[#FFCD00]">{block.caption}</p>
              <p className="text-[17px] md:text-[22px] lg:text-[30px] leading-[1.3] text-[#FEF9DB] font-normal">{block.statement}</p>
            </div>
          </div>
          <div className="max-w-[1144px] mx-auto w-full px-4 md:px-6 lg:px-8 pb-4 md:pb-6 lg:pb-8">
            {block.img.src ? (
              <img src={block.img.src} alt={block.img.label} className="w-full rounded-lg" />
            ) : (
              <ImgPlaceholder label={block.img.label} ratio={block.img.ratio} />
            )}
          </div>
        </div>
      );
    case "light-section":
      return (
        <div key={i} id={block.id} className="scroll-mt-36 rounded-3xl bg-white overflow-hidden flex flex-col">
          <div className="px-4 md:px-6 lg:px-8 pt-6 md:pt-8 lg:pt-10 pb-6 md:pb-7 lg:pb-8">
            <div className="max-w-[912px] mx-auto flex flex-col gap-4">
              <Caption text={block.caption} />
              <p className="text-[17px] md:text-[22px] lg:text-[30px] leading-[1.3] text-[#171311] font-normal">{block.statement}</p>
            </div>
          </div>
          <div className="max-w-[1144px] mx-auto w-full px-4 md:px-6 lg:px-8 pb-4 md:pb-6 lg:pb-8">
            {block.img.videoSrc
              ? <LazyVideo src={block.img.videoSrc} className="w-full rounded-lg" />
              : block.img.src
                ? <img src={block.img.src} alt={block.img.label} className="w-full rounded-lg" />
                : <ImgPlaceholder label={block.img.label} ratio={block.img.ratio} />}
          </div>
        </div>
      );
    case "white-section":
      return (
        <div key={i} id={block.id} className="scroll-mt-36 rounded-3xl bg-white px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-10">
          <div className="max-w-[912px] mx-auto flex flex-col gap-4">
            <Caption text={block.caption} />
            <p className="text-[17px] md:text-[22px] lg:text-[30px] leading-[1.3] text-[#171311] font-normal">{block.statement}</p>
          </div>
        </div>
      );
    case "figures":
      return (
        <div key={i} id={block.id} className="bg-white rounded-3xl px-4 md:px-6 lg:px-8 pt-6 md:pt-9 lg:pt-12 pb-6 md:pb-7 lg:pb-8">
          <div className="max-w-[912px] mx-auto flex flex-col gap-5">
            <p className="text-sm font-bold text-[#8d775e]">{block.caption}</p>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {block.items.map((f) => (
                <div key={f.label} className="bg-[#FBCF0B] rounded-2xl px-6 pt-6 md:pt-10 pb-6 flex flex-col gap-4">
                  <div className="w-[60px] h-[60px] md:w-[100px] md:h-[100px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/images/works/snov/icon-${f.icon}.svg`} alt="" className="w-full h-full" />
                  </div>
                  <div className="text-[17px] md:text-[22px] lg:text-[30px] leading-[1.2] text-[#171311] font-normal">
                    <p>{f.value}</p>
                    <p>{f.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    case "bullets-card":
      return (
        <div key={i} id={block.id} className="scroll-mt-36 rounded-3xl bg-white px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-10">
          <div className="max-w-[912px] mx-auto flex flex-col gap-6">
            <Caption text={block.sectionCaption} />
            <div className="rounded-2xl bg-[#FBCF0B] px-4 md:px-7 lg:px-10 py-4 md:py-6 lg:py-8 flex flex-col gap-6">
              {block.text && (
                <p className="text-[17px] md:text-[22px] lg:text-[30px] leading-[1.3] text-[#171311] font-normal">{block.text}</p>
              )}
              <ul className="flex flex-col gap-4">
                {block.items.map((it, j) => (
                  <li key={j} className="flex gap-4 text-[17px] md:text-[22px] lg:text-[30px] leading-[1.3] text-[#171311] font-normal">
                    <span className="text-[#171311]/30 shrink-0">•</span>
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      );
  }
}

export default async function SnovPage({
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
    <div className="min-h-screen flex flex-col bg-[#fcf9df]">
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
        <div className="px-4 md:px-8 lg:px-12 pt-14 pb-4">
          <header className="max-w-[912px] mx-auto flex flex-col gap-2">
            <p className="text-sm font-bold text-[#8D775E]">{c.eyebrow}</p>
            <h1 className="text-[22px] md:text-[28px] lg:text-[36px] font-bold text-[#171311] leading-[1.25]">{c.title}</h1>
          </header>
        </div>

        <CaseStepsNav items={c.steps} />

        <article className="pt-6 px-4 md:px-8 lg:px-12">
          <div className="flex flex-col gap-6 md:gap-8">
            {c.blocks.map((block, i) => {
              if (block.t === "dark-section" || block.t === "dark-slider" || block.t === "light-section" || block.t === "figures" || block.t === "white-section" || block.t === "bullets-card") {
                return <div key={i}>{renderBlock(block, i)}</div>;
              }
              return (
                <div key={i} className="max-w-[912px] mx-auto w-full">
                  {renderBlock(block, i)}
                </div>
              );
            })}
          </div>
        </article>
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

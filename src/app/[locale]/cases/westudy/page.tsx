import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { translations, type Locale } from "@/lib/translations";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CaseStepsNav from "@/components/CaseStepsNav";
import BeforeAfterBlock from "@/components/BeforeAfterBlock";
import DarkSlider from "@/components/DarkSlider";
import BrowserCarousel from "@/components/BrowserCarousel";
import SiteShowcase, { type ShowcaseSite } from "@/components/SiteShowcase";

export function generateStaticParams() {
  return [{ locale: "uk" }, { locale: "en" }];
}

type Block =
  | { t: "meta"; id?: string; items: { label: string; value: string }[] }
  | { t: "dark-section"; id?: string; caption: string; statement: string; img?: { label: string; ratio: string; src?: string }; carousel?: boolean }
  | { t: "white-section"; id?: string; caption: string; statement: string }
  | { t: "before-after"; id?: string; caption: string; statement: string; before: { label: string; ratio: string; src?: string }; after: { label: string; ratio: string; src?: string }; beforeLabel?: string; afterLabel?: string }
  | { t: "dark-slider"; id?: string; caption: string; slides: { text: string; imgLabel: string; imgRatio: string; imgSrc?: string; videoSrc?: string }[] }
  | { t: "quotes"; id?: string; sectionCaption: string; groups: { caption: string; items: { text: string; author?: string }[] }[] }
  | { t: "showcase"; id?: string; caption: string; statement: string; sites: ShowcaseSite[] }
  | { t: "bullets-card"; id?: string; sectionCaption: string; text?: string; items: string[] };

type Step = { label: string; href: string };
type CaseContent = { eyebrow: string; title: string; steps: Step[]; blocks: Block[] };

const blocksUk: Block[] = [
  {
    t: "meta",
    id: "context",
    items: [
      { label: "Роль", value: "Product Designer" },
      { label: "Команда", value: "Product manager\nFront-end розробник\nBack-end розробник" },
      { label: "Таймінг", value: "6 місяців" },
      { label: "Інструменти", value: "Figma" },
    ],
  },

  {
    t: "dark-slider",
    caption: "Про продукт",
    slides: [
      {
        text: "Westudy — це рішення все в одному для створення курсів. Окрім створення курсів, платформа має вбудовані рішення для відправки емейлів, створення вебінарів, сайтів, та CRM.",
        imgLabel: "Westudy — промо 1",
        imgRatio: "1144/640",
        imgSrc: "/images/works/westudy/westudy-about-promo-1-en.webp",
      },
      {
        text: "Westudy — це рішення все в одному для створення курсів. Окрім створення курсів, платформа має вбудовані рішення для відправки емейлів, створення вебінарів, сайтів, та CRM.",
        imgLabel: "Westudy — промо 2",
        imgRatio: "1144/640",
        imgSrc: "/images/works/westudy/westudy-about-promo-2-en.webp",
      },
      {
        text: "Westudy — це рішення все в одному для створення курсів. Окрім створення курсів, платформа має вбудовані рішення для відправки емейлів, створення вебінарів, сайтів, та CRM.",
        imgLabel: "Westudy — промо 3",
        imgRatio: "1144/640",
        imgSrc: "/images/works/westudy/westudy-about-promo-3-en.webp",
      },
    ],
  },

  {
    t: "white-section",
    id: "goal",
    caption: "Мета",
    statement:
      "Зупинити відтік клієнтів, які були незадоволені платформою через незручний та незрозумілий інструмент створення сайтів.",
  },

  {
    t: "before-after",
    id: "case",
    caption: "Про кейс",
    statement:
      "Нова концепція — дати можливість створити сайт за лічені хвилини використовуючи вже наявну інформацію про курси на платформі.",
    before: { label: "Стара версія веб-білдера", ratio: "1144/640", src: "/images/works/westudy/case-westudy-before-ua.webp" },
    after: { label: "Нова версія веб-білдера", ratio: "1144/640", src: "/images/works/westudy/case-westudy-after-ua.webp" },
  },

  {
    t: "quotes",
    id: "insights",
    sectionCaption: "Інсайти",
    groups: [
      {
        caption: "Інсайти від користувачів",
        items: [
          {
            text: "Я замучалась робити сайт, намагалась декілька разів створити щось, потім психанула й зробила за день сайт на іншій платформі.",
          },
          {
            text: "Не розумію навіщо платити за сервіс, в якому нормально працює лише частина функціоналу.",
          },
          {
            text: "Моя моб версія сайту жахлива, я багато разів спілкувався з службою підтримки, й все одно не допомогло — зробити сайт однаково читабельним на всіх пристроях неможливо!",
          },
        ],
      },
    ],
  },

  {
    t: "dark-slider",
    id: "concept",
    caption: "Концепція",
    slides: [
      {
        text: "Унікальний стиль, дизайн, адаптивна поведінка сторінки, шаблони блоків та багато інших функцій, які спростили створення сайту з більш складним дизайном.",
        imgLabel: "Концепція — Авторський дизайн",
        imgRatio: "1144/640",
        videoSrc: "/images/works/westudy/blocks-demo.webm",
      },
      {
        text: "Зробили універсальну сторінку по замовченню для всіх, хто не хоче мати унікальний дизайн, а лише інформацію про курси, вартість й можливість їх придбати.",
        imgLabel: "Концепція — Універсальний сайт",
        imgRatio: "1144/640",
        imgSrc: "/images/works/westudy/discovery-2.webp",
      },
    ],
  },

  {
    t: "dark-section",
    caption: "Приклади сайтів",
    statement:
      "Сайти користувачів, які робили авторський дизайн самостійно або підключали професійних дизайнерів.",
    carousel: true,
  },

  // «Оновлена презентація робіт» — новий блок з анімацією скролу сайтів у вікні браузера (SiteShowcase).
  // Тимчасово відключений, поки нема реальних довгих скріншотів. Щоб увімкнути — розкоментуй.
  // {
  //   t: "showcase",
  //   caption: "Оновлена презентація робіт",
  //   statement:
  //     "Сайти користувачів, які робили авторський дизайн самостійно або підключали професійних дизайнерів.",
  //   sites: [
  //     { url: "site-example-1.com" },
  //     { url: "site-example-2.com" },
  //     { url: "site-example-3.com" },
  //   ],
  // },

  {
    t: "bullets-card",
    id: "results",
    sectionCaption: "Результати",
    items: [
      "Після оновлень, за допомогою партнерів-дизайнерів, ми оновили сайти чинним користувачам (які мали власні сайти), перевірили реальну роботу сервісу, виправили безліч технічних проблем та доопрацювали UX.",
      "За перші 3 місяці було оновлено та створено більше 100 сайтів.",
      "Нові можливості редактора, а також оновлений вид «автоматичних» сайтів зупинив відтік користувачів, яких не задовольняв інструмент, та отримав багато позитивних відгуків.",
    ],
  },
];

const blocksEn: Block[] = [
  {
    t: "meta",
    id: "context",
    items: [
      { label: "Role", value: "Product Designer" },
      { label: "Team", value: "Product manager\nFront-end developer\nBack-end developer" },
      { label: "Timeline", value: "6 months" },
      { label: "Tools", value: "Figma" },
    ],
  },

  {
    t: "dark-slider",
    caption: "About the product",
    slides: [
      {
        text: "Westudy is an all-in-one solution for creating online courses. In addition to course creation, the platform has built-in tools for email campaigns, webinars, websites, and CRM.",
        imgLabel: "Westudy — promo 1",
        imgRatio: "1144/640",
        imgSrc: "/images/works/westudy/westudy-about-promo-1-ua.webp",
      },
      {
        text: "Westudy is an all-in-one solution for creating online courses. In addition to course creation, the platform has built-in tools for email campaigns, webinars, websites, and CRM.",
        imgLabel: "Westudy — promo 2",
        imgRatio: "1144/640",
        imgSrc: "/images/works/westudy/westudy-about-promo-2-ua.webp",
      },
      {
        text: "Westudy is an all-in-one solution for creating online courses. In addition to course creation, the platform has built-in tools for email campaigns, webinars, websites, and CRM.",
        imgLabel: "Westudy — promo 3",
        imgRatio: "1144/640",
        imgSrc: "/images/works/westudy/westudy-about-promo-3-ua.webp",
      },
    ],
  },

  {
    t: "white-section",
    id: "goal",
    caption: "Goal",
    statement:
      "Stop the churn of customers who were dissatisfied with the platform due to its inconvenient and confusing website builder.",
  },

  {
    t: "before-after",
    id: "case",
    caption: "About the case",
    statement:
      "A new concept — enable users to create a website in minutes using existing course information already on the platform.",
    before: { label: "Old website builder", ratio: "1144/640", src: "/images/works/westudy/case-westudy-before-ua.webp" },
    after: { label: "New website builder", ratio: "1144/640", src: "/images/works/westudy/case-westudy-after-ua.webp" },
    beforeLabel: "Before",
    afterLabel: "After",
  },

  {
    t: "quotes",
    id: "insights",
    sectionCaption: "Insights",
    groups: [
      {
        caption: "Insights from users",
        items: [
          {
            text: "I got so frustrated trying to build a site, I tried multiple times, then gave up and built one on another platform in a day.",
          },
          {
            text: "I don't understand why I'm paying for a service where only part of the functionality actually works.",
          },
          {
            text: "My mobile version looks terrible. I contacted support many times and nothing helped — it's impossible to make the site look the same on all devices!",
          },
        ],
      },
    ],
  },

  {
    t: "dark-slider",
    id: "concept",
    caption: "Concept",
    slides: [
      {
        text: "Unique styles, design, responsive behavior, block templates, and many other features that made building a more complex custom site much simpler.",
        imgLabel: "Concept — Custom design",
        imgRatio: "1144/640",
        videoSrc: "/images/works/westudy/blocks-demo.webm",
      },
      {
        text: "We built a universal default page for everyone who doesn't want a unique design — just course info, pricing, and a way to purchase.",
        imgLabel: "Concept — Universal site",
        imgRatio: "1144/640",
        imgSrc: "/images/works/westudy/discovery-2.webp",
      },
    ],
  },

  {
    t: "dark-section",
    caption: "Site examples",
    statement:
      "Sites built by users who designed them independently or hired professional designers.",
    carousel: true,
  },

  // "Updated works presentation" — new SiteShowcase block (scrolling sites in a browser frame).
  // Temporarily disabled until real full-page screenshots are ready. Uncomment to enable.
  // {
  //   t: "showcase",
  //   caption: "Site examples",
  //   statement:
  //     "Sites built by users who designed them independently or hired professional designers.",
  //   sites: [
  //     { url: "site-example-1.com" },
  //     { url: "site-example-2.com" },
  //     { url: "site-example-3.com" },
  //   ],
  // },

  {
    t: "bullets-card",
    id: "results",
    sectionCaption: "Results",
    items: [
      "After the update, with help from partner designers, we refreshed existing users' sites, tested real-world usage, fixed many technical issues, and refined the UX.",
      "In the first 3 months, over 100 sites were updated or created.",
      "The new editor capabilities and improved automatic site experience stopped the churn among dissatisfied users and received many positive reviews.",
    ],
  },
];

const content: Record<Locale, CaseContent> = {
  uk: {
    eyebrow: "WeStudy",
    title: "Створили сучасний веб-білдер сайту, який припинив відтік клієнтів сервісу",
    steps: [
      { label: "Контекст", href: "#context" },
      { label: "Мета", href: "#goal" },
      { label: "Дослідження", href: "#insights" },
      { label: "Концепт", href: "#concept" },
      { label: "Результати", href: "#results" },
    ],
    blocks: blocksUk,
  },
  en: {
    eyebrow: "WeStudy",
    title: "Built a modern website builder that stopped customer churn",
    steps: [
      { label: "Context", href: "#context" },
      { label: "Goal", href: "#goal" },
      { label: "Research", href: "#insights" },
      { label: "Concept", href: "#concept" },
      { label: "Results", href: "#results" },
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
  return <p className="text-sm font-bold text-muted-foreground">{text}</p>;
}

function ImgPlaceholder({ label, ratio }: { label: string; ratio: string }) {
  return (
    <div
      className="w-full rounded-2xl bg-black/[0.06] border border-black/5 flex items-center justify-center"
      style={{ aspectRatio: ratio.replace("/", " / ") }}
    >
      <span className="text-sm text-foreground/35 px-4 text-center">{label}</span>
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
          className="scroll-mt-36 rounded-2xl bg-background-alt p-6 grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-6"
        >
          {block.items.map((m) => (
            <div key={m.label} className="flex flex-col gap-2">
              <p className="text-sm font-bold text-accent-foreground">{m.label}</p>
              <p className="text-sm md:text-[16px] lg:text-lg font-medium text-foreground whitespace-pre-line">{m.value}</p>
            </div>
          ))}
        </div>
      );
    case "white-section":
      return (
        <div key={i} id={block.id} className="scroll-mt-36 rounded-3xl bg-white px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-10">
          <div className="max-w-[912px] mx-auto flex flex-col gap-4">
            <Caption text={block.caption} />
            <p className="text-[17px] md:text-[22px] lg:text-[30px] leading-[1.3] text-foreground font-normal">{block.statement}</p>
          </div>
        </div>
      );
    case "dark-section":
      return (
        <div key={i} id={block.id} className="scroll-mt-36 rounded-3xl bg-secondary overflow-hidden flex flex-col">
          <div className="px-4 md:px-6 lg:px-8 pt-8 md:pt-10 lg:pt-12 pb-6 md:pb-7 lg:pb-8">
            <div className="max-w-[912px] mx-auto flex flex-col gap-4">
              <p className="text-sm font-bold text-primary">{block.caption}</p>
              <p className="text-[17px] md:text-[22px] lg:text-[30px] leading-[1.3] text-secondary-foreground font-normal">{block.statement}</p>
            </div>
          </div>
          {block.carousel && (
            <div className="max-w-[1144px] mx-auto w-full px-4 md:px-6 lg:px-8 pb-4 md:pb-6 lg:pb-8">
              <BrowserCarousel />
            </div>
          )}
          {block.img && (
            <div className="max-w-[1144px] mx-auto w-full px-4 md:px-6 lg:px-8 pb-4 md:pb-6 lg:pb-8">
              {block.img.src
                ? <img src={block.img.src} alt={block.img.label} className="w-full rounded-lg" />
                : <ImgPlaceholder label={block.img.label} ratio={block.img.ratio} />}
            </div>
          )}
        </div>
      );
    case "dark-slider":
      return <DarkSlider key={i} id={block.id} caption={block.caption} slides={block.slides} />;
    case "showcase":
      return (
        <div key={i} id={block.id} className="scroll-mt-36 rounded-3xl bg-secondary overflow-hidden flex flex-col">
          <div className="px-4 md:px-6 lg:px-8 pt-8 md:pt-10 lg:pt-12 pb-6 md:pb-7 lg:pb-8">
            <div className="max-w-[912px] mx-auto flex flex-col gap-4">
              <p className="text-sm font-bold text-primary">{block.caption}</p>
              <p className="text-[17px] md:text-[22px] lg:text-[30px] leading-[1.3] text-secondary-foreground font-normal">{block.statement}</p>
            </div>
          </div>
          <div className="max-w-[1144px] mx-auto w-full px-4 md:px-6 lg:px-8 pb-4 md:pb-6 lg:pb-8">
            <SiteShowcase sites={block.sites} />
          </div>
        </div>
      );
    case "before-after":
      return (
        <BeforeAfterBlock
          key={i}
          caption={block.caption}
          statement={block.statement}
          before={block.before}
          after={block.after}
          beforeLabel={block.beforeLabel}
          afterLabel={block.afterLabel}
        />
      );
    case "quotes":
      return (
        <div key={i} id={block.id} className="scroll-mt-36 rounded-3xl bg-primary px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-10">
          <div className="max-w-[912px] mx-auto flex flex-col gap-6">
            <Caption text={block.sectionCaption} />
            {block.groups.map((g, gi) => (
              <div key={gi} className="rounded-2xl bg-background-alt px-4 md:px-8 lg:px-10 py-6 md:py-8 flex flex-col gap-6">
                <p className="text-sm font-bold text-accent-foreground text-center">{g.caption}</p>
                <div className="flex flex-col gap-6">
                  {g.items.map((q, qi) => (
                    <div key={qi} className="flex flex-col gap-1 text-center">
                      <p className="text-[17px] md:text-[22px] lg:text-[30px] leading-[1.3] text-foreground font-normal">— {q.text}</p>
                      {q.author && <p className="text-xs md:text-sm text-foreground/45">{q.author}</p>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    case "bullets-card":
      return (
        <div key={i} id={block.id} className="scroll-mt-36 rounded-3xl bg-white px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-10">
          <div className="max-w-[912px] mx-auto flex flex-col gap-6">
            <Caption text={block.sectionCaption} />
            <div className="rounded-2xl bg-primary px-4 md:px-7 lg:px-10 py-4 md:py-6 lg:py-8 flex flex-col gap-6">
              {block.text && (
                <p className="text-[17px] md:text-[22px] lg:text-[30px] leading-[1.3] text-foreground font-normal">{block.text}</p>
              )}
              <ul className="flex flex-col gap-4">
                {block.items.map((it, j) => (
                  <li key={j} className="flex gap-4 text-[17px] md:text-[22px] lg:text-[30px] leading-[1.3] text-foreground font-normal">
                    <span className="text-foreground/30 shrink-0">•</span>
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

export default async function WestudyPage({
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
    <div className="min-h-screen flex flex-col bg-background">
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
            <Caption text={c.eyebrow} />
            <h1 className="text-[22px] md:text-[28px] lg:text-[36px] font-bold text-foreground leading-[1.25]">{c.title}</h1>
          </header>
        </div>

        <CaseStepsNav items={c.steps} />

        <article className="pt-6 px-4 md:px-8 lg:px-12">
          <div className="flex flex-col gap-6 md:gap-8">
            {c.blocks.map((block, i) =>
              block.t === "meta"
                ? <div key={i} className="max-w-[912px] mx-auto w-full">{renderBlock(block, i)}</div>
                : renderBlock(block, i)
            )}
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

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { translations, type Locale } from "@/lib/translations";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CaseStepsNav from "@/components/CaseStepsNav";
import DarkSlider from "@/components/DarkSlider";

export function generateStaticParams() {
  return [{ locale: "uk" }, { locale: "en" }];
}

type Block =
  | { t: "meta"; id?: string; items: { label: string; value: string }[] }
  | { t: "caption"; id?: string; text: string }
  | { t: "statement"; text: string }
  | { t: "dark-section"; caption: string; statement: string; img: { label: string; ratio: string; src?: string } }
  | { t: "dark-slider"; id?: string; caption: string; slides: { text: string; imgLabel: string; imgRatio: string; imgSrc?: string }[] }
  | { t: "light-section"; id?: string; caption: string; statement: string; img: { label: string; ratio: string; src?: string } }
  | { t: "figures"; caption: string; items: { value: string; label: string; icon: string }[] }
  | { t: "img"; label: string; ratio: string }
  | { t: "proposal"; id?: string; sectionCaption?: string; items: { n: string; text: string }[] }
  | { t: "quotes"; id?: string; sectionCaption?: string; groups: { caption: string; items: { text: string; author?: string }[] }[] }
  | { t: "white-section"; id?: string; caption: string; statement: string }
  | { t: "bullets"; text: string; items: string[] }
  | { t: "bullets-card"; id?: string; sectionCaption: string; text: string; items: string[] };

type Step = { label: string; href: string };

type CaseContent = {
  eyebrow: string;
  title: string;
  steps: Step[];
  blocks: Block[];
};

// NOTE: body copy is UA for now (EN to be translated later).
const blocksUk: Block[] = [
  {
    t: "meta",
    id: "context",
    items: [
      { label: "Роль", value: "Product Designer" },
      { label: "Команда", value: "Flutter розробник, Backend розробник" },
      { label: "Таймінг", value: "1 місяць" },
      { label: "Інструменти", value: "Figma, Claude Code" },
    ],
  },

  {
    t: "dark-section",
    caption: "Про продукт",
    statement:
      "Єдина школа це безкоштовна платформа для державних освітніх закладів, платна для приватних освітніх закладів.",
    img: { label: "Yedyna school — промо", ratio: "1144/658", src: "/images/works/eschool/case-Yedyna school-promo-ua.webp" },
  },

  {
    t: "figures",
    caption: "Платформою користуються",
    items: [
      { value: "930 тисяч", label: "батьків", icon: "parents" },
      { value: "1,2 млн.", label: "учнів", icon: "students" },
      { value: "3,5 тисяч", label: "шкіл", icon: "schools" },
      { value: "89 тисяч", label: "викладачів", icon: "teachers" },
    ],
  },

  {
    t: "white-section",
    caption: "Гіпотеза",
    statement: "Зробити платну поглиблену аналітику учня на основі оцінок, домашніх завдань та інших даних, також давати рекомендації репетиторів та інше.",
  },

  {
    t: "light-section",
    id: "problems",
    caption: "Проблеми, біль, сльози, розпач",
    statement: "Команда вже мала реліз сервісу рекомендацій для батьків «Поговорімо», але зазнала невдачі через неякісні дані — вчителі або взагалі не заповнювали журнали, або не робили це своєчасно. Батьки бачили нерелевантні рекомендації та відписувались.",
    img: { label: "Старий «Поговорімо»", ratio: "1144/570", src: "/images/works/eschool/case-old-version-ua.webp" },
  },

  {
    t: "quotes",
    id: "research-anchor",
    sectionCaption: "Дослідження",
    groups: [
      {
        caption: "Інсайти від експертів з галузі освіти",
        items: [
          {
            text: "— Заповнення електронних журналів з оцінками залежить як від школи, так й від окремого вчителя. Незаповнений журнал — відсутні дані для аналізу.",
          },
          {
            text: "— Через велике навантаження, багато хто з вчителів просто не встигає це робити, або лінь, або інші фактори.",
            author: "Марина Л.",
          },
        ],
      },
      {
        caption: "Інсайти від батьків",
        items: [
          {
            text: "— Дай Боже, щоб дитина взагалі пішла до школи, нескінченні тривоги, майже повне самостійне навчання вдома.",
            author: "Ольга, 40 років",
          },
          {
            text: "— Раз на два тижні я бачу якісь оцінки, але вони взагалі не відповідають тому що вони навчали.",
            author: "Юля, 36 років",
          },
          {
            text: "— Мені подобався сервіс «Поговорімо», але коли я бачив що рекомендації дуже загальні, або нерелевантні до того, що навчають в школі, я відписався.",
            author: "Юрій, 23 років",
          },
        ],
      },
    ],
  },

  {
    t: "proposal",
    id: "concept",
    sectionCaption: "Що я запропонував",
    items: [
      { n: "01", text: "Оновити інструмент створення тем уроків, додавши шаблони з готовими варіантами тем." },
      { n: "02", text: "Запропонував Gallup-підхід до рекомендацій — підсилювати те, що дитині вдається найкраще." },
      { n: "03", text: "Зробити feedback на кожен блок окремо та створити процес постійного оновлення алгоритмів рекомендацій." },
    ],
  },

  {
    t: "light-section",
    caption: "Концепт. Шаблони",
    statement: "Поки не вирішимо проблему з даними, немає сенсу щось робити взагалі. Для вчителів запропонували заповнення журналів використовуючи шаблони. Під кожний предмет, кожного класу — декілька варіантів. Це більше 100 шаблонів.",
    img: { label: "Шаблони тем уроків", ratio: "1144/822", src: "/images/works/eschool/case-templates-ua.webp" },
  },

  {
    t: "dark-slider",
    caption: "Концепт. Рекомендації",
    slides: [
      {
        text: "Рекомендації формуються на основі даних: оцінки, відвідуваність, домашні завдання. Але вони мали дуже загальний характер, користь була поверхнева — я запропонував поміняти алгоритми.",
        imgLabel: "Рекомендації — промо",
        imgRatio: "1144/640",
        imgSrc: "/images/works/eschool/case-app-1-ua.webp",
      },
      {
        text: "Рекомендації реальних репетиторів з платформи Brainer (інший продукт Tatl Group), пропонуємо розвивати сильні навички, й базово підтримувати в тих предметах де є прогалини.",
        imgLabel: "Рекомендації — репетитори",
        imgRatio: "1144/640",
        imgSrc: "/images/works/eschool/case-app-2.webp",
      },
      {
        text: "Для учня пропонуємо оцінювати свій стан два рази на тиждень простим опитуванням, як їй в школі, що подобається, що на її погляд корисне, й навпаки.",
        imgLabel: "Рекомендації — опитування",
        imgRatio: "1144/640",
        imgSrc: "/images/works/eschool/case-app-3.webp",
      },
      {
        text: "Для учня пропонуємо оцінювати свій стан два рази на тиждень простим опитуванням, як їй в школі, що подобається, що на її погляд корисне, й навпаки.",
        imgLabel: "Рекомендації — опитування 2",
        imgRatio: "1144/640",
        imgSrc: "/images/works/eschool/case-app-3-2.webp",
      },
    ],
  },

  {
    t: "bullets-card",
    id: "summary",
    sectionCaption: "Підсумки",
    text: "Новий сервіс повноцінно запуститься в новому навчальному році, тому реальні результати очікуються від команди, а саме:",
    items: [
      "Конверсія з free preview у підписку",
      "Відсоток батьків, які залишають feedback по блоках",
      "Retention після першого місяця",
    ],
  },
];

const blocksEn: Block[] = [
  {
    t: "meta",
    id: "context",
    items: [
      { label: "Role", value: "Product Designer" },
      { label: "Team", value: "Flutter developer, Backend developer" },
      { label: "Timeline", value: "1 month" },
      { label: "Tools", value: "Figma, Claude Code" },
    ],
  },

  {
    t: "dark-section",
    caption: "About the product",
    statement:
      "Yedyna Shkola is a free platform for public schools and a paid platform for private educational institutions.",
    img: { label: "Yedyna school — promo", ratio: "1144/658", src: "/images/works/eschool/case-Yedyna school-promo-ua.webp" },
  },

  {
    t: "figures",
    caption: "Platform users",
    items: [
      { value: "930K", label: "parents", icon: "parents" },
      { value: "1.2M", label: "students", icon: "students" },
      { value: "3,500", label: "schools", icon: "schools" },
      { value: "89K", label: "teachers", icon: "teachers" },
    ],
  },

  {
    t: "white-section",
    caption: "Hypothesis",
    statement: "Build paid in-depth student analytics based on grades, homework, and other data — plus tutor recommendations and more.",
  },

  {
    t: "light-section",
    id: "problems",
    caption: "Problems, pain, tears, despair",
    statement: "The team had already launched a parent recommendation service called «Pohovorimo», but it failed due to poor data quality — teachers either didn't fill in grade journals at all or did so too late. Parents saw irrelevant recommendations and unsubscribed.",
    img: { label: "Old «Pohovorimo»", ratio: "1144/570", src: "/images/works/eschool/case-old-version-ua.webp" },
  },

  {
    t: "quotes",
    id: "research-anchor",
    sectionCaption: "Research",
    groups: [
      {
        caption: "Insights from education experts",
        items: [
          {
            text: "— Whether electronic grade journals get filled in depends both on the school and on the individual teacher. Unfilled journals mean missing data for analysis.",
          },
          {
            text: "— Due to heavy workload, many teachers simply don't have time to do it — or are lazy, or have other reasons.",
            author: "Marina L.",
          },
        ],
      },
      {
        caption: "Insights from parents",
        items: [
          {
            text: "— Thank God if the child just goes to school at all — endless air-raid alerts, almost fully home-based learning.",
            author: "Olha, 40",
          },
          {
            text: "— Once every two weeks I see some grades, but they don't match what the kids are actually studying.",
            author: "Yulia, 36",
          },
          {
            text: "— I liked the «Pohovorimo» service, but when I saw the recommendations were too generic or irrelevant to what they teach at school, I unsubscribed.",
            author: "Yuriy, 23",
          },
        ],
      },
    ],
  },

  {
    t: "proposal",
    id: "concept",
    sectionCaption: "What I proposed",
    items: [
      { n: "01", text: "Update the lesson topic creation tool by adding templates with ready-made topic options." },
      { n: "02", text: "Apply a Gallup-based approach to recommendations — amplify what the child does best." },
      { n: "03", text: "Add per-block feedback and build a continuous process for updating recommendation algorithms." },
    ],
  },

  {
    t: "light-section",
    caption: "Concept. Templates",
    statement: "Until we solve the data problem, there's no point doing anything else. We proposed that teachers fill in journals using templates — multiple options for each subject and each grade level. That's over 100 templates.",
    img: { label: "Lesson topic templates", ratio: "1144/822", src: "/images/works/eschool/case-templates-ua.webp" },
  },

  {
    t: "dark-slider",
    caption: "Concept. Recommendations",
    slides: [
      {
        text: "Recommendations are built from data: grades, attendance, homework. But they were too generic and provided little value — I proposed changing the algorithms.",
        imgLabel: "Recommendations — promo",
        imgRatio: "1144/640",
        imgSrc: "/images/works/eschool/case-app-1-ua.webp",
      },
      {
        text: "Real tutor recommendations from the Brainer platform (another Tatl Group product) — develop strong skills and provide basic support in subjects where there are gaps.",
        imgLabel: "Recommendations — tutors",
        imgRatio: "1144/640",
        imgSrc: "/images/works/eschool/case-app-2.webp",
      },
      {
        text: "We propose that students assess their state twice a week through a simple survey — how they feel at school, what they enjoy, what they find useful, and vice versa.",
        imgLabel: "Recommendations — survey",
        imgRatio: "1144/640",
        imgSrc: "/images/works/eschool/case-app-3.webp",
      },
      {
        text: "We propose that students assess their state twice a week through a simple survey — how they feel at school, what they enjoy, what they find useful, and vice versa.",
        imgLabel: "Recommendations — survey 2",
        imgRatio: "1144/640",
        imgSrc: "/images/works/eschool/case-app-3-2.webp",
      },
    ],
  },

  {
    t: "bullets-card",
    id: "summary",
    sectionCaption: "Summary",
    text: "The new service will fully launch in the new school year, so the team is targeting these real results:",
    items: [
      "Conversion from free preview to subscription",
      "Percentage of parents leaving per-block feedback",
      "Retention after the first month",
    ],
  },
];

const content: Record<Locale, CaseContent> = {
  uk: {
    eyebrow: "Єдина школа",
    title:
      "Створення глибинної аналітики учня та рекомендації, на основі успішності та відвідувань для 930 тисяч батьків",
    steps: [
      { label: "Контекст", href: "#context" },
      { label: "Проблема", href: "#problems" },
      { label: "Дослідження", href: "#research-anchor" },
      { label: "Концепт", href: "#concept" },
      { label: "Підсумки", href: "#summary" },
    ],
    blocks: blocksUk,
  },
  en: {
    eyebrow: "Yedyna Shkola",
    title:
      "Building deep student analytics and recommendations based on performance and attendance for 930K parents",
    steps: [
      { label: "Context", href: "#context" },
      { label: "Problem", href: "#problems" },
      { label: "Research", href: "#research-anchor" },
      { label: "Concept", href: "#concept" },
      { label: "Summary", href: "#summary" },
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

function IconParents() {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path d="M22.2012 31.5C29.5459 31.5001 35.4999 37.4541 35.5 44.7988V98.5H22.6797L13.2578 59.6465L12.9795 58.5H3.13379L9.68848 40.2939C11.5881 35.0177 16.5934 31.5 22.2012 31.5Z" stroke="#171311" strokeWidth="3"/>
      <path d="M49.7852 41.5C41.896 41.5 35.5 47.8959 35.5 55.7852V98.5H49.1826L52.5127 72.8076L52.5898 72.2139L53.0537 71.8359L57.0537 68.5859L58.0762 67.7549L59.0322 68.6611L73.0986 82H82.8789L85.2236 79.6553L77.0254 76.9229L76.4258 76.7227L76.1494 76.1533L68.666 60.6865L62.3535 48.9971C59.8595 44.3788 55.0338 41.5002 49.7852 41.5Z" stroke="#171311" strokeWidth="3"/>
      <rect x="20.5" y="11.5" width="10" height="15" rx="5" stroke="#171311" strokeWidth="3"/>
      <rect x="1.5" y="1.5" width="10" height="15" rx="5" transform="matrix(-1 0 0 1 49 20)" stroke="#171311" strokeWidth="3"/>
      <rect x="1.5" y="1.5" width="97" height="97" rx="14.5" stroke="black" strokeWidth="3"/>
      <path d="M100 82H79C70.1634 82 63 89.1634 63 98V100" stroke="black" strokeWidth="3"/>
    </svg>
  );
}

function IconStudents() {
  return (
    <svg viewBox="0 0 100.122 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect x="1.5" y="1.5" width="97" height="97" rx="14.5" stroke="black" strokeWidth="3"/>
      <path d="M99.0609 64.0004L98.5512 63.4906C93.3484 58.2878 92.691 50.247 94.5185 43.1197C98.1799 28.8395 94.4212 13.0496 83.2415 1.86986" stroke="black" strokeWidth="3"/>
      <path d="M96.25 90.5561L83.8683 78.1744C78.6655 72.9716 70.6246 72.3143 63.4973 74.1417C49.2171 77.8032 33.4272 74.0444 22.2475 62.8647C5.40421 46.0214 5.40421 18.713 22.2475 1.86967" stroke="black" strokeWidth="3"/>
      <circle cx="49.75" cy="50" r="23.5" stroke="black" strokeWidth="3"/>
      <path d="M63.75 70.0017C57.6778 65.4407 53.75 58.179 53.75 49.9999C53.75 41.8208 57.6778 34.5591 63.75 29.998" stroke="black" strokeWidth="3"/>
      <path d="M35.75 29.9983C41.8222 34.5593 45.75 41.821 45.75 50.0001C45.75 58.1792 41.8222 65.4409 35.75 70.002" stroke="black" strokeWidth="3"/>
      <line x1="26.75" y1="49.5" x2="74.75" y2="49.5" stroke="black" strokeWidth="3"/>
    </svg>
  );
}

function IconSchools() {
  return (
    <svg viewBox="0 0 100.5 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect x="2" y="1.5" width="97" height="97" rx="14.5" stroke="black" strokeWidth="3"/>
      <path d="M50.5 18.5C60.7173 18.5 69 26.7827 69 37V98.5H32V37C32 26.7827 40.2827 18.5 50.5 18.5Z" stroke="black" strokeWidth="3"/>
      <path d="M100 17C89.2304 17 80.5 25.7304 80.5 36.5V100" stroke="black" strokeWidth="3"/>
      <path d="M2 17C12.2173 17 20.5 25.2827 20.5 35.5V100" stroke="black" strokeWidth="3"/>
    </svg>
  );
}

function IconTeachers() {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect x="1.5" y="1.5" width="97" height="97" rx="14.5" stroke="black" strokeWidth="3"/>
      <path d="M39.75 24.5C47.482 24.5 53.75 30.768 53.75 38.5V69.0752C53.75 69.8621 53.1121 70.5 52.3252 70.5C48.8051 70.5 45.7789 72.9963 45.1094 76.4521L42.8896 87.9102C42.5983 89.4138 41.2816 90.5 39.75 90.5C38.2184 90.5 36.9017 89.4138 36.6104 87.9102L34.3906 76.4521C33.7211 72.9963 30.6949 70.5 27.1748 70.5C26.3879 70.5 25.75 69.8621 25.75 69.0752V38.5C25.75 30.768 32.018 24.5 39.75 24.5Z" stroke="black" strokeWidth="3"/>
      <path d="M65.25 48.5C70.1377 48.5 74.2186 52.2271 74.6611 57.0947L76.5439 77.8027C76.578 78.1771 76.2832 78.5 75.9072 78.5C74.2477 78.5001 72.7987 79.6227 72.3838 81.2295L69.6494 91.8262C69.2521 93.3656 68.0785 94.585 66.5557 95.042C65.7041 95.2975 64.7959 95.2975 63.9443 95.042C62.4215 94.585 61.2479 93.3656 60.8506 91.8262L58.1162 81.2295C57.7013 79.6228 56.2523 78.5001 54.5928 78.5C54.2168 78.5 53.922 78.1771 53.9561 77.8027L55.8389 57.0947C56.2814 52.2271 60.3623 48.5 65.25 48.5Z" stroke="black" strokeWidth="3"/>
      <path d="M39.75 19.5C41.9591 19.5 43.75 17.7091 43.75 15.5C43.75 13.2909 41.9591 11.5 39.75 11.5C37.5409 11.5 35.75 13.2909 35.75 15.5C35.75 17.7091 37.5409 19.5 39.75 19.5Z" stroke="black" strokeWidth="3"/>
      <path d="M65.25 42.5C66.6307 42.5 67.75 41.3807 67.75 40V39C67.75 37.6193 66.6307 36.5 65.25 36.5C63.8693 36.5 62.75 37.6193 62.75 39V40C62.75 41.3807 63.8693 42.5 65.25 42.5Z" stroke="black" strokeWidth="3"/>
    </svg>
  );
}

function FigureIcon({ name }: { name: string }) {
  switch (name) {
    case "parents": return <IconParents />;
    case "students": return <IconStudents />;
    case "schools": return <IconSchools />;
    case "teachers": return <IconTeachers />;
    default: return null;
  }
}

function ImgPlaceholder({ label, ratio, className = "rounded-lg" }: { label: string; ratio: string; className?: string }) {
  return (
    <div
      className={`w-full bg-black/[0.06] border border-black/5 flex items-center justify-center ${className}`}
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
              <p className="text-sm md:text-[16px] lg:text-lg font-medium text-foreground">{m.value}</p>
            </div>
          ))}
        </div>
      );
    case "caption":
      return (
        <div key={i} id={block.id} className="scroll-mt-36">
          <Caption text={block.text} />
        </div>
      );
    case "statement":
      return (
        <p key={i} className="text-[17px] md:text-[22px] lg:text-[30px] leading-[1.3] text-foreground font-normal">
          {block.text}
        </p>
      );
    case "dark-slider":
      return <DarkSlider key={i} id={block.id} caption={block.caption} slides={block.slides} />;
    case "white-section":
      return (
        <div key={i} id={block.id} className="rounded-3xl bg-white px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-10">
          <div className="max-w-[912px] mx-auto flex flex-col gap-4">
            <Caption text={block.caption} />
            <p className="text-[17px] md:text-[22px] lg:text-[30px] leading-[1.3] text-foreground font-normal">{block.statement}</p>
          </div>
        </div>
      );
    case "light-section":
      return (
        <div key={i} id={block.id} className="scroll-mt-36 rounded-3xl bg-white overflow-hidden flex flex-col">
          <div className="px-4 md:px-6 lg:px-8 pt-6 md:pt-8 lg:pt-10 pb-6 md:pb-7 lg:pb-8">
            <div className="max-w-[912px] mx-auto flex flex-col gap-4">
              <Caption text={block.caption} />
              <p className="text-[17px] md:text-[22px] lg:text-[30px] leading-[1.3] text-foreground font-normal">{block.statement}</p>
            </div>
          </div>
          <div className="max-w-[1144px] mx-auto w-full px-4 md:px-6 lg:px-8 pb-4 md:pb-6 lg:pb-8">
            {block.img.src
              ? <img src={block.img.src} alt={block.img.label} className="w-full rounded-lg" />
              : <ImgPlaceholder label={block.img.label} ratio={block.img.ratio} />}
          </div>
        </div>
      );
    case "dark-section":
      return (
        <div key={i} className="rounded-3xl bg-accent-foreground overflow-hidden flex flex-col">
          <div className="px-4 md:px-6 lg:px-8 pt-8 md:pt-10 lg:pt-12 pb-6 md:pb-7 lg:pb-8">
            <div className="max-w-[912px] mx-auto flex flex-col gap-4">
              <p className="text-sm font-bold text-primary">{block.caption}</p>
              <p className="text-[17px] md:text-[22px] lg:text-[30px] leading-[1.3] text-secondary-foreground font-normal">{block.statement}</p>
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
    case "figures":
      return (
        <div key={i} className="bg-white rounded-3xl px-4 md:px-6 lg:px-8 pt-6 md:pt-9 lg:pt-12 pb-6 md:pb-7 lg:pb-8">
          <div className="max-w-[912px] mx-auto flex flex-col gap-5">
            <p className="text-sm font-bold text-muted-foreground">{block.caption}</p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {block.items.map((f) => (
                <div key={f.label} className="bg-primary rounded-2xl px-6 pt-6 md:pt-10 pb-6 flex flex-col gap-4">
                  <div className="w-[60px] h-[60px] md:w-[100px] md:h-[100px]">
                    <FigureIcon name={f.icon} />
                  </div>
                  <div className="text-[17px] md:text-[22px] lg:text-[30px] leading-[1.2] text-foreground font-normal">
                    <p>{f.value}</p>
                    <p>{f.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    case "proposal":
      return (
        <div key={i} id={block.id} className="scroll-mt-36 rounded-3xl bg-white px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-10">
          <div className="max-w-[912px] mx-auto flex flex-col gap-6">
            {block.sectionCaption && <Caption text={block.sectionCaption} />}
            <div className="rounded-2xl bg-primary px-4 md:px-7 lg:px-10 py-4 md:py-6 lg:py-8 flex flex-col gap-6 md:gap-8">
              {block.items.map((it) => (
                <div key={it.n} className="flex flex-col md:flex-row gap-1 md:gap-6">
                  <span className="text-[22px] md:text-[28px] lg:text-[36px] leading-none text-white font-normal tabular-nums shrink-0 md:w-12">
                    {it.n}
                  </span>
                  <p className="text-[17px] md:text-[22px] lg:text-[30px] leading-[1.3] text-foreground font-normal">{it.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    case "quotes":
      return (
        <div key={i} id={block.id} className="scroll-mt-36 rounded-3xl bg-primary px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-10 flex flex-col gap-6">
          <div className="max-w-[912px] mx-auto w-full flex flex-col gap-4">
            {block.sectionCaption && <Caption text={block.sectionCaption} />}
            {block.groups.map((g) => (
              <div key={g.caption} className="rounded-2xl bg-background-alt px-4 md:px-7 lg:px-10 py-4 md:py-6 lg:py-8 flex flex-col gap-6 md:gap-8">
                <p className="text-sm font-bold text-foreground text-center">{g.caption}</p>
                <div className="flex flex-col gap-6 md:gap-8">
                  {g.items.map((q, j) => (
                    <div key={j} className="flex flex-col gap-2 text-center max-w-[680px] mx-auto">
                      <p className="text-[17px] md:text-[22px] lg:text-[30px] leading-[1.3] text-foreground font-normal">{q.text}</p>
                      {q.author && <p className="text-xs md:text-sm text-foreground/45">{q.author}</p>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    case "bullets":
      return (
        <div key={i} id="summary" className="scroll-mt-36 flex flex-col gap-6">
          <p className="text-[17px] md:text-[22px] lg:text-[30px] leading-[1.3] text-foreground font-normal">{block.text}</p>
          <ul className="flex flex-col gap-3">
            {block.items.map((it, j) => (
              <li key={j} className="flex gap-3 text-[17px] md:text-[22px] lg:text-[30px] leading-[1.3] text-foreground font-normal">
                <span className="text-foreground/30">—</span>
                <span>{it}</span>
              </li>
            ))}
          </ul>
        </div>
      );
    case "bullets-card":
      return (
        <div key={i} id={block.id} className="scroll-mt-36 rounded-3xl bg-white px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-10">
          <div className="max-w-[912px] mx-auto flex flex-col gap-6">
            <Caption text={block.sectionCaption} />
            <div className="rounded-2xl bg-primary px-4 md:px-7 lg:px-10 py-4 md:py-6 lg:py-8 flex flex-col gap-6">
              <p className="text-[17px] md:text-[22px] lg:text-[30px] leading-[1.3] text-foreground font-normal">{block.text}</p>
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
    case "img":
      return null; // rendered separately (full width)
  }
}

export default async function EschoolV2Page({
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
        {/* Hero: eyebrow + title */}
        <div className="px-4 md:px-8 lg:px-12 pt-14 pb-4">
          <header className="max-w-[912px] mx-auto flex flex-col gap-2">
            <Caption text={c.eyebrow} />
            <h1 className="text-[22px] md:text-[28px] lg:text-[36px] font-bold text-foreground leading-[1.25]">{c.title}</h1>
          </header>
        </div>

        {/* Sticky steps */}
        <CaseStepsNav items={c.steps} />

        {/* Blocks */}
        <article className="pt-6 px-4 md:px-8 lg:px-12">
          <div className="flex flex-col gap-6 md:gap-8">
            {c.blocks.map((block, i) => {
              if (block.t === "img") return null;
              if (block.t === "dark-section" || block.t === "dark-slider" || block.t === "light-section" || block.t === "figures" || block.t === "white-section" || block.t === "quotes" || block.t === "proposal" || block.t === "bullets-card") {
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

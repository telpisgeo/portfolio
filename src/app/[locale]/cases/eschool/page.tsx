import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { translations, type Locale } from "@/lib/translations";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CaseSectionNav from "@/components/CaseSectionNav";

export function generateStaticParams() {
  return [{ locale: "uk" }, { locale: "en" }];
}

type Block =
  | { t: "h2"; text: string; id?: string }
  | { t: "h3"; text: string }
  | { t: "p"; text: string }
  | { t: "lead"; bold: string; text: string }
  | { t: "num"; n: string; bold: string; text: string }
  | { t: "ul"; items: string[] }
  | { t: "ol"; items: string[] }
  | { t: "cards"; items: { icon: IconName; title: string; text: string }[] }
  | { t: "figures"; caption: string; items: { value: string; label: string }[] }
  | { t: "media"; kind: "video" | "image" | "grid"; label: string; count?: number; id?: string };

type IconName = "chat" | "bulb" | "search";

type NavItem = { label: string; href: string };

type CaseContent = {
  back: string;
  site: string;
  siteUrl: string;
  title: string;
  subtitle: string;
  seoTitle?: string;
  seoDescription?: string;
  nav?: NavItem[];
  meta: { label: string; value: string }[];
  blocks: Block[];
};

const content: Record<Locale, CaseContent> = {
  uk: {
    back: "← На головну",
    site: "Відкрити сайт ↗",
    siteUrl: "https://sitev2.eschool-ua.com",
    title:
      "Створили додатковий платний сервіс — рекомендації навчання на основі успішності учня",
    subtitle:
      "AI-аналітика та рекомендації навчання дитини як платна підписка для 930 тис. батьків.",
    seoTitle:
      "Єдина школа: AI-аналітика успішності учня — кейс продуктового дизайну | Тельпіс Георгій",
    seoDescription:
      "Як я спроектував першу платну підписку для освітньої платформи Єдина школа (930 тис. батьків): AI-звіти про успішність, порівняльну аналітику, опитування дитини та інструмент шаблонів тем уроків для вчителів.",
    nav: [
      { label: "Контекст", href: "#context" },
      { label: "Дослідження", href: "#research" },
      { label: "Рішення", href: "#premium" },
      { label: "Підсумки", href: "#results" },
    ],
    meta: [
      { label: "Роль", value: "Product Designer (solo)" },
      { label: "Команда", value: "Backend- та Flutter-розробники" },
      { label: "Таймлайн", value: "1 місяць, частковий графік" },
      { label: "Інструменти", value: "Figma, Claude Opus 4.8, Figma Console MCP" },
      { label: "Платформа", value: "iOS / Android" },
      { label: "Статус", value: "В розробці" },
    ],
    blocks: [
      { t: "media", kind: "video", label: "Відео / демо", id: "video" },

      { t: "h2", text: "Контекст", id: "context" },
      {
        t: "p",
        text: "Єдина школа — це безкоштовна платформа для державних закладів, але платна для приватних освітніх закладів. Вона включає веб-платформу для адміністрування школи та iOS/Android додатки для вчителів, батьків і учнів. Зараз команда активно розробляє додаткові платні сервіси, робить партнерські інтеграції з бізнесом і підключає нові школи до платформи.",
      },
      {
        t: "figures",
        caption: "Платформою користуються",
        items: [
          { value: "930 тис.", label: "батьків" },
          { value: "1,2 млн", label: "учнів" },
          { value: "3,5 тис.", label: "шкіл" },
          { value: "89 тис.", label: "викладачів" },
        ],
      },

      { t: "h2", text: "Дослідження", id: "research" },
      {
        t: "cards",
        items: [
          {
            icon: "chat",
            title: "Інсайти з інтерв'ю",
            text: "Вчителі частково або взагалі не заповнюють електронні журнали з оцінками — немає даних, немає користі для батьків.",
          },
          {
            icon: "bulb",
            title: "Гіпотеза",
            text: "Дати батькам глибшу аналітику про навчання дитини на основі оцінок, відвідувань та виконання домашніх завдань.",
          },
          {
            icon: "search",
            title: "Конкурентний аналіз",
            text: "Рекомендації на основі AI зафіксовано лише в подібному сервісі «Нові Знання», але там обмежились анонсом у додатку, і фіча досі в розробці.",
          },
        ],
      },

      { t: "h2", text: "Урок з попереднього релізу" },
      {
        t: "p",
        text: "До цього проєкту в додатку вже існував платний сервіс — «Поговорімо». Він генерував персоналізовані теми для розмови батьків із дитиною на основі відвідуваності, оцінок, домашніх завдань та активності на уроках. Щодня формував 3 унікальні теми. Батьки купували підписку, бачили нерелевантний контент і відписувались.",
      },
      {
        t: "lead",
        bold: "Причина:",
        text: " вчителі не заповнювали теми уроків у системі. AI не мав даних і генерував загальні рекомендації, не пов'язані з реальним навчанням дитини.",
      },
      {
        t: "p",
        text: "Нова фіча мала ті самі ризики — і я вирішив почати з усунення першопричини.",
      },
      { t: "media", kind: "image", label: "Старий «Поговорімо» — промо після відписки" },

      { t: "h2", text: "Що включає платна підписка", id: "premium" },
      {
        t: "num",
        n: "01",
        bold: "AI-звіт про успішність.",
        text: " Середній бал за тиждень, кількість пропущених уроків, частка пропусків без поважної причини, сильні та слабкі предмети. Текст формує AI на основі реальних даних з журналу.",
      },
      {
        t: "num",
        n: "02",
        bold: "Порівняльна аналітика за 4 тижні.",
        text: " Динаміка змін порівняно з попереднім тижнем: оцінки, пропуски, проблемні предмети — з поясненням що змінилось і чому це важливо.",
      },
      {
        t: "num",
        n: "03",
        bold: "Навчальний досвід дитини.",
        text: " Двічі на тиждень дитина проходить коротке опитування у своєму додатку. Батьки бачать звіт і графік змін. Результати — тільки для батьків, вчителі їх не бачать.",
      },
      {
        t: "num",
        n: "04",
        bold: "Теми для розмови.",
        text: " Персоналізовані підказки на основі тем уроків поточного тижня. Працює лише якщо вчитель заповнив теми.",
      },
      {
        t: "num",
        n: "05",
        bold: "Рекомендації репетиторів.",
        text: " На основі слабких предметів, з урахуванням Gallup-підходу: підтримати сильне, а не лише виправляти слабке.",
      },
      {
        t: "lead",
        bold: "Free preview.",
        text: " Батьки бачать структуру і частину контенту ще до оплати — розуміють, за що платять.",
      },
      { t: "media", kind: "grid", label: "Premium screen · Free / Paywall screen", count: 2 },

      { t: "h2", text: "Вирішення проблеми з даними" },
      {
        t: "p",
        text: "Перша версія «Поговорімо» впала через те, що вчителі не заповнювали теми уроків. Без цих даних AI не може генерувати нічого релевантного.",
      },
      {
        t: "p",
        text: "Вчителі не заповнюють теми, бо це рутинна ручна робота. При цьому в компанії вже була база — вчителі надсилали свої найкращі теми уроків під час попереднього конкурсу.",
      },
      {
        t: "p",
        text: "Я спроектував інструмент шаблонів для веб-версії платформи: вчитель обирає клас, предмет, семестр — отримує готовий список тем і адаптує під себе. Це знизило поріг входу для заповнення журналу. Без цього вся AI-аналітика для батьків знову б генерувала нісенітницю.",
      },
      { t: "media", kind: "image", label: "Веб-журнал із шаблонами тем уроків" },

      { t: "h2", text: "Моя роль" },
      {
        t: "p",
        text: "Я долучився, коли розробка вже почалась: отримав бриф від backend-розробника, який зробив першу версію алгоритмів рекомендацій, далі — повний цикл самостійно.",
      },
      {
        t: "ul",
        items: [
          "Проаналізував провал «Поговорімо», знайшов першопричину в даних",
          "Провів консультації з колегами — екс-директорами шкіл — щодо поведінки вчителів",
          "Спроектував premium-аналітику: free preview і повний доступ",
          "Протестував дизайн з батьками",
          "Брав участь в ітерації алгоритмів — перші звіти були надто загальними, переписували логіку разом з backend-розробником",
          "Запропонував Gallup-підхід до рекомендацій",
          "Спроектував механізм feedback на кожен блок окремо",
          "Спроектував опитування для дитини двічі на тиждень",
          "Спроектував інструмент шаблонів тем уроків для вчителів",
        ],
      },

      { t: "h2", text: "Ключові рішення", id: "decisions" },
      { t: "h3", text: "Feedback на кожен блок, а не загальна оцінка" },
      {
        t: "p",
        text: "Без зворотного зв'язку команда не знає, які блоки корисні. Я додав можливість повідомити про проблему в кожному розділі окремо: аналіз успішності, рекомендації, порівняльна аналітика, навчальний досвід, пропуски, теми для розмов. Кожен блок має свій набір варіантів — «рекомендації надто загальні», «не підходять для моєї дитини», «дані відрізняються від реальності».",
      },
      { t: "media", kind: "image", label: "Feedback-модалка" },
      { t: "h3", text: "Результати опитування — тільки батькам" },
      {
        t: "p",
        text: "Якщо дитина знає, що вчитель побачить її відповіді, вона не відповідатиме чесно. Я зафіксував це як принципову умову ще на етапі проектування опитування.",
      },
      { t: "h3", text: "Шаблони тем уроків як передумова всього іншого" },
      {
        t: "p",
        text: "Я міг проігнорувати проблему з даними і просто задизайнити нові екрани. Натомість запропонував вирішити її на рівні інструменту для вчителів — без цього запуск premium-аналітики повторив би помилку «Поговорімо».",
      },

      { t: "h2", text: "Опитування дитини" },
      { t: "p", text: "Двічі на тиждень дитина отримує 4 запитання у своєму додатку:" },
      {
        t: "ol",
        items: [
          "Як ти зазвичай почуваєшся після навчального дня? (emoji-шкала)",
          "Як часто ти розумів(-ла) тему без додаткових пояснень?",
          "Як часто ти отримував(-ла) емоційну підтримку на уроках від вчителів?",
          "Який урок, на твою думку, був найкориснішим? (вільний текст)",
        ],
      },
      { t: "p", text: "Результати бачать тільки батьки." },
      { t: "media", kind: "grid", label: "Опитування дитини — 4 екрани", count: 4 },

      { t: "h2", text: "Екрани" },
      {
        t: "media",
        kind: "grid",
        label: "Успішність · Деталі предмету · Premium · Paywall · Feedback · Опитування · Веб-журнал",
        count: 6,
      },

      { t: "h2", text: "Результати", id: "results" },
      { t: "p", text: "Фіча передана в розробку. Метрики — в очікуванні після тестів у новому навчальному році." },
      { t: "p", text: "Команда відстежуватиме:" },
      {
        t: "ul",
        items: [
          "Конверсію з free preview у підписку",
          "Відсоток батьків, які залишають feedback по блоках",
          "Retention після першого місяця",
        ],
      },

      { t: "h2", text: "Що б зробив інакше" },
      {
        t: "lead",
        bold: "Провів би інтерв'ю з батьками на старті.",
        text: " Гіпотезу про те, що батьки хочуть більше контексту про дитину, ніхто не перевіряв. Кілька розмов з реальними батьками могли б скоригувати пріоритети ще до першого макету.",
      },
      {
        t: "lead",
        bold: "Почав би з аудиту даних.",
        text: " Проблему з темами уроків я знайшов у процесі. Якби першим кроком був аудит того, що реально є в системі, я б одразу проектував під реальні умови.",
      },
    ],
  },
  en: {
    back: "← Home",
    site: "Open site ↗",
    siteUrl: "https://sitev2.eschool-ua.com",
    title:
      "Built a new paid service — study recommendations based on student performance",
    subtitle:
      "AI learning analytics as the first paid subscription for 930K parents",
    meta: [
      { label: "Role", value: "Product Designer (solo)" },
      { label: "Team", value: "Backend & Flutter engineers" },
      { label: "Timeline", value: "1 month, part-time" },
      { label: "Tools", value: "Figma" },
      { label: "Platform", value: "iOS / Android" },
      { label: "Status", value: "In development" },
    ],
    blocks: [
      { t: "media", kind: "video", label: "Video / demo" },

      { t: "h2", text: "Context" },
      {
        t: "p",
        text: "Yedyna Shkola is a free platform for public schools used by 930K parents, 1.2M students and 3.5K schools. It is paid for private institutions, holds a contract with Kyiv and is recommended by Ukraine's Ministry of Education.",
      },
      {
        t: "p",
        text: "Parents open the app with one goal — to check grades and see how their child is doing at school.",
      },

      { t: "h2", text: "Research" },
      {
        t: "lead",
        bold: "Interview insight:",
        text: " teachers fill in the digital gradebook partially or not at all — no data, no value for parents.",
      },
      {
        t: "lead",
        bold: "Hypothesis:",
        text: " give parents deeper analytics about their child's learning, based on grades, attendance and homework completion.",
      },
      {
        t: "lead",
        bold: "Competitive analysis:",
        text: " AI-based recommendations existed only in a similar service, “Novi Znannya”, but they shipped just an in-app announcement and the feature is still in development.",
      },

      { t: "h2", text: "Lesson from a previous failure" },
      {
        t: "p",
        text: "The app already had a paid service before — “Pohovorimo”. It generated personalized conversation topics for parents and children based on school lessons. Parents bought the subscription, saw irrelevant content and churned.",
      },
      {
        t: "lead",
        bold: "Root cause:",
        text: " teachers didn't fill in lesson topics in the system. The AI had no data and produced generic phrases unrelated to the child's actual studies.",
      },
      {
        t: "p",
        text: "The new feature carried the same risk — so I chose to start by removing the root cause.",
      },
      { t: "media", kind: "image", label: "Old “Pohovorimo” — post-churn promo" },

      { t: "h2", text: "What parents get in Premium" },
      {
        t: "num",
        n: "01",
        bold: "AI performance report.",
        text: " Weekly average grade, number of missed lessons, share of unexcused absences, strong and weak subjects. The text is generated by AI from real gradebook data.",
      },
      {
        t: "num",
        n: "02",
        bold: "4-week comparative analytics.",
        text: " Change over the previous week: grades, absences, problem subjects — with an explanation of what changed and why it matters.",
      },
      {
        t: "num",
        n: "03",
        bold: "Child's learning experience.",
        text: " Twice a week the child takes a short survey in their own app. Parents see a report and a trend chart. Results are for parents only — teachers don't see them.",
      },
      {
        t: "num",
        n: "04",
        bold: "Conversation topics.",
        text: " Personalized prompts based on this week's lesson topics. Works only if the teacher filled in the topics.",
      },
      {
        t: "num",
        n: "05",
        bold: "Tutor recommendations.",
        text: " Based on weak subjects, using a Gallup approach: reinforce strengths, not just fix weaknesses.",
      },
      {
        t: "lead",
        bold: "Free preview.",
        text: " Parents see the structure and part of the content before paying — they understand what they're paying for.",
      },
      { t: "media", kind: "grid", label: "Premium screen · Free / Paywall screen", count: 2 },

      { t: "h2", text: "Fixing the data problem" },
      {
        t: "p",
        text: "The first version of “Pohovorimo” failed because teachers didn't fill in lesson topics. Without that data the AI can't generate anything relevant.",
      },
      {
        t: "p",
        text: "Teachers don't fill in topics because it's routine manual work. Yet the company already had a base — teachers had submitted their best lesson topics during a previous contest.",
      },
      {
        t: "p",
        text: "I designed a templates tool for the web platform: the teacher picks a grade, subject and semester, gets a ready list of topics and adapts it. This lowered the barrier to filling in the gradebook. Without it, all the AI analytics for parents would generate nonsense again.",
      },
      { t: "media", kind: "image", label: "Web gradebook with lesson-topic templates" },

      { t: "h2", text: "My role" },
      {
        t: "p",
        text: "I joined when development had already started: I got a brief from the backend engineer who had built the first version of the recommendation algorithms, then ran the full cycle solo.",
      },
      {
        t: "ul",
        items: [
          "Analyzed the “Pohovorimo” failure, found the root cause in the data",
          "Consulted colleagues — former school principals — about teacher behavior",
          "Designed the premium analytics: free preview and full access",
          "Tested the design with parents",
          "Took part in algorithm iteration — the first reports were too generic, we rewrote the logic together with the backend engineer",
          "Proposed the Gallup approach to recommendations",
          "Designed a feedback mechanism for each block separately",
          "Designed a twice-a-week survey for the child",
          "Designed the lesson-topic templates tool for teachers",
        ],
      },

      { t: "h2", text: "Key decisions" },
      { t: "h3", text: "Feedback per block, not a single rating" },
      {
        t: "p",
        text: "Without feedback the team doesn't know which blocks are useful. I added a way to report an issue in each section separately: performance analysis, recommendations, comparative analytics, learning experience, absences, conversation topics. Each block has its own set of options — “recommendations too generic”, “don't fit my child”, “data differs from reality”.",
      },
      { t: "media", kind: "image", label: "Feedback modal" },
      { t: "h3", text: "Survey results — for parents only" },
      {
        t: "p",
        text: "If the child knows the teacher will see their answers, they won't answer honestly. I locked this in as a non-negotiable condition while designing the survey.",
      },
      { t: "h3", text: "Lesson-topic templates as a prerequisite for everything else" },
      {
        t: "p",
        text: "I could have ignored the data problem and just designed new screens. Instead I proposed solving it at the level of a tool for teachers — without it, launching premium analytics would repeat the “Pohovorimo” mistake.",
      },

      { t: "h2", text: "Child survey" },
      { t: "p", text: "Twice a week the child gets 4 questions in their own app:" },
      {
        t: "ol",
        items: [
          "How do you usually feel after a school day? (emoji scale)",
          "How often did you understand the topic without extra explanation?",
          "How often did you get emotional support from teachers in class?",
          "Which lesson do you think was the most useful? (free text)",
        ],
      },
      { t: "p", text: "Only parents see the results." },
      { t: "media", kind: "grid", label: "Child survey — 4 screens", count: 4 },

      { t: "h2", text: "Screens" },
      {
        t: "media",
        kind: "grid",
        label: "Performance · Subject details · Premium · Paywall · Feedback · Survey · Web gradebook",
        count: 6,
      },

      { t: "h2", text: "Results" },
      { t: "p", text: "The feature is handed off to development. Metrics — pending after launch." },
      { t: "p", text: "The team will track:" },
      {
        t: "ul",
        items: [
          "Conversion from free preview to subscription",
          "Share of parents who leave feedback on blocks",
          "Retention after the first month",
        ],
      },

      { t: "h2", text: "What I'd do differently" },
      {
        t: "lead",
        bold: "I'd interview parents at the start.",
        text: " Nobody validated the hypothesis that parents want more context about their child. A few conversations with real parents could have adjusted priorities before the first mockup.",
      },
      {
        t: "lead",
        bold: "I'd start with a data audit.",
        text: " I found the lesson-topics problem along the way. If the first step had been an audit of what's actually in the system, I'd have designed for real conditions from the start.",
      },
    ],
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
  const title = c.seoTitle ?? `${c.title} — ${locale === "uk" ? "Тельпіс Георгій" : "Georgiy Telpis"}`;
  return {
    title,
    description: c.seoDescription,
    openGraph: { title, description: c.seoDescription, type: "article" },
  };
}

function Icon({ name }: { name: IconName }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "chat":
      return (
        <svg {...common}>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      );
    case "bulb":
      return (
        <svg {...common}>
          <path d="M9 18h6M10 22h4" />
          <path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.1V18h6v-1.2c0-.8.4-1.6 1-2.1A7 7 0 0 0 12 2Z" />
        </svg>
      );
    case "search":
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      );
  }
}

function Cards({ items }: { items: Extract<Block, { t: "cards" }>["items"] }) {
  return (
    <div className="flex flex-col gap-4">
      {items.map((item, i) => (
        <div
          key={i}
          className="flex flex-col sm:flex-row gap-5 rounded-2xl bg-muted p-7"
        >
          <div className="w-12 h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0">
            <Icon name={item.icon} />
          </div>
          <div className="flex flex-col gap-1.5">
            <h3 className="text-lg font-medium text-foreground leading-snug">{item.title}</h3>
            <p className="text-[1.0625rem] text-foreground/85 leading-[1.7]">{item.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function Placeholder({ block }: { block: Extract<Block, { t: "media" }> }) {
  const box =
    "rounded-[10px] bg-muted border border-border flex items-center justify-center text-center";

  if (block.kind === "video") {
    return (
      <div className={`${box} aspect-video`}>
        <span className="text-sm text-muted-foreground px-4">{block.label}</span>
      </div>
    );
  }

  if (block.kind === "image") {
    return (
      <div className={`${box} aspect-[16/10]`}>
        <span className="text-sm text-muted-foreground px-4">{block.label}</span>
      </div>
    );
  }

  // grid of mobile screens
  const cols = block.count && block.count >= 4 ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-2";
  return (
    <div className="flex flex-col gap-3">
      <div className={`grid ${cols} gap-3`}>
        {Array.from({ length: block.count ?? 2 }).map((_, i) => (
          <div key={i} className={`${box} aspect-[9/19]`}>
            <span className="text-xs text-muted-foreground/70">{i + 1}</span>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground text-center">{block.label}</p>
    </div>
  );
}

function renderBlock(block: Block, i: number) {
  switch (block.t) {
    case "h2":
      return (
        <h2 key={i} id={block.id} className="text-2xl sm:text-3xl font-medium text-foreground leading-tight mt-6 scroll-mt-36">
          {block.text}
        </h2>
      );
    case "h3":
      return (
        <h3 key={i} className="text-lg font-medium text-foreground leading-snug mt-5 -mb-2.5">
          {block.text}
        </h3>
      );
    case "p":
      return (
        <p key={i} className="text-[1.0625rem] text-foreground/85 leading-[1.75]">
          {block.text}
        </p>
      );
    case "lead":
      return (
        <p key={i} className="text-[1.0625rem] text-foreground/85 leading-[1.75]">
          <strong className="text-foreground font-medium">{block.bold}</strong>
          {block.text}
        </p>
      );
    case "num":
      return (
        <div key={i} className="flex gap-4">
          <span className="text-xl font-medium text-foreground/30 tabular-nums shrink-0 w-8">
            {block.n}
          </span>
          <p className="text-[1.0625rem] text-foreground/85 leading-[1.75]">
            <strong className="text-foreground font-medium">{block.bold}</strong>
            {block.text}
          </p>
        </div>
      );
    case "ul":
      return (
        <ul key={i} className="flex flex-col gap-2">
          {block.items.map((item, j) => (
            <li key={j} className="text-[1.0625rem] text-foreground/85 leading-[1.75]">
              — {item}
            </li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol key={i} className="flex flex-col gap-2">
          {block.items.map((item, j) => (
            <li key={j} className="text-[1.0625rem] text-foreground/85 leading-[1.75] flex gap-3">
              <span className="text-foreground/30 tabular-nums shrink-0">{j + 1}.</span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      );
  }
}

export default async function EschoolCasePage({
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

  // First block is the hero media; the rest renders below the stats.
  const heroMedia = c.blocks[0]?.t === "media" ? c.blocks[0] : null;
  const restBlocks = heroMedia ? c.blocks.slice(1) : c.blocks;

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
        variant="light"
        hideOnScroll
      />

      <main className="flex-1">
        {/* Hero: title + description */}
        <div className="max-w-[1045px] mx-auto px-6 pt-14 pb-8">
          <header className="max-w-[760px] mx-auto">
            <h1 className="text-4xl sm:text-5xl font-medium text-foreground leading-[1.1] tracking-tight">
              {c.title}
            </h1>
            <p className="mt-5 text-xl text-foreground/70 leading-relaxed">{c.subtitle}</p>
          </header>
        </div>

        {/* Sticky section nav */}
        {c.nav && c.nav.length > 0 && <CaseSectionNav items={c.nav} />}

        <article className="max-w-[1045px] mx-auto px-6 pt-10 pb-14">
          {/* Hero media (first block) */}
          {heroMedia && (
            <div id={heroMedia.id} className="scroll-mt-36">
              <Placeholder block={heroMedia} />
            </div>
          )}

          {/* Short stats */}
          <dl className="max-w-[760px] mx-auto mt-12 grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-6">
            {c.meta.map((m) => (
              <div key={m.label}>
                <dt className="text-[11px] font-medium text-muted-foreground/60 uppercase tracking-widest mb-1">
                  {m.label}
                </dt>
                <dd className="text-sm text-foreground">{m.value}</dd>
              </div>
            ))}
          </dl>

          {/* Body */}
          <div className="mt-16 flex flex-col gap-5">
            {restBlocks.map((block, i) => {
              if (block.t === "media") {
                return (
                  <div key={i} id={block.id} className="my-6 scroll-mt-36">
                    <Placeholder block={block} />
                  </div>
                );
              }
              if (block.t === "cards") {
                return (
                  <div key={i} className="max-w-[760px] mx-auto w-full my-4">
                    <Cards items={block.items} />
                  </div>
                );
              }
              if (block.t === "figures") {
                return (
                  <div key={i} className="max-w-[760px] mx-auto w-full my-4">
                    <p className="text-[11px] font-medium text-muted-foreground/60 uppercase tracking-widest mb-4">
                      {block.caption}
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                      {block.items.map((f) => (
                        <div key={f.label} className="flex flex-col">
                          <span className="text-2xl sm:text-3xl font-medium text-foreground">{f.value}</span>
                          <span className="text-sm text-muted-foreground mt-0.5">{f.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
              return (
                <div key={i} className="max-w-[760px] mx-auto w-full">
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

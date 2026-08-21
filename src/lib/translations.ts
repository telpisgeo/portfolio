export type Locale = "uk" | "en";

export type SubCase = {
  name: string;
  slug: string;
};

export type CaseBlock =
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ul-bold"; items: Array<{ bold: string; rest: string }> }
  | { type: "image"; src: string; alt?: string };

export type Company = {
  name: string;
  url: string;
  caseUrl?: string;
  casePending?: boolean;
  period: string;
  productType?: string;
  role?: string;
  icon?: string;
  description: string;
  achievements?: readonly string[];
  tools?: string;
  images?: readonly string[];
  imageRows?: ReadonlyArray<string | readonly string[]>;
  subcases?: readonly SubCase[];
};

export type Metric = {
  value: string;
  label: string;
};

export type CaseSection = {
  heading: string;
  body: string;
  images?: readonly string[];
};

export type CaseStudy = {
  title: string;
  subtitle: string;
  backLabel: string;
  siteUrl: string;
  siteLabel: string;

  // Block-based content (when present, renders instead of structured fields)
  blocks?: readonly CaseBlock[];
  previewImage?: string;

  goalsTitle: string;
  goals: readonly string[];

  metricsTitle: string;
  metricsNote: string;
  metrics: readonly Metric[];

  contextTitle: string;
  context: readonly string[];

  problemTitle: string;
  problem: readonly string[];

  solutionsTitle: string;
  solutions: readonly CaseSection[];

  statusTitle: string;
  status: string;

  images: readonly string[];
};

export type Translation = {
  role: string;
  name: string;
  bio: string;
  emailButton: string;
  cvButton: string;
  cvUrl: string;
  experienceTitle: string;
  casesLabel: string;
  copyright: string;
  navWorksLabel: string;
  navAboutLabel: string;
  navContactLabel: string;
  companies: readonly Company[];
  cases: Record<string, CaseStudy>;
};

export const translations: Record<Locale, Translation> = {
  uk: {
    role: "Product Designer",
    name: "Привіт, я Георгій. Я дизайнер SaaS продуктів. Маю найбільший досвід в EdTech та MarTech продуктах, таких як Westudy, Snov.io та SendPulse.",
    bio: "",
    emailButton: "Написати email",
    cvButton: "Скачати CV",
    cvUrl: "/CV_Georgiy_Telpis_uiux_(product)_designer_ua.pdf",
    experienceTitle: "Досвід роботи",
    casesLabel: "Кейси",
    copyright: "© 2010–2026 Тельпіс Георгій",
    navWorksLabel: "Роботи",
    navAboutLabel: "Про себе",
    navContactLabel: "Зв'язатись",
    companies: [
      {
        name: "Snov.io",
        url: "http://snov.io/",
        caseUrl: "/uk/cases/snov",
        period: "2022 → 2025",
        productType: "AI платформа лідогенерації та автоматизації аутрічу",
        role: "Product Designer",
        icon: "/images/icons/snovio.svg",
        description:
          "Запустив з командою систему автоматизації LinkedIn аутрічу, оновив інструменти для доставлення емейлів та флоу створення емейл кампаній.",
        achievements: [
          "80% retention після релізу нового інструменту LinkedIn outreach",
          "На 30% більше успішно створених кампаній після редизайну їх створення",
          "Удвічі менше звернень до підтримки після редизайну email-налаштувань",
        ],
        tools: "Figma, HotJar, Amplitude",
        imageRows: ["/images/works/snov/snov-linkedin-settings.png", "/images/works/snov/snov-email-promo.png", ["/images/works/snov/snov-deliverability-check.webp", "/images/works/snov/snov-linkedin-analytics.webp"] as const, "/images/works/snov/snov-campaign-reports.webp"],
      },
      {
        name: "Єдина школа",
        url: "https://sitev2.eschool-ua.com",
        caseUrl: "/uk/cases/eschool-2",
        period: "2025 → 2026",
        productType: "Єдиний простір для вчителів, батьків та дітей",
        role: "Product Designer",
        icon: "/images/icons/eschool.svg",
        description:
          "Розробка навчальних сервісів для учнів, батьків та вчителів в додатку та веб-версії продукту, спец проєкти всередині платформи, оновив головний сайт платформи, та багато іншого.",
        tools: "Figma, Claude Code, Android Studio, VS Code, Google Analytics · React, WebGL, TailwindCSS, Flutter",
        images: ["/images/works/eschool/eschool-promo.png", "/images/works/eschool/eschool.webp"],
      },
      {
        name: "Westudy.ua",
        url: "http://westudy.ua/",
        period: "2024 → 2025",
        productType: "Платформа для створення онлайн курсів та роботи з студентами",
        role: "Product Designer",
        icon: "/images/icons/westudy.svg",
        description:
          "Оновив інтерфейс створення курсів, емейл кампаній, вебінарів та бронювання занять. Один з найскладніших інструментів — конструктор власних сайтів для курсів.",
        achievements: [
          "Зупинив відтік клієнтів після оновлення конструктора сайтів для курсів",
          "Налагодив дизайн-процеси в команді, впорядкував хаос і впровадив UX-дослідження",
          "Створив додаток для преміум-клієнтів, яким потрібна була кастомізація за додаткову плату",
        ],
        tools: "Figma, FigJam, Google Analytics, Affinity Designer",
        images: ["/images/works/westudy/westudy-editor.webp", "/images/works/westudy/westudy-onboarding.png"],
        caseUrl: "/uk/cases/westudy",
      },
    ],
    cases: {},
  },

  en: {
    role: "Product Designer",
    name: "Hi, I'm Georgiy. I design SaaS products. Most of my experience is in EdTech and MarTech products like Westudy, Snov.io and SendPulse.",
    bio: "",
    emailButton: "Send email",
    cvButton: "Download CV",
    cvUrl: "https://www.notion.so/360c4695d7af8194aa61d536582845a9",
    experienceTitle: "Work Experience",
    casesLabel: "Cases",
    copyright: "© 2010–2026 Georgiy Telpis",
    navWorksLabel: "Works",
    navAboutLabel: "About",
    navContactLabel: "Contact",
    companies: [
      {
        name: "Snov.io",
        url: "http://snov.io/",
        caseUrl: "/en/cases/snov",
        period: "2022 → 2025",
        productType: "AI-powered lead generation & outreach automation platform",
        role: "Product Designer",
        icon: "/images/icons/snovio.svg",
        description:
          "Launched LinkedIn outreach automation with the team, updated email deliverability tools and campaign creation flows.",
        achievements: [
          "80% retention after launching the new LinkedIn outreach tool",
          "30% more successfully created campaigns after redesigning campaign creation",
          "Half as many support requests after redesigning email settings",
        ],
        tools: "Figma, HotJar, Amplitude",
        imageRows: ["/images/works/snov/snov-linkedin-settings.png", "/images/works/snov/snov-email-promo.png", ["/images/works/snov/snov-deliverability-check.webp", "/images/works/snov/snov-linkedin-analytics.webp"] as const, "/images/works/snov/snov-campaign-reports.webp"],
      },
      {
        name: "Yedyna Shkola",
        url: "https://sitev2.eschool-ua.com",
        caseUrl: "/en/cases/eschool-2",
        period: "2025 → 2026",
        productType: "A unified space for teachers, parents and children",
        role: "Product Designer",
        icon: "/images/icons/eschool.svg",
        description:
          "Designed internal learning services for students, parents, and teachers across the app and web. Led special projects within the platform, updated the main website, and more.",
        tools: "Figma, Claude Code, Android Studio, VS Code, Google Analytics · React, WebGL, TailwindCSS, Flutter",
        images: ["/images/works/eschool/eschool-web-en.webp", "/images/works/eschool/eschool-mob-en.webp"],
      },
      {
        name: "Westudy.ua",
        url: "http://westudy.ua/",
        period: "2024 → 2025",
        productType: "Online course creation and student management platform",
        role: "Product Designer",
        icon: "/images/icons/westudy.svg",
        description:
          "Redesigned course creation, email campaigns, webinars, and class booking. The most complex part was the custom website builder for courses.",
        achievements: [
          "Reduced customer churn after relaunching the course website builder",
          "Set up design processes in the team, brought order to the chaos, and introduced UX research",
          "Built an add-on for premium clients who needed customization for an extra fee",
        ],
        tools: "Figma, FigJam, Google Analytics, Affinity Designer",
        images: ["/images/works/westudy/westudy-editor.webp", "/images/works/westudy/westudy-onboarding.png"],
        casePending: true,
      },
    ],
    cases: {},
  },
};

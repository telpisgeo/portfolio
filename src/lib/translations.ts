export type Locale = "uk" | "en";

export type Company = {
  name: string;
  url: string;
  period: string;
  description: string;
  images?: readonly string[];
};

export type Translation = {
  role: string;
  name: string;
  bio: string;
  emailButton: string;
  experienceTitle: string;
  copyright: string;
  companies: readonly Company[];
};

export const translations: Record<Locale, Translation> = {
  uk: {
    role: "Product Designer",
    name: "Тельпіс Георгій. Продуктовий дизайнер з досвідом роботи в доменах EdTech та MarTech які швидко зростають",
    bio: "",
    emailButton: "Написати email",
    experienceTitle: "Досвід роботи",
    copyright: "© 2010–2026 Тельпіс Георгій",
    companies: [
      {
        name: "Єдина школа",
        url: "https://eschool-ua.com/#/",
        period: "2025 → 2026",
        description: "Платформа для освітян, учнів, батьків та вчителів. Розробив внутрішні навчальні сервіси для учнів, оновив головний сайт проєкту, покращив реєстрацію та запис на заняття до репетиторів.",
        images: ["/images/works/eschool-promo.png", "/images/works/eschool.webp"],
      },
      {
        name: "Westudy.ua",
        url: "http://westudy.ua/",
        period: "2024 → 2025",
        description: "Платформа для створення курсів для освітян та бізнесу. Оновив інтерфейс створення курсів, email кампаній, вебінарів та бронювання занять. Зупинили відтік існуючих користувачів та залучили нових.",
        images: ["/images/works/westudy-editor.webp", "/images/works/westudy-onboarding.png"],
      },
      {
        name: "Snov.io",
        url: "http://snov.io/",
        period: "2022 → 2025",
        description: "Сервіс для лідогенерації та холодних листів. Запустив систему автоматизації LinkedIn аутрічу, оновив інструменти доставлення емейлів та флоу створення кампаній. Підвищили retention rate продукту.",
        images: ["/images/works/snov-linkedin-settings.png", "/images/works/snov-email.png"],
      },
      {
        name: "SendPulse",
        url: "https://sendpulse.ua/",
        period: "2021 → 2022",
        description: "Інструменти багатоканального маркетингу. Оновив інструмент створення email кампаній, перезапустив партнерську програму, оновив інструменти для створення курсів.",
        images: ["/images/works/sendpulse-2.webp", "/images/works/sendpulse.webp"],
      },
    ],
  },
  en: {
    role: "Product Designer",
    name: "Georgiy Telpis",
    bio: "Over the past few years, I've been working on products in EdTech (learning platforms, course creation services) and MarTech (marketing tools, lead generation services). I've built design processes from scratch within teams and implemented UX research into business workflows.",
    emailButton: "Send email",
    experienceTitle: "Work Experience",
    copyright: "© 2010–2026 Georgiy Telpis",
    companies: [
      {
        name: "Yedyna Shkola",
        url: "https://eschool-ua.com/#/",
        period: "2025 → 2026",
        description: "Platform for educators, students, parents, and teachers. Designed internal learning features for students, updated the main project website, improved registration and booking flow for tutors.",
      },
      {
        name: "Westudy.ua",
        url: "http://westudy.ua/",
        period: "2024 → 2025",
        description: "Course creation platform for educators and businesses. Redesigned the course builder, email campaigns, webinars, and class booking. Reduced churn among existing users and attracted new ones.",
      },
      {
        name: "Snov.io",
        url: "http://snov.io/",
        period: "2022 → 2025",
        description: "Lead generation and cold outreach service. Launched a LinkedIn outreach automation system, updated email deliverability tools and campaign creation flows. Improved the product's retention rate.",
      },
      {
        name: "SendPulse",
        url: "https://sendpulse.ua/",
        period: "2021 → 2022",
        description: "Multi-channel marketing tools. Updated the email campaign builder, relaunched the partner program, and updated course creation tools.",
      },
    ],
  },
};

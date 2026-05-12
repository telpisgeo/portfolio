export type Locale = "uk" | "en";

export const translations = {
  uk: {
    role: "Product Designer",
    name: "Георгій Тельпіс",
    bio: "Останні декілька років працював над продуктами в сфері EdTech (навчальні платформи, сервіси для створення курсів) та MarTech (маркетингові інструменти, сервіси лідогенерації). З нуля створював дизайн-процеси в командах та впроваджував нові UX-дослідження в бізнес процесах.",
    emailButton: "Написати email",
    experienceTitle: "Досвід роботи",
    copyright: "© 2010–2026 Тельпіс Георгій",
    companies: [
      {
        name: "Єдина школа",
        url: "https://eschool-ua.com/#/",
        period: "2025 → 2026",
        description: "Платформа для освітян, учнів, батьків та вчителів. Розробив внутрішні навчальні сервіси для учнів, оновив головний сайт проєкту, покращив реєстрацію та запис на заняття до репетиторів.",
      },
      {
        name: "Westudy.ua",
        url: "http://westudy.ua/",
        period: "2024 → 2025",
        description: "Платформа для створення курсів для освітян та бізнесу. Оновив інтерфейс створення курсів, email кампаній, вебінарів та бронювання занять. Зупинили відтік існуючих користувачів та залучили нових.",
      },
      {
        name: "Snov.io",
        url: "http://snov.io/",
        period: "2022 → 2025",
        description: "Сервіс для лідогенерації та холодних листів. Запустив систему автоматизації LinkedIn аутрічу, оновив інструменти доставлення емейлів та флоу створення кампаній. Підвищили retention rate продукту.",
      },
      {
        name: "SendPulse",
        url: "https://sendpulse.ua/",
        period: "2021 → 2022",
        description: "Інструменти багатоканального маркетингу. Оновив інструмент створення email кампаній, перезапустив партнерську програму, оновив інструменти для створення курсів.",
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
} as const;

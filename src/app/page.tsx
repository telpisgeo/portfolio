export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
      <div className="max-w-lg w-full">

        <p className="text-sm text-muted-foreground mb-8 tracking-widest uppercase">
          Product Designer
        </p>

        <h1 className="text-4xl font-medium text-foreground mb-6 leading-tight">
          Георгій Тельпіс
        </h1>

        <p className="text-muted-foreground text-lg leading-relaxed mb-10">
          Останні декілька років працював над продуктами в сфері EdTech
          (навчальні платформи, сервіси для створення курсів) та MarTech
          (маркетингові інструменти, сервіси лідогенерації). З нуля створював
          дизайн-процеси в командах та впроваджував нові UX-дослідження в
          бізнес процесах.
        </p>

        <div className="flex gap-6 items-center mb-16">
          <a
            href="mailto:gtelpis@gmail.com"
            className="text-foreground underline underline-offset-4 hover:text-muted-foreground transition-colors"
          >
            Email
          </a>
          <a
            href="https://www.linkedin.com/in/georgiy-telpis-229bbb47/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground underline underline-offset-4 hover:text-muted-foreground transition-colors"
          >
            LinkedIn
          </a>
          <a
            href="https://dribbble.com/gtelpis"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground underline underline-offset-4 hover:text-muted-foreground transition-colors"
          >
            Dribbble
          </a>
        </div>

        <div className="space-y-8">
          <p className="text-xs text-muted-foreground tracking-widest uppercase">Досвід роботи</p>

          <div className="space-y-6">

            <div>
              <div className="flex justify-between items-baseline mb-1">
                <a
                  href="https://eschool-ua.com/#/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground font-medium hover:text-muted-foreground transition-colors"
                >
                  Єдина школа
                </a>
                <span className="text-sm text-muted-foreground">2025 → 2026</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Платформа для освітян, учнів, батьків та вчителів. Розробив внутрішні
                навчальні сервіси для учнів, оновив головний сайт проєкту, покращив
                реєстрацію та запис на заняття до репетиторів.
              </p>
            </div>

            <div>
              <div className="flex justify-between items-baseline mb-1">
                <a
                  href="http://westudy.ua/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground font-medium hover:text-muted-foreground transition-colors"
                >
                  Westudy.ua
                </a>
                <span className="text-sm text-muted-foreground">2024 → 2025</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Платформа для створення курсів для освітян та бізнесу. Оновив інтерфейс
                створення курсів, email кампаній, вебінарів та бронювання занять.
                Зупинили відтік існуючих користувачів та залучили нових.
              </p>
            </div>

            <div>
              <div className="flex justify-between items-baseline mb-1">
                <a
                  href="http://snov.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground font-medium hover:text-muted-foreground transition-colors"
                >
                  Snov.io
                </a>
                <span className="text-sm text-muted-foreground">2022 → 2025</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Сервіс для лідогенерації та холодних листів. Запустив систему автоматизації
                LinkedIn аутрічу, оновив інструменти доставлення емейлів та флоу створення
                кампаній. Підвищили retention rate продукту.
              </p>
            </div>

            <div>
              <div className="flex justify-between items-baseline mb-1">
                <a
                  href="https://sendpulse.ua/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground font-medium hover:text-muted-foreground transition-colors"
                >
                  SendPulse
                </a>
                <span className="text-sm text-muted-foreground">2021 → 2022</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Інструменти багатоканального маркетингу. Оновив інструмент створення
                email кампаній, перезапустив партнерську програму, оновив інструменти
                для створення курсів.
              </p>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}

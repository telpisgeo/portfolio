export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16">
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

          <div className="flex gap-4 items-center mb-16">
            <a
              href="mailto:gtelpis@gmail.com"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-foreground text-background text-sm font-medium rounded-full hover:opacity-80 transition-opacity"
            >
              Написати email
            </a>

            <a
              href="https://www.linkedin.com/in/georgiy-telpis-229bbb47/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>

            <a
              href="https://dribbble.com/gtelpis"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Dribbble"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308a10.19 10.19 0 0 0 4.392-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.025-8.048 6.404a10.16 10.16 0 0 0 6.29 2.166c1.42 0 2.77-.29 4.01-.82zm-11.62-2.073c.232-.4 3.045-5.055 8.332-6.765.135-.045.27-.084.405-.12a28.5 28.5 0 0 0-.944-1.95 24.54 24.54 0 0 1-7.45 1.127c-.47 0-.93-.01-1.38-.04a10.2 10.2 0 0 0 1.037 7.748zM2.19 9.74c.46.03.927.04 1.4.04 2.44 0 4.72-.52 6.775-1.45C9.19 6.17 7.87 4.3 7.79 4.19A10.2 10.2 0 0 0 2.19 9.74zm7.305-7.1c.07.09 1.42 1.95 2.585 4.113 2.46-0.924 3.506-2.325 3.63-2.498A10.11 10.11 0 0 0 9.5 2.64zm7.842 3.14c-.14.19-1.31 1.703-3.87 2.77.16.33.315.667.455 1.01.05.12.1.24.145.36 3.37-.424 6.725.257 7.07.327a10.16 10.16 0 0 0-3.8-4.467z"/>
              </svg>
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

      <footer className="px-6 py-6 border-t border-border">
        <div className="max-w-lg mx-auto flex justify-between items-center">
          <p className="text-xs text-muted-foreground">
            © 2010–2026 Тельпіс Георгій
          </p>
          <p className="text-xs text-muted-foreground">
            V.2.0.1
          </p>
        </div>
      </footer>
    </div>
  );
}

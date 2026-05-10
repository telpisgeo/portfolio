export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="max-w-lg w-full">

        <p className="text-sm text-muted-foreground mb-8 tracking-widest uppercase">
          Product Designer
        </p>

        <h1 className="text-4xl font-medium text-foreground mb-6 leading-tight">
          Георгій Тельпіс
        </h1>

        <p className="text-muted-foreground text-lg leading-relaxed mb-10">
          Проєктую B2B SaaS продукти — від дослідження до готового інтерфейсу.
          Працював над лідогенерацією, email-маркетингом і CRM-інструментами
          для десятків тисяч користувачів.
          <br /><br />
          Сайт в процесі розробки.
        </p>

        <div className="flex gap-6 items-center">
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
        </div>

      </div>
    </main>
  );
}
# Георгій Тельпіс — портфоліо

Сайт-портфоліо Product Designer: [www.telpis.com.ua](https://www.telpis.com.ua)

Кейси з B2B SaaS, EdTech та MarTech, відгуки, резюме, граф навичок і адмінка для редагування контенту. Мови: UA та EN.

## Пет-проєкт

- **[Вголос](https://www.vgolos.fun)** — щоденна 15-хвилинна вправа з читання для дітей 6–12 років з дислексією, яку проводять батьки вдома. Figma, Claude Code, Supabase.

## Стек

- [Next.js](https://nextjs.org) 16 (App Router), React 19, TypeScript
- Tailwind CSS 4, shadcn/ui, Google Sans (`next/font`)
- Vercel (хостинг, Analytics, Speed Insights, Blob), Amplitude

## Запуск

```bash
npm install
npm run dev
```

Відкрити [http://localhost:3000](http://localhost:3000). Інші команди: `npm run build`, `npm run start`, `npm run lint`.

## Структура

- `src/app/[locale]/` — публічні сторінки (головна, `cases/*`, `odesa`)
- `src/app/admin/` — адмінка (кейси, головна, пет-проєкти, резюме, граф)
- `src/app/graph/` — граф навичок
- `src/components/` — компоненти, зокрема блоки кейсів (`CaseBlocks.tsx`)
- `src/lib/case-blocks.ts` — типи блоків кейсів
- `src/data/` — контент (`home.json`, `graph.json`, `cases/`)
- `public/images/works/` — зображення та відео кейсів

## Змінні середовища

| Змінна | Призначення |
| --- | --- |
| `ADMIN_PASSWORD` | пароль адмінки |
| `ADMIN_SESSION_SECRET` | підпис сесії адмінки |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob (завантаження медіа) |
| `GITHUB_TOKEN` | коміт у репозиторій з адмінки (оновлення резюме) |

Правила стилів і формат блоків кейсів — у [CLAUDE.md](CLAUDE.md).

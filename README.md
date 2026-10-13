# Georgii Telpis — Portfolio

Product Designer portfolio: [www.telpis.com.ua](https://www.telpis.com.ua)

Case studies in B2B SaaS, EdTech and MarTech, testimonials, résumé, a skills graph and an admin panel for editing content. Languages: UA and EN.

## Stack

- [Next.js](https://nextjs.org) 16 (App Router), React 19, TypeScript
- Tailwind CSS 4, shadcn/ui, Google Sans (`next/font`)
- Vercel (hosting, Analytics, Speed Insights, Blob), Amplitude

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Other commands: `npm run build`, `npm run start`, `npm run lint`.

## Project structure

- `src/app/[locale]/` — public pages (home, `cases/*`, `odesa`)
- `src/app/admin/` — admin panel (cases, home, pet projects, résumé, graph)
- `src/app/graph/` — skills graph
- `src/components/` — components, including case blocks (`CaseBlocks.tsx`)
- `src/lib/case-blocks.ts` — case block types
- `src/data/` — content (`home.json`, `graph.json`, `cases/`)
- `public/images/works/` — case images and videos

## Environment variables

| Variable | Purpose |
| --- | --- |
| `ADMIN_PASSWORD` | admin panel password |
| `ADMIN_SESSION_SECRET` | admin session signing |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob (media uploads) |
| `GITHUB_TOKEN` | commits to the repository from the admin panel (résumé update) |

Style rules and the case block format are described in [CLAUDE.md](CLAUDE.md).

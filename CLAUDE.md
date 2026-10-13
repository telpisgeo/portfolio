@AGENTS.md

# Site styles

Font: **Google Sans** only (self-hosted via `next/font` in `layout.tsx`, variable `--font-google-sans`). `--font-sans` and `--font-serif` both point to it. Colors live in `src/app/globals.css` as CSS variables. Light theme only (dark theme removed).

## Global tokens (globals.css)
- `--background` #FCF9DF (cream, used on the whole site; the homepage wrapper overrides it with `bg-white`) · `--background-alt` #FFFEF9 · `--foreground` #171311
- `--primary` #FBCF0B (yellow accent) · `--primary-foreground` #171311
- `--secondary` #461508 (brown) · `--secondary-foreground` #FEF9DB (cream)
- `--accent-foreground` #4A2C1A (brown for captions)
- `--muted` #EDE9DF · `--muted-foreground` #8D775E
- `--border` #D9CFC0

## Brand surfaces
- **Hero / Navbar (dark variant):** `bg-secondary` (#461508), text `text-secondary-foreground` (#FEF9DB)
- **About section (homepage):** `bg-surface-about` (#FDF8E7)
- **Footer:** `bg-footer-bg` (#141210), text `text-footer-text` (#F0EAD8); top "cap" `bg-surface-about` with `rounded-b-[40px]` (light curves into dark)

## Case pages (design synced from Figma)
- **Page background:** `--background` #FCF9DF (cream)
- **Eyebrow / section caption:** 14px **bold**, color `text-accent-foreground` (#4A2C1A, brown)
- **Title (hero):** 36px bold, `#171311`
- **Statement / body:** responsive 17 / 22 / 30px (base / md / lg) regular, `#171311`, line-height 1.3
- **Meta card** (Роль/Команда/…): `bg-background-alt` (#FFFEF9), `rounded-2xl`, padding 24px; label brown 14px bold, value 14 / 16 / 18px medium `#171311`
- **Steps chips** (`CaseStepsNav`): pill `rounded-full`, base white `#FFFEF9`, border `#171311`/10; active fills left→right with yellow `#FBCF0B` proportional to scroll progress. Sticky bar background `#FCF9DF` (opaque). Sticky stack: navbar hides on scroll down (`useHideOnScroll`), chips ride `top: 64↔0`.
- **Figures** (stat numbers): value 30px regular, label 16px `#171311`/55
- **Numbered list:** see `proposal` block (number white 36px on yellow card)
- **Image placeholders:** anything marked `img` in Figma → grey placeholder `bg-black/[0.06]`, `rounded-2xl`, aspect ratio from Figma (e.g. `1144/658`). Real images are added later by the user.
- Content text column `max-w-[760px]`, media/full blocks `max-w-[1045px]`, both centered.

## Case page block system

All case pages use a typed block system: the `Block` union lives in `src/lib/case-blocks.ts`, rendering in `src/components/CaseBlocks.tsx` (`renderCaseBlock`, `CaseBlockList`). Case content is stored as JSON in `src/data/cases/<slug>.json` (edited via `/admin/cases`); `eschool-2` has its own page, other cases render through `cases/[slug]`. Any block can have `active: false` to hide it. Layout rules:
- Page padding on sides: `px-4 md:px-8 lg:px-12`
- Text content: `max-w-[912px] mx-auto`
- Full-width blocks (all except plain `caption`/`statement`/`meta`/`bullets`): stretch to full width within the page padding, content inside constrained to `max-w-[912px] mx-auto`
- Block gap: `gap-6 md:gap-8` between all blocks. **No bottom padding after the last block** — the footer handles its own spacing. (`img` blocks are skipped entirely so they never contribute an empty gap.)

### Block types and input format

**`meta`** — Role card. White `#FFFEF9`, `rounded-2xl`, 4-column grid.
```
[meta]
Роль: Product Designer
Команда: Flutter розробник, Backend розробник
Таймінг: 1 місяць
Інструменти: Figma, Claude Code
```

**`dark-section`** — Text + image. Dark brown `bg-secondary` (#461508), `rounded-3xl`, `overflow-hidden`. Caption in yellow `#FFCD00`, statement in cream `#FEF9DB`. Image placeholder flush at bottom (no padding, `className=""`  — card clips the corners via overflow-hidden). `Image` and `Video` are mutually exclusive (video wins if both are set). `Carousel` is optional and independent of both — when present it renders an auto-cycling stack of browser-window mockups (`BrowserCarousel.tsx`) driven entirely by the given `sites` list (no hardcoded content).
```
[dark-section]
Caption: Про продукт
Text: Єдина школа це безкоштовна платформа...
Image: назва зображення (ширина/висота)
Video: назва відео (ширина/висота)          ← optional, replaces Image
Carousel:                                    ← optional
  site-one.com | назва скріншоту
  site-two.com | назва скріншоту
```

**`figures`** — Infographic. White bg, `rounded-3xl`. Caption above, then yellow `#FBCF0B` cards in a 4-col grid — each has a 100×100 icon, value (30px), label.
`icon` accepts either a named built-in icon (`parents`, `students`, `schools`, `teachers` — inline SVG) **or** a direct image path (e.g. `/images/works/snov/icon-1.svg`) for case-specific icon assets.
```
[figures]
Caption: Платформою користуються
930 тисяч | батьків | parents
1,2 млн. | учнів | students
3,5 тисяч | шкіл | schools
89 тисяч | викладачів | teachers
3 млн. | юзерів | /images/works/snov/icon-1.svg
```

**`dark-slider`** — Dark brown `bg-secondary` (#461508), `rounded-3xl`. Yellow caption at top (or per-slide `Caption`, which overrides the block-level one for that slide). Each slide has its own text (cream 30px) + image or video (max-w 1144px, video wins if both set). Dot navigation shown when >1 slide. Client component (`DarkSlider.tsx`).
```
[dark-slider]
Caption: Концепт. Рекомендації
---
Caption: Дослідження. Аналіз конкурентів     ← optional, overrides block Caption for this slide
Text: Рекомендації формуються на основі даних...
Image: Рекомендації — промо (1144/640)
---
Text: Текст другого слайду...
Video: назва відео (1144/640)                ← optional, replaces Image
```

**`light-section`** — Text + image or video, white bg. Same structure as `dark-section` but white `rounded-3xl` `overflow-hidden`, brown caption, dark `#171311` text. Image/video flush at bottom (no padding); video is lazy-loaded on scroll (`LazyVideo.tsx`).
```
[light-section]
Caption: Концепт. Шаблони
Text: Поки не вирішимо проблему з даними...
Image: назва зображення (1144/822)
Video: назва відео (1144/822)          ← optional, replaces Image
```

**`showcase`** — Animated scrolling website preview. Dark brown `bg-secondary` (#461508), `rounded-3xl`, same header layout as `dark-section` (yellow caption + cream statement). Below the text, a full-width carousel scrolls through each site's full page inside a browser-window frame (`SiteShowcase.tsx`) — distinct from `Carousel` on `dark-section`, which cycles between sites rather than scrolling through one long page.
```
[showcase]
Caption: Оновлена презентація робіт
Text: Сайти користувачів, які робили авторський дизайн...
Sites:
  site-one.com | назва скріншоту (повна сторінка)
  site-two.com | назва скріншоту
```

**`white-section`** — Text only. White bg, `rounded-3xl`. Caption (brown 14px bold) + statement (30px). Gap 16px.
```
[white-section]
Caption: Гіпотеза
Text: Зробити платну поглиблену аналітику...
```

**`proposal`** — Numbered proposal/concept list. White outer bg `rounded-3xl`, caption at top, inner yellow `#FBCF0B` card — numbers `text-white` 36px, text dark `#171311` 30px.
```
[proposal]
Caption: Що я запропонував
01 | Оновити інструмент створення тем уроків...
02 | Запропонував Gallup-підхід до рекомендацій...
```

**`bullets-card`** — Summary / bullet list. White outer bg `rounded-3xl`, caption at top, inner yellow `#FBCF0B` card — intro text (30px dark) + bullet items with a `•` marker.
```
[bullets-card]
Caption: Підсумки
Text: Новий сервіс повноцінно запуститься...
— Конверсія з free preview у підписку
— Відсоток батьків, які залишають feedback
— Retention після першого місяця
```

**`bullets`** — Same intro text + `—` bullet list, but without the white card (plain on the page background). Input: `text` + `items`.

**`caption`** / **`statement`** — Plain eyebrow caption / plain 30px paragraph, narrow column. **`img`** — image placeholder entry; skipped by `CaseBlockList`.

**`quotes`** — Research block. Yellow `#FBCF0B` bg, `rounded-3xl`. Section caption at top-left. Groups as white `#FFFEF9` inner cards, centered text, max-w 912px.
```
[quotes]
SectionCaption: Дослідження
---
Group: Інсайти від експертів з галузі освіти
— Заповнення електронних журналів...
— Через велике навантаження... | Марина Л.
---
Group: Інсайти від батьків
— Дай Боже, щоб дитина... | Ольга, 40 років
— Раз на два тижня... | Юля, 36 років
```
Quote format: `— Текст` or `— Текст | Автор`. The `—` is rendered automatically by the block — do NOT include it in the `text` field of quote items. Each `---` separates groups.

**`before-after`** — Before/after switcher. White bg `rounded-3xl`. Caption + statement text, then a centered pill toggle (active tab = yellow `#FBCF0B`), then one image (or video) that swaps on toggle. Default active tab is "After". Supports localized button labels via `beforeLabel`/`afterLabel` props (defaults: "До" / "Після"). Client component (`BeforeAfterBlock.tsx`).
```
[before-after]
Caption: Про кейс
Text: Нова концепція — дати можливість створити сайт за лічені хвилини...
Before: назва зображення до (1144/640)
After: назва відео після (1144/640)     ← Before/After each independently accept Image or Video
BeforeLabel: До        ← optional, default "До"
AfterLabel: Після      ← optional, default "Після"
```
For EN pages pass `beforeLabel: "Before"` and `afterLabel: "After"` in the block definition.

## Adding images to the site

When the user says "додай зображення [name]" or "add image [name]":
1. Find the file under `public/images/works/` (search by name, any extension)
2. Convert to WebP: `cwebp -q 85 input.png -o output.webp` (or `ffmpeg -i input.jpg output.webp`)
3. Place the `.webp` next to the original (same folder)
4. Set `src` in the relevant block's `imgSrc` / `videoSrc` field to the `/images/works/...` path

## Notes
- The old `cases/eschool` page was removed; `src/proxy.ts` 301-redirects `/uk|en/cases/eschool` to `eschool-2`.
- Case page body copy is currently **UA only**; EN is translated later.

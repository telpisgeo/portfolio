@AGENTS.md

# Site styles

Fonts: **Google Sans** (`--font-sans`) and **Google Sans Display** (`--font-serif`). Colors live in `src/app/globals.css` as CSS variables. Light theme only (dark theme removed).

## Global tokens (globals.css)
- `--background` #FFFFFF · `--foreground` #181311
- `--primary` #FFCD00 (yellow accent) · `--primary-foreground` #181311
- `--muted` #F2F2F2 · `--muted-foreground` #666666
- `--border` #E5E5E5

## Brand surfaces
- **Hero / Navbar (dark variant):** bg `#4F2A16` (brown), text `#FEF9DB` (cream)
- **About section (homepage):** bg `#FDF8E7`
- **Footer:** bg `#141210` (near-black), text `#F0EAD8`; top "cap" `#FDF8E7` with `rounded-b-[40px]` (light curves into dark)

## Case pages (new design — `cases/eschool-2`, synced from Figma)
- **Page background:** `#FCF9DF` (cream) — case pages only, not homepage
- **Eyebrow / section caption:** 14px **bold**, color `#4A2C1A` (brown)
- **Title (hero):** 36px bold, `#171311`
- **Statement / body:** 30px regular, `#171311`, line-height ~1.3
- **Meta card** (Роль/Команда/…): white card `#FFFEF9`, radius 16px (`rounded-2xl`), padding 24px; label brown `#4A2C1A` 14px bold, value 18px medium `#171311`
- **Steps chips** (`CaseStepsNav`): pill `rounded-full`, base white `#FFFEF9`, border `#171311`/10; active fills left→right with yellow `#FBCF0B` proportional to scroll progress. Sticky bar background `#FCF9DF` (opaque). Sticky stack: navbar hides on scroll down (`useHideOnScroll`), chips ride `top: 64↔0`.
- **Figures** (stat numbers): value 30px regular, label 16px `#171311`/55
- **Numbered list:** number 36px `#171311`/25, text 30px
- **Image placeholders:** anything marked `img` in Figma → grey placeholder `bg-black/[0.06]`, `rounded-2xl`, aspect ratio from Figma (e.g. `1144/658`). Real images are added later by the user.
- Content text column `max-w-[760px]`, media/full blocks `max-w-[1045px]`, both centered.

## Case page block system

All case pages use a typed block system (`Block` union in `page.tsx`). Layout rules:
- Page `px-8` padding on sides
- Text content: `max-w-[912px] mx-auto`
- Full-width blocks (all except plain `caption`/`statement`): stretch to full width within `px-8`, content inside constrained to `max-w-[912px] mx-auto`
- Block gap: `gap-8` (32px) between all blocks. **No bottom padding after the last block** — the footer handles its own spacing. (`img` blocks are skipped entirely so they never contribute an empty gap.)

### Block types and input format

**`meta`** — Role card. White `#FFFEF9`, `rounded-2xl`, 4-column grid.
```
[meta]
Роль: Product Designer
Команда: Flutter розробник, Backend розробник
Таймінг: 1 місяць
Інструменти: Figma, Claude Code
```

**`dark-section`** — Text + image. Dark brown `#4A2C1A` bg, `rounded-3xl`, `overflow-hidden`. Caption in yellow `#FFCD00`, statement in cream `#FEF9DB`. Image placeholder flush at bottom (no padding, `className=""`  — card clips the corners via overflow-hidden). `Image` and `Video` are mutually exclusive (video wins if both are set). `Carousel` is optional and independent of both — when present it renders an auto-cycling stack of browser-window mockups (`BrowserCarousel.tsx`) driven entirely by the given `sites` list (no hardcoded content).
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

**`dark-slider`** — Dark brown `#4A2C1A` bg, `rounded-3xl`. Yellow caption at top (or per-slide `Caption`, which overrides the block-level one for that slide). Each slide has its own text (cream 30px) + image or video (max-w 1144px, video wins if both set). Dot navigation shown when >1 slide. Client component (`DarkSlider.tsx`).
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

**`showcase`** — Animated scrolling website preview. Dark brown `#4A2C1A` bg, `rounded-3xl`, same header layout as `dark-section` (yellow caption + cream statement). Below the text, a full-width carousel scrolls through each site's full page inside a browser-window frame (`SiteShowcase.tsx`) — distinct from `Carousel` on `dark-section`, which cycles between sites rather than scrolling through one long page.
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

**`bullets-card`** — Summary / bullet list. White outer bg `rounded-3xl`, caption at top, inner yellow `#FBCF0B` card — intro text (30px dark) + bullet items with white `—` dash.
```
[bullets-card]
Caption: Підсумки
Text: Новий сервіс повноцінно запуститься...
— Конверсія з free preview у підписку
— Відсоток батьків, які залишають feedback
— Retention після першого місяця
```

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
- The **old** case page `cases/eschool` is the previous design — leave it as-is; new design work goes in `cases/eschool-2`.
- Case page body copy is currently **UA only**; EN is translated later.

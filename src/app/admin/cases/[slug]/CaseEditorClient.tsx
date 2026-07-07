"use client";

import { useState } from "react";
import Link from "next/link";
import type { Block, Step, CaseContent, ImgRef, ShowcaseSite } from "@/lib/case-blocks";
import type { CaseFile, CaseStatus } from "@/lib/case-store";
import MediaUpload from "@/components/admin/MediaUpload";

const inputClass = "w-full border border-border rounded-xl px-3 py-2 text-sm bg-background text-foreground outline-none focus:border-foreground";
const labelClass = "text-xs uppercase tracking-widest text-muted-foreground mb-1.5 block";

function Field({ label, value, onChange, mono }: { label: string; value: string; onChange: (v: string) => void; mono?: boolean }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} className={mono ? `${inputClass} font-mono` : inputClass} />
    </div>
  );
}

function TextAreaField({ label, value, onChange, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} className={`${inputClass} resize-none leading-relaxed`} />
    </div>
  );
}

function RemoveBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors shrink-0">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 6L6 18M6 6l12 12" />
      </svg>
    </button>
  );
}

function AddBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="text-sm text-muted-foreground hover:text-foreground transition-colors self-start">
      {label}
    </button>
  );
}

function ImgFields({ value, onChange, dir }: { value: ImgRef | undefined; onChange: (v: ImgRef) => void; dir: string }) {
  const v = value ?? { label: "", ratio: "1144/640", src: "" };
  return (
    <div className="grid grid-cols-2 gap-2">
      <Field label="Підпис зображення" value={v.label} onChange={(val) => onChange({ ...v, label: val })} />
      <Field label="Ratio (напр. 1144/640)" value={v.ratio} onChange={(val) => onChange({ ...v, ratio: val })} mono />
      <div className="col-span-2">
        <MediaUpload
          kind="image"
          dir={dir}
          value={v.src}
          onChange={(src, ratio) => onChange({ ...v, src: src || undefined, ratio: ratio ?? v.ratio })}
          label="Зображення"
        />
      </div>
      <div className="col-span-2">
        <MediaUpload
          kind="video"
          dir={dir}
          value={v.videoSrc}
          onChange={(videoSrc) => onChange({ ...v, videoSrc: videoSrc || undefined })}
          label="Або відео (замінює зображення)"
        />
      </div>
    </div>
  );
}

function SitesFields({ sites, onChange, dir }: { sites: ShowcaseSite[]; onChange: (sites: ShowcaseSite[]) => void; dir: string }) {
  return (
    <div className="flex flex-col gap-3">
      {sites.map((s, i) => (
        <div key={i} className="border border-border rounded-xl p-3 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">Сайт {i + 1}</span>
            <RemoveBtn onClick={() => onChange(sites.filter((_, j) => j !== i))} />
          </div>
          <Field label="URL (напр. example.com)" value={s.url} onChange={(v) => onChange(sites.map((x, j) => (j === i ? { ...x, url: v } : x)))} />
          <MediaUpload
            kind="image"
            dir={dir}
            value={s.src}
            onChange={(src) => onChange(sites.map((x, j) => (j === i ? { ...x, src: src || undefined } : x)))}
            label="Скріншот"
          />
        </div>
      ))}
      <AddBtn label="+ Додати сайт" onClick={() => onChange([...sites, { url: "" }])} />
    </div>
  );
}

const BLOCK_TYPES: { value: Block["t"]; label: string }[] = [
  { value: "meta", label: "Meta (роль/команда/...)" },
  { value: "dark-section", label: "Dark section" },
  { value: "light-section", label: "Light section" },
  { value: "figures", label: "Figures (інфографіка)" },
  { value: "dark-slider", label: "Dark slider" },
  { value: "white-section", label: "White section" },
  { value: "proposal", label: "Proposal" },
  { value: "bullets-card", label: "Bullets card" },
  { value: "quotes", label: "Quotes" },
  { value: "before-after", label: "Before/After" },
  { value: "showcase", label: "Showcase (анімований скрол сайтів)" },
  { value: "caption", label: "Caption" },
  { value: "statement", label: "Statement" },
  { value: "bullets", label: "Bullets (без картки)" },
  { value: "img", label: "Img placeholder" },
];

function blockLabel(t: Block["t"]): string {
  return BLOCK_TYPES.find((b) => b.value === t)?.label ?? t;
}

function emptyBlock(type: Block["t"]): Block {
  switch (type) {
    case "meta": return { t: "meta", items: [{ label: "", value: "" }] };
    case "caption": return { t: "caption", text: "" };
    case "statement": return { t: "statement", text: "" };
    case "dark-section": return { t: "dark-section", caption: "", statement: "", img: { label: "", ratio: "1144/658" } };
    case "dark-slider": return { t: "dark-slider", caption: "", slides: [{ text: "", imgLabel: "", imgRatio: "1144/640" }] };
    case "light-section": return { t: "light-section", caption: "", statement: "", img: { label: "", ratio: "1144/822" } };
    case "figures": return { t: "figures", caption: "", items: [{ value: "", label: "", icon: "parents" }] };
    case "img": return { t: "img", label: "", ratio: "1144/640" };
    case "proposal": return { t: "proposal", sectionCaption: "", items: [{ n: "01", text: "" }] };
    case "quotes": return { t: "quotes", sectionCaption: "", groups: [{ caption: "", items: [{ text: "" }] }] };
    case "white-section": return { t: "white-section", caption: "", statement: "" };
    case "bullets": return { t: "bullets", text: "", items: [""] };
    case "bullets-card": return { t: "bullets-card", sectionCaption: "", text: "", items: [""] };
    case "before-after": return { t: "before-after", caption: "", statement: "", before: { label: "", ratio: "1144/640" }, after: { label: "", ratio: "1144/640" } };
    case "showcase": return { t: "showcase", caption: "", statement: "", sites: [{ url: "" }] };
  }
}

function renderBlockFields(block: Block, onChange: (next: Block) => void, dir: string) {
  switch (block.t) {
    case "meta":
      return (
        <div className="flex flex-col gap-3">
          <Field label="ID (якір, необов'язково)" value={block.id ?? ""} onChange={(v) => onChange({ ...block, id: v || undefined })} mono />
          {block.items.map((it, i) => (
            <div key={i} className="flex gap-2 items-end">
              <div className="flex-1"><Field label="Лейбл" value={it.label} onChange={(v) => onChange({ ...block, items: block.items.map((x, j) => (j === i ? { ...x, label: v } : x)) })} /></div>
              <div className="flex-1"><Field label="Значення" value={it.value} onChange={(v) => onChange({ ...block, items: block.items.map((x, j) => (j === i ? { ...x, value: v } : x)) })} /></div>
              <RemoveBtn onClick={() => onChange({ ...block, items: block.items.filter((_, j) => j !== i) })} />
            </div>
          ))}
          <AddBtn label="+ Додати рядок" onClick={() => onChange({ ...block, items: [...block.items, { label: "", value: "" }] })} />
        </div>
      );
    case "caption":
      return <Field label="Текст" value={block.text} onChange={(v) => onChange({ ...block, text: v })} />;
    case "statement":
      return <TextAreaField label="Текст" value={block.text} onChange={(v) => onChange({ ...block, text: v })} />;
    case "dark-section":
      return (
        <div className="flex flex-col gap-3">
          <Field label="Caption" value={block.caption} onChange={(v) => onChange({ ...block, caption: v })} />
          <TextAreaField label="Statement" value={block.statement} onChange={(v) => onChange({ ...block, statement: v })} />
          <ImgFields value={block.img} onChange={(img) => onChange({ ...block, img })} dir={dir} />
          <div>
            <label className={labelClass}>Відео (необов&apos;язково, замінює зображення)</label>
            <MediaUpload
              kind="video"
              dir={dir}
              value={block.video?.src}
              onChange={(src) => onChange({ ...block, video: src ? { src, ratio: block.video?.ratio ?? block.img?.ratio ?? "1144/640" } : undefined })}
            />
          </div>
          <div className="border-t border-border pt-3">
            <label className={labelClass}>Карусель сайтів (необов&apos;язково, показується разом із зображенням/відео)</label>
            <SitesFields sites={block.carousel ?? []} onChange={(carousel) => onChange({ ...block, carousel: carousel.length > 0 ? carousel : undefined })} dir={dir} />
          </div>
        </div>
      );
    case "showcase":
      return (
        <div className="flex flex-col gap-3">
          <Field label="ID (якір, необов'язково)" value={block.id ?? ""} onChange={(v) => onChange({ ...block, id: v || undefined })} mono />
          <Field label="Caption" value={block.caption} onChange={(v) => onChange({ ...block, caption: v })} />
          <TextAreaField label="Statement" value={block.statement} onChange={(v) => onChange({ ...block, statement: v })} />
          <SitesFields sites={block.sites} onChange={(sites) => onChange({ ...block, sites })} dir={dir} />
        </div>
      );
    case "light-section":
      return (
        <div className="flex flex-col gap-3">
          <Field label="ID (якір, необов'язково)" value={block.id ?? ""} onChange={(v) => onChange({ ...block, id: v || undefined })} mono />
          <Field label="Caption" value={block.caption} onChange={(v) => onChange({ ...block, caption: v })} />
          <TextAreaField label="Statement" value={block.statement} onChange={(v) => onChange({ ...block, statement: v })} />
          <ImgFields value={block.img} onChange={(img) => onChange({ ...block, img })} dir={dir} />
        </div>
      );
    case "figures":
      return (
        <div className="flex flex-col gap-3">
          <Field label="Caption" value={block.caption} onChange={(v) => onChange({ ...block, caption: v })} />
          {block.items.map((it, i) => (
            <div key={i} className="grid grid-cols-4 gap-2 items-end">
              <Field label="Значення" value={it.value} onChange={(v) => onChange({ ...block, items: block.items.map((x, j) => (j === i ? { ...x, value: v } : x)) })} />
              <Field label="Лейбл" value={it.label} onChange={(v) => onChange({ ...block, items: block.items.map((x, j) => (j === i ? { ...x, label: v } : x)) })} />
              <div>
                <label className={labelClass}>Іконка</label>
                <select value={it.icon} onChange={(e) => onChange({ ...block, items: block.items.map((x, j) => (j === i ? { ...x, icon: e.target.value } : x)) })} className={inputClass}>
                  {["parents", "students", "schools", "teachers"].map((icon) => <option key={icon} value={icon}>{icon}</option>)}
                </select>
              </div>
              <RemoveBtn onClick={() => onChange({ ...block, items: block.items.filter((_, j) => j !== i) })} />
            </div>
          ))}
          <AddBtn label="+ Додати фігуру" onClick={() => onChange({ ...block, items: [...block.items, { value: "", label: "", icon: "parents" }] })} />
        </div>
      );
    case "img":
      return (
        <div className="grid grid-cols-2 gap-2">
          <Field label="Підпис" value={block.label} onChange={(v) => onChange({ ...block, label: v })} />
          <Field label="Ratio" value={block.ratio} onChange={(v) => onChange({ ...block, ratio: v })} mono />
        </div>
      );
    case "proposal":
      return (
        <div className="flex flex-col gap-3">
          <Field label="ID (якір, необов'язково)" value={block.id ?? ""} onChange={(v) => onChange({ ...block, id: v || undefined })} mono />
          <Field label="Заголовок секції (необов'язково)" value={block.sectionCaption ?? ""} onChange={(v) => onChange({ ...block, sectionCaption: v || undefined })} />
          {block.items.map((it, i) => (
            <div key={i} className="flex gap-2 items-end">
              <div className="w-16"><Field label="№" value={it.n} onChange={(v) => onChange({ ...block, items: block.items.map((x, j) => (j === i ? { ...x, n: v } : x)) })} /></div>
              <div className="flex-1"><Field label="Текст" value={it.text} onChange={(v) => onChange({ ...block, items: block.items.map((x, j) => (j === i ? { ...x, text: v } : x)) })} /></div>
              <RemoveBtn onClick={() => onChange({ ...block, items: block.items.filter((_, j) => j !== i) })} />
            </div>
          ))}
          <AddBtn label="+ Додати пункт" onClick={() => onChange({ ...block, items: [...block.items, { n: String(block.items.length + 1).padStart(2, "0"), text: "" }] })} />
        </div>
      );
    case "quotes":
      return (
        <div className="flex flex-col gap-4">
          <Field label="ID (якір, необов'язково)" value={block.id ?? ""} onChange={(v) => onChange({ ...block, id: v || undefined })} mono />
          <Field label="Заголовок секції (необов'язково)" value={block.sectionCaption ?? ""} onChange={(v) => onChange({ ...block, sectionCaption: v || undefined })} />
          {block.groups.map((g, gi) => (
            <div key={gi} className="border border-border rounded-xl p-3 flex flex-col gap-2">
              <div className="flex gap-2 items-end">
                <div className="flex-1"><Field label="Заголовок групи" value={g.caption} onChange={(v) => onChange({ ...block, groups: block.groups.map((x, j) => (j === gi ? { ...x, caption: v } : x)) })} /></div>
                <RemoveBtn onClick={() => onChange({ ...block, groups: block.groups.filter((_, j) => j !== gi) })} />
              </div>
              {g.items.map((q, qi) => (
                <div key={qi} className="flex gap-2 items-end pl-3 border-l border-border">
                  <div className="flex-1"><Field label="Цитата" value={q.text} onChange={(v) => onChange({ ...block, groups: block.groups.map((x, j) => (j === gi ? { ...x, items: x.items.map((y, k) => (k === qi ? { ...y, text: v } : y)) } : x)) })} /></div>
                  <div className="w-40"><Field label="Автор" value={q.author ?? ""} onChange={(v) => onChange({ ...block, groups: block.groups.map((x, j) => (j === gi ? { ...x, items: x.items.map((y, k) => (k === qi ? { ...y, author: v || undefined } : y)) } : x)) })} /></div>
                  <RemoveBtn onClick={() => onChange({ ...block, groups: block.groups.map((x, j) => (j === gi ? { ...x, items: x.items.filter((_, k) => k !== qi) } : x)) })} />
                </div>
              ))}
              <AddBtn label="+ Додати цитату" onClick={() => onChange({ ...block, groups: block.groups.map((x, j) => (j === gi ? { ...x, items: [...x.items, { text: "" }] } : x)) })} />
            </div>
          ))}
          <AddBtn label="+ Додати групу" onClick={() => onChange({ ...block, groups: [...block.groups, { caption: "", items: [{ text: "" }] }] })} />
        </div>
      );
    case "white-section":
      return (
        <div className="flex flex-col gap-3">
          <Field label="ID (якір, необов'язково)" value={block.id ?? ""} onChange={(v) => onChange({ ...block, id: v || undefined })} mono />
          <Field label="Caption" value={block.caption} onChange={(v) => onChange({ ...block, caption: v })} />
          <TextAreaField label="Statement" value={block.statement} onChange={(v) => onChange({ ...block, statement: v })} />
        </div>
      );
    case "bullets":
      return (
        <div className="flex flex-col gap-3">
          <TextAreaField label="Текст" value={block.text} onChange={(v) => onChange({ ...block, text: v })} />
          {block.items.map((it, i) => (
            <div key={i} className="flex gap-2 items-end">
              <div className="flex-1"><Field label={`Пункт ${i + 1}`} value={it} onChange={(v) => onChange({ ...block, items: block.items.map((x, j) => (j === i ? v : x)) })} /></div>
              <RemoveBtn onClick={() => onChange({ ...block, items: block.items.filter((_, j) => j !== i) })} />
            </div>
          ))}
          <AddBtn label="+ Додати пункт" onClick={() => onChange({ ...block, items: [...block.items, ""] })} />
        </div>
      );
    case "bullets-card":
      return (
        <div className="flex flex-col gap-3">
          <Field label="ID (якір, необов'язково)" value={block.id ?? ""} onChange={(v) => onChange({ ...block, id: v || undefined })} mono />
          <Field label="Заголовок секції" value={block.sectionCaption} onChange={(v) => onChange({ ...block, sectionCaption: v })} />
          <TextAreaField label="Текст" value={block.text} onChange={(v) => onChange({ ...block, text: v })} />
          {block.items.map((it, i) => (
            <div key={i} className="flex gap-2 items-end">
              <div className="flex-1"><Field label={`Пункт ${i + 1}`} value={it} onChange={(v) => onChange({ ...block, items: block.items.map((x, j) => (j === i ? v : x)) })} /></div>
              <RemoveBtn onClick={() => onChange({ ...block, items: block.items.filter((_, j) => j !== i) })} />
            </div>
          ))}
          <AddBtn label="+ Додати пункт" onClick={() => onChange({ ...block, items: [...block.items, ""] })} />
        </div>
      );
    case "before-after":
      return (
        <div className="flex flex-col gap-3">
          <Field label="ID (якір, необов'язково)" value={block.id ?? ""} onChange={(v) => onChange({ ...block, id: v || undefined })} mono />
          <Field label="Caption" value={block.caption} onChange={(v) => onChange({ ...block, caption: v })} />
          <TextAreaField label="Statement" value={block.statement} onChange={(v) => onChange({ ...block, statement: v })} />
          <div className="grid grid-cols-2 gap-2">
            <Field label="Підпис кнопки «До» (необов'язково)" value={block.beforeLabel ?? ""} onChange={(v) => onChange({ ...block, beforeLabel: v || undefined })} />
            <Field label="Підпис кнопки «Після» (необов'язково)" value={block.afterLabel ?? ""} onChange={(v) => onChange({ ...block, afterLabel: v || undefined })} />
          </div>
          <p className={labelClass}>До</p>
          <ImgFields value={block.before} onChange={(before) => onChange({ ...block, before })} dir={dir} />
          <p className={labelClass}>Після</p>
          <ImgFields value={block.after} onChange={(after) => onChange({ ...block, after })} dir={dir} />
        </div>
      );
    case "dark-slider":
      return (
        <div className="flex flex-col gap-3">
          <Field label="ID (якір, необов'язково)" value={block.id ?? ""} onChange={(v) => onChange({ ...block, id: v || undefined })} mono />
          <Field label="Caption" value={block.caption} onChange={(v) => onChange({ ...block, caption: v })} />
          {block.slides.map((s, i) => (
            <div key={i} className="border border-border rounded-xl p-3 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest text-muted-foreground">Слайд {i + 1}</span>
                <RemoveBtn onClick={() => onChange({ ...block, slides: block.slides.filter((_, j) => j !== i) })} />
              </div>
              <Field label="Підзаголовок слайду (необов'язково, замінює Caption)" value={s.caption ?? ""} onChange={(v) => onChange({ ...block, slides: block.slides.map((x, j) => (j === i ? { ...x, caption: v || undefined } : x)) })} />
              <TextAreaField label="Текст" value={s.text} onChange={(v) => onChange({ ...block, slides: block.slides.map((x, j) => (j === i ? { ...x, text: v } : x)) })} />
              <div className="grid grid-cols-2 gap-2">
                <Field label="Підпис зображення" value={s.imgLabel} onChange={(v) => onChange({ ...block, slides: block.slides.map((x, j) => (j === i ? { ...x, imgLabel: v } : x)) })} />
                <Field label="Ratio" value={s.imgRatio} onChange={(v) => onChange({ ...block, slides: block.slides.map((x, j) => (j === i ? { ...x, imgRatio: v } : x)) })} mono />
              </div>
              <MediaUpload
                kind="image"
                dir={dir}
                value={s.imgSrc}
                onChange={(src, ratio) => onChange({ ...block, slides: block.slides.map((x, j) => (j === i ? { ...x, imgSrc: src || undefined, imgRatio: ratio ?? x.imgRatio } : x)) })}
              />
              <MediaUpload
                kind="video"
                dir={dir}
                value={s.videoSrc}
                onChange={(videoSrc) => onChange({ ...block, slides: block.slides.map((x, j) => (j === i ? { ...x, videoSrc: videoSrc || undefined } : x)) })}
                label="Або відео (замінює зображення)"
              />
            </div>
          ))}
          <AddBtn label="+ Додати слайд" onClick={() => onChange({ ...block, slides: [...block.slides, { text: "", imgLabel: "", imgRatio: "1144/640" }] })} />
        </div>
      );
  }
}

export default function CaseEditorClient({ slug, initialCase }: { slug: string; initialCase: CaseFile }) {
  const [caseFile, setCaseFile] = useState<CaseFile>(initialCase);
  const [locale, setLocale] = useState<"uk" | "en">("uk");
  const [collapsed, setCollapsed] = useState<Set<number>>(new Set());
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "ok" | "error">("idle");
  const [saveError, setSaveError] = useState("");

  const content = caseFile[locale];
  const blocks = content.blocks;

  function updateContent(patch: Partial<CaseContent>) {
    setCaseFile((prev) => ({ ...prev, [locale]: { ...prev[locale], ...patch } }));
  }

  function updateBlocks(next: Block[]) {
    updateContent({ blocks: next });
  }

  function addBlock(type: Block["t"]) {
    updateBlocks([...blocks, emptyBlock(type)]);
  }

  function removeBlock(index: number) {
    if (!window.confirm("Видалити блок?")) return;
    updateBlocks(blocks.filter((_, i) => i !== index));
  }

  function moveBlock(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= blocks.length) return;
    const next = [...blocks];
    [next[index], next[target]] = [next[target], next[index]];
    updateBlocks(next);
  }

  function toggleCollapsed(index: number) {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  function updateStep(i: number, patch: Partial<Step>) {
    updateContent({ steps: content.steps.map((s, j) => (j === i ? { ...s, ...patch } : s)) });
  }

  function addStep() {
    updateContent({ steps: [...content.steps, { label: "", href: "" }] });
  }

  function removeStep(i: number) {
    updateContent({ steps: content.steps.filter((_, j) => j !== i) });
  }

  async function handleSave() {
    setSaving(true);
    setSaveStatus("idle");
    setSaveError("");
    try {
      const res = await fetch("/api/admin/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ files: { [`src/data/cases/${slug}.json`]: caseFile } }),
      });
      const data = await res.json();
      if (!res.ok) { setSaveStatus("error"); setSaveError(data.error ?? "Помилка збереження"); }
      else setSaveStatus("ok");
    } catch {
      setSaveStatus("error");
      setSaveError("Мережева помилка");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-2">
          <Link href="/admin/cases" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Кейси
          </Link>
        </div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-medium text-foreground font-mono">{slug}</h1>
          <div className="flex items-center gap-3">
            <select
              value={caseFile.status ?? "published"}
              onChange={(e) => setCaseFile((prev) => ({ ...prev, status: e.target.value as CaseStatus }))}
              className="border border-border rounded-full px-4 py-1.5 text-sm bg-background"
            >
              <option value="draft">Чернетка</option>
              <option value="published">Опубліковано</option>
            </select>
            <div className="flex border border-border rounded-full overflow-hidden text-sm">
              <button onClick={() => setLocale("uk")} className={`px-4 py-1.5 transition-colors ${locale === "uk" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}>UA</button>
              <button onClick={() => setLocale("en")} className={`px-4 py-1.5 transition-colors ${locale === "en" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}>EN</button>
            </div>
            <button onClick={handleSave} disabled={saving} className="bg-foreground text-background rounded-full px-5 py-2 text-sm font-medium hover:opacity-80 transition-opacity disabled:opacity-40">
              {saving ? "Зберігаю..." : "Зберегти та задеплоїти"}
            </button>
          </div>
        </div>

        {caseFile.status !== "draft" && (
          <a href={`/${locale}/cases/${slug}`} target="_blank" rel="noopener noreferrer" className="inline-block mb-6 text-sm text-muted-foreground hover:text-foreground underline underline-offset-2">
            Переглянути на сайті →
          </a>
        )}

        {saveStatus === "ok" && (
          <div className="mb-6 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
            ✓ Збережено. Vercel розпочне деплой автоматично (~1 хв).
          </div>
        )}
        {saveStatus === "error" && (
          <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            Помилка: {saveError}
          </div>
        )}

        {/* Header fields */}
        <div className="border border-border rounded-2xl p-6 mb-6 flex flex-col gap-3">
          <Field label="Eyebrow" value={content.eyebrow} onChange={(v) => updateContent({ eyebrow: v })} />
          <TextAreaField label="Заголовок" value={content.title} onChange={(v) => updateContent({ title: v })} rows={2} />
        </div>

        {/* Steps nav */}
        <div className="border border-border rounded-2xl p-6 mb-6">
          <h2 className="text-base font-medium text-foreground mb-4">Кроки навігації</h2>
          <div className="flex flex-col gap-2">
            {content.steps.map((s, i) => (
              <div key={i} className="flex gap-2 items-end">
                <div className="flex-1"><Field label="Лейбл" value={s.label} onChange={(v) => updateStep(i, { label: v })} /></div>
                <div className="flex-1"><Field label="Якір (href)" value={s.href} onChange={(v) => updateStep(i, { href: v })} mono /></div>
                <RemoveBtn onClick={() => removeStep(i)} />
              </div>
            ))}
            <AddBtn label="+ Додати крок" onClick={addStep} />
          </div>
        </div>

        {/* Blocks */}
        <div className="flex flex-col gap-4 mb-6">
          {blocks.map((block, i) => {
            const isCollapsed = collapsed.has(i);
            return (
              <div key={i} className="border border-border rounded-2xl p-5">
                <div className="flex items-center justify-between mb-1">
                  <button onClick={() => toggleCollapsed(i)} className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <span className={`transition-transform ${isCollapsed ? "" : "rotate-90"}`}>▸</span>
                    {i + 1}. {blockLabel(block.t)}
                  </button>
                  <div className="flex items-center gap-1">
                    <button onClick={() => moveBlock(i, -1)} disabled={i === 0} className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors disabled:opacity-30">↑</button>
                    <button onClick={() => moveBlock(i, 1)} disabled={i === blocks.length - 1} className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors disabled:opacity-30">↓</button>
                    <RemoveBtn onClick={() => removeBlock(i)} />
                  </div>
                </div>
                {!isCollapsed && (
                  <div className="mt-4">
                    {renderBlockFields(block, (next) => updateBlocks(blocks.map((b, j) => (j === i ? next : b))), slug)}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Add block */}
        <div className="border border-dashed border-border rounded-2xl p-5">
          <label className={labelClass}>Додати блок</label>
          <select
            value=""
            onChange={(e) => {
              if (e.target.value) addBlock(e.target.value as Block["t"]);
              e.target.value = "";
            }}
            className={inputClass}
          >
            <option value="" disabled>Оберіть тип блоку...</option>
            {BLOCK_TYPES.map((bt) => <option key={bt.value} value={bt.value}>{bt.label}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}

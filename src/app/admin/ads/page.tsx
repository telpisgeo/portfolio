"use client";

import { useState } from "react";
import Link from "next/link";
import adsJson from "@/data/ads.json";
import type { AdsContent, AdsProject } from "@/lib/ads-content";
import type { HomeImageRow } from "@/lib/home-content";
import MediaUpload from "@/components/admin/MediaUpload";

const initialContent = adsJson as unknown as AdsContent;

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

// Drops image-row slots that were added but never filled — an empty path
// fails server-side validation and would block saving the whole form.
function cleanImageRows(rows: HomeImageRow[]): HomeImageRow[] {
  return rows
    .map((row) => {
      if (!Array.isArray(row.value)) return row;
      const keep = row.value.map((v, i) => ({ v, p: row.posters?.[i] ?? "" })).filter((x) => x.v.trim() !== "");
      return { ...row, value: keep.map((x) => x.v), posters: keep.map((x) => x.p) };
    })
    .filter((row) => (Array.isArray(row.value) ? row.value.length > 0 : row.value.trim() !== ""))
    .map((row) => (Array.isArray(row.value) && row.value.length === 1 ? { ...row, value: row.value[0], posters: row.posters?.slice(0, 1) } : row))
    .map(({ posters, ...row }) => (posters && posters.some((p) => p) ? { ...row, posters } : row));
}

function cleanContent(content: AdsContent): AdsContent {
  const clean = (l: AdsContent["uk"]) => ({ ...l, projects: l.projects.map((p) => ({ ...p, imageRows: cleanImageRows(p.imageRows) })) });
  return { uk: clean(content.uk), en: clean(content.en) };
}

export default function AdminAdsPage() {
  const [content, setContent] = useState<AdsContent>(initialContent);
  const [locale, setLocale] = useState<"uk" | "en">("uk");
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "ok" | "error">("idle");
  const [saveError, setSaveError] = useState("");

  const loc = content[locale];
  const projects = loc.projects;

  function updateLocale(patch: Partial<AdsContent["uk"]>) {
    setContent((prev) => ({ ...prev, [locale]: { ...prev[locale], ...patch } }));
  }

  function updateProject(index: number, patch: Partial<AdsProject>) {
    updateLocale({ projects: projects.map((p, i) => (i === index ? { ...p, ...patch } : p)) });
  }

  function addProject() {
    const input = window.prompt("Slug нового проєкту (латиницею, напр. westudy-ads):")?.trim();
    if (!input) return;
    const slug = slugify(input);
    if (!slug) {
      window.alert("Slug має містити хоча б одну латинську літеру або цифру");
      return;
    }
    if (content.uk.projects.some((p) => p.slug === slug) || content.en.projects.some((p) => p.slug === slug)) {
      window.alert("Такий slug уже є");
      return;
    }
    // Same slug in both locales so media folders and the UA/EN pair stay aligned.
    const blank: AdsProject = { slug, name: "", description: "", imageRows: [] };
    setContent((prev) => ({
      uk: { ...prev.uk, projects: [...prev.uk.projects, { ...blank }] },
      en: { ...prev.en, projects: [...prev.en.projects, { ...blank }] },
    }));
  }

  function removeProject(index: number) {
    if (!window.confirm("Видалити проєкт (в обох мовах)?")) return;
    const slug = projects[index].slug;
    setContent((prev) => ({
      uk: { ...prev.uk, projects: prev.uk.projects.filter((p) => p.slug !== slug) },
      en: { ...prev.en, projects: prev.en.projects.filter((p) => p.slug !== slug) },
    }));
  }

  function updateImageRows(index: number, rows: HomeImageRow[]) {
    updateProject(index, { imageRows: rows });
  }

  function addImageRow(index: number, pair = false) {
    updateImageRows(index, [...projects[index].imageRows, { value: pair ? ["", ""] : "" }]);
  }

  function removeImageRow(index: number, rowIdx: number) {
    updateImageRows(index, projects[index].imageRows.filter((_, i) => i !== rowIdx));
  }

  // `poster` is replaced together with the media so a stale poster never lingers.
  function updateImageRowValue(index: number, rowIdx: number, colIdx: number, value: string, poster?: string) {
    const rows = projects[index].imageRows.map((row, i) => {
      if (i !== rowIdx) return row;
      const count = Array.isArray(row.value) ? row.value.length : 1;
      const posters = Array.from({ length: count }, (_, k) => row.posters?.[k] ?? "");
      posters[colIdx] = poster ?? "";
      if (Array.isArray(row.value)) {
        const updated = [...row.value];
        updated[colIdx] = value;
        return { ...row, value: updated, posters };
      }
      return { ...row, value, posters };
    });
    updateImageRows(index, rows);
  }

  function toggleImagePair(index: number, rowIdx: number) {
    updateImageRows(
      index,
      projects[index].imageRows.map((row, i) => {
        if (i !== rowIdx) return row;
        if (Array.isArray(row.value)) return { ...row, value: row.value[0] ?? "", posters: row.posters?.slice(0, 1) };
        return { ...row, value: [row.value, ""], posters: [row.posters?.[0] ?? "", ""] };
      }),
    );
  }

  function moveImageRow(index: number, rowIdx: number, dir: -1 | 1) {
    const rows = projects[index].imageRows;
    const target = rowIdx + dir;
    if (target < 0 || target >= rows.length) return;
    const next = [...rows];
    [next[rowIdx], next[target]] = [next[target], next[rowIdx]];
    updateImageRows(index, next);
  }

  function toggleImageRowLoop(index: number, rowIdx: number, loop: boolean) {
    updateImageRows(index, projects[index].imageRows.map((row, i) => (i === rowIdx ? { ...row, once: !loop } : row)));
  }

  function toggleImageRowActive(index: number, rowIdx: number) {
    updateImageRows(index, projects[index].imageRows.map((row, i) => (i === rowIdx ? { ...row, active: row.active === false } : row)));
  }

  async function handleSave() {
    setSaving(true);
    setSaveStatus("idle");
    setSaveError("");
    try {
      const res = await fetch("/api/admin/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ files: { "src/data/ads.json": cleanContent(content) } }),
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

  const inputClass = "w-full border border-border rounded-xl px-3 py-2 text-sm bg-background text-foreground outline-none focus:border-foreground";
  const labelClass = "text-xs uppercase tracking-widest text-muted-foreground mb-1.5 block";
  const iconBtn = "w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors shrink-0";

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-2">
          <Link href="/admin" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Адмін-панель
          </Link>
        </div>
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-2xl font-medium text-foreground">Рекламне портфоліо</h1>
          <div className="flex items-center gap-3">
            <div className="flex border border-border rounded-full overflow-hidden text-sm">
              <button onClick={() => setLocale("uk")} className={`px-4 py-1.5 transition-colors ${locale === "uk" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}>UA</button>
              <button onClick={() => setLocale("en")} className={`px-4 py-1.5 transition-colors ${locale === "en" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}>EN</button>
            </div>
            <button onClick={handleSave} disabled={saving} className="bg-foreground text-background rounded-full px-5 py-2 text-sm font-medium hover:opacity-80 transition-opacity disabled:opacity-40">
              {saving ? "Зберігаю..." : "Зберегти та задеплоїти"}
            </button>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-10">
          Окрема приватна сторінка для рекламних креативів:{" "}
          <a href={`/ads/${locale === "uk" ? "ua" : "en"}`} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground">
            /ads/{locale === "uk" ? "ua" : "en"}
          </a>
          . Не індексується, без посилань на основний сайт і соцмережі. Проєкт додається в обидві мови одразу, тексти й «Показувати на сторінці» редагуються окремо для UA та EN.
        </p>

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

        {/* Header block */}
        <div className="border border-border rounded-2xl p-6 mb-10 flex flex-col gap-4">
          <h2 className="text-base font-medium text-foreground">Заголовок сторінки</h2>
          <div>
            <label className={labelClass}>Заголовок</label>
            <input value={loc.title} onChange={(e) => updateLocale({ title: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Вступ</label>
            <textarea value={loc.intro} onChange={(e) => updateLocale({ intro: e.target.value })} rows={2} className={`${inputClass} resize-none leading-relaxed`} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Email для зв&apos;язку</label>
              <input value={loc.contactEmail} onChange={(e) => updateLocale({ contactEmail: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Текст посилання</label>
              <input value={loc.contactLabel} onChange={(e) => updateLocale({ contactLabel: e.target.value })} className={inputClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Заголовок розділу робіт (пусто — не показується)</label>
            <input value={loc.worksTitle} onChange={(e) => updateLocale({ worksTitle: e.target.value })} className={inputClass} />
          </div>
        </div>

        {/* Projects */}
        <div className="flex flex-col gap-10">
          {projects.map((project, index) => (
            <div key={project.slug} className="border border-border rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-medium text-foreground">
                  {project.name || "Новий проєкт"}
                  {project.hidden && <span className="ml-2 text-xs font-normal text-muted-foreground">(сховано на сторінці)</span>}
                </h2>
                <label className="ml-auto mr-4 flex items-center gap-2 text-sm text-foreground cursor-pointer select-none">
                  <input type="checkbox" checked={!project.hidden} onChange={(e) => updateProject(index, { hidden: e.target.checked ? undefined : true })} />
                  Показувати на сторінці
                </label>
                <button onClick={() => removeProject(index)} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Видалити</button>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="col-span-3 sm:col-span-1">
                  <label className={labelClass}>Назва</label>
                  <input value={project.name} onChange={(e) => updateProject(index, { name: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Тип роботи</label>
                  <input value={project.kind ?? ""} onChange={(e) => updateProject(index, { kind: e.target.value })} className={inputClass} placeholder="Meta ads, Motion…" />
                </div>
                <div>
                  <label className={labelClass}>Рік / період</label>
                  <input value={project.period ?? ""} onChange={(e) => updateProject(index, { period: e.target.value })} className={inputClass} />
                </div>
              </div>

              <div className="mb-4">
                <label className={labelClass}>Опис (задача, ідея, результат; без вигаданих цифр)</label>
                <textarea value={project.description} onChange={(e) => updateProject(index, { description: e.target.value })} rows={4} className={`${inputClass} resize-none leading-relaxed`} />
              </div>

              <div>
                <label className={labelClass}>Зображення і відео</label>
                <div className="flex flex-col gap-3">
                  {project.imageRows.map((row, rowIdx) => {
                    const isActive = row.active !== false;
                    const values = Array.isArray(row.value) ? row.value : [row.value];
                    return (
                      <div key={rowIdx} className={`border border-border rounded-xl p-3 flex flex-col gap-2 transition-opacity ${isActive ? "" : "opacity-50"}`}>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs uppercase tracking-widest text-muted-foreground">Зображення {rowIdx + 1}{!isActive && " (вимкнено)"}</span>
                          <div className="flex items-center gap-1">
                            <button onClick={() => moveImageRow(index, rowIdx, -1)} disabled={rowIdx === 0} className={`${iconBtn} disabled:opacity-30`}>↑</button>
                            <button onClick={() => moveImageRow(index, rowIdx, 1)} disabled={rowIdx === project.imageRows.length - 1} className={`${iconBtn} disabled:opacity-30`}>↓</button>
                            <button
                              onClick={() => toggleImagePair(index, rowIdx)}
                              title={Array.isArray(row.value) ? "Зробити одним рядком" : "Поставити поруч (2 в ряд)"}
                              className={`w-8 h-8 flex items-center justify-center rounded-lg border transition-colors shrink-0 ${Array.isArray(row.value) ? "border-foreground text-foreground bg-foreground/5" : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"}`}
                            >
                              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <rect x="1" y="3" width="6" height="10" rx="1.5" />
                                <rect x="9" y="3" width="6" height="10" rx="1.5" />
                              </svg>
                            </button>
                            <button onClick={() => toggleImageRowActive(index, rowIdx)} title={isActive ? "Вимкнути" : "Увімкнути"} className={`${iconBtn} ${isActive ? "" : "text-foreground bg-muted"}`}>
                              {isActive ? "●" : "○"}
                            </button>
                            <button onClick={() => removeImageRow(index, rowIdx)} className={iconBtn} title="Видалити">✕</button>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {values.map((val, colIdx) => (
                            <div key={colIdx} className="flex-1 min-w-0">
                              <MediaUpload
                                kind="media"
                                dir={`ads-${project.slug}`}
                                value={val}
                                onChange={(src, _ratio, poster) => updateImageRowValue(index, rowIdx, colIdx, src, poster)}
                              />
                            </div>
                          ))}
                        </div>
                        {values.some((v) => /\.(webm|mp4|mov)$/i.test(v)) && (
                          <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={!(row.once ?? values.some((v) => /-once\.(webm|mp4|mov)$/i.test(v)))}
                              onChange={(e) => toggleImageRowLoop(index, rowIdx, e.target.checked)}
                            />
                            Відео циклічне (знято — грає один раз і зупиняється)
                          </label>
                        )}
                      </div>
                    );
                  })}
                  <div className="flex gap-3 pt-1">
                    <button onClick={() => addImageRow(index)} className="text-sm text-muted-foreground hover:text-foreground transition-colors">+ Додати зображення</button>
                    <button onClick={() => addImageRow(index, true)} className="text-sm text-muted-foreground hover:text-foreground transition-colors">+ Додати пару поруч</button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button onClick={addProject} className="text-sm text-muted-foreground hover:text-foreground transition-colors self-start">
            + Додати проєкт
          </button>
        </div>
      </div>
    </div>
  );
}

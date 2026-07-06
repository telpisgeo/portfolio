"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import homeJson from "@/data/home.json";
import type { HomeCompany, HomeContent, TimelineItem } from "@/lib/home-content";
import MediaUpload from "@/components/admin/MediaUpload";

const initialContent = homeJson as unknown as HomeContent;

// Legacy case pages that predate the admin's case system — always linkable,
// not manageable from /admin/cases.
const LEGACY_CASE_OPTIONS: { value: string; label: string }[] = [
  { value: "snov", label: "Snov.io" },
  { value: "westudy", label: "Westudy" },
];

function caseSlugFromUrl(caseUrl: string | undefined): string {
  if (!caseUrl) return "";
  const match = caseUrl.match(/^\/(?:uk|en)\/cases\/([a-z0-9-]+)$/);
  return match ? match[1] : "";
}

export default function AdminHomePage() {
  const [content, setContent] = useState<HomeContent>(initialContent);
  const [locale, setLocale] = useState<"uk" | "en">("uk");
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "ok" | "error">("idle");
  const [saveError, setSaveError] = useState("");
  const [caseOptions, setCaseOptions] = useState(LEGACY_CASE_OPTIONS);

  useEffect(() => {
    fetch("/api/admin/cases")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data?.cases) return;
        type ApiCase = { slug: string; status: "draft" | "published"; ukTitle: string; enTitle: string };
        const published = (data.cases as ApiCase[]).filter((c) => c.status === "published");
        setCaseOptions([
          ...LEGACY_CASE_OPTIONS,
          ...published.map((c) => ({ value: c.slug, label: c.ukTitle || c.enTitle || c.slug })),
        ]);
      })
      .catch(() => {});
  }, []);

  const companies = content[locale].companies;
  const about = content[locale].about;
  const timeline = content[locale].timeline;

  function updateCompany(index: number, patch: Partial<HomeCompany>) {
    setContent((prev) => ({
      ...prev,
      [locale]: {
        ...prev[locale],
        companies: prev[locale].companies.map((c, i) => (i === index ? { ...c, ...patch } : c)),
      },
    }));
  }

  function addCompany() {
    const slug = window.prompt("Slug нової компанії (латиницею, напр. my-company):")?.trim();
    if (!slug) return;
    const newCompany: HomeCompany = { slug, name: "", url: "", period: "", description: "", imageRows: [] };
    setContent((prev) => ({
      ...prev,
      [locale]: { ...prev[locale], companies: [...prev[locale].companies, newCompany] },
    }));
  }

  function removeCompany(index: number) {
    if (!window.confirm("Видалити компанію?")) return;
    setContent((prev) => ({
      ...prev,
      [locale]: { ...prev[locale], companies: prev[locale].companies.filter((_, i) => i !== index) },
    }));
  }

  function updateAchievement(index: number, i: number, value: string) {
    const achievements = [...(companies[index].achievements ?? [])];
    achievements[i] = value;
    updateCompany(index, { achievements });
  }

  function addAchievement(index: number) {
    updateCompany(index, { achievements: [...(companies[index].achievements ?? []), ""] });
  }

  function removeAchievement(index: number, i: number) {
    updateCompany(index, { achievements: (companies[index].achievements ?? []).filter((_, j) => j !== i) });
  }

  function updateImageRows(index: number, rows: (string | string[])[]) {
    updateCompany(index, { imageRows: rows });
  }

  function addImageRow(index: number) {
    updateImageRows(index, [...companies[index].imageRows, ""]);
  }

  function addImagePairRow(index: number) {
    updateImageRows(index, [...companies[index].imageRows, ["", ""]]);
  }

  function removeImageRow(index: number, rowIdx: number) {
    updateImageRows(index, companies[index].imageRows.filter((_, i) => i !== rowIdx));
  }

  function updateImageRowValue(index: number, rowIdx: number, colIdx: number, value: string) {
    const rows = companies[index].imageRows.map((row, i) => {
      if (i !== rowIdx) return row;
      if (Array.isArray(row)) {
        const updated = [...row];
        updated[colIdx] = value;
        return updated;
      }
      return value;
    });
    updateImageRows(index, rows);
  }

  function toggleImagePair(index: number, rowIdx: number) {
    const rows = companies[index].imageRows.map((r, i) => {
      if (i !== rowIdx) return r;
      if (Array.isArray(r)) return r[0] ?? "";
      return [r, ""];
    });
    updateImageRows(index, rows);
  }

  function updateAbout(i: number, value: string) {
    setContent((prev) => ({
      ...prev,
      [locale]: { ...prev[locale], about: prev[locale].about.map((p, j) => (j === i ? value : p)) },
    }));
  }

  function addAbout() {
    setContent((prev) => ({ ...prev, [locale]: { ...prev[locale], about: [...prev[locale].about, ""] } }));
  }

  function removeAbout(i: number) {
    setContent((prev) => ({
      ...prev,
      [locale]: { ...prev[locale], about: prev[locale].about.filter((_, j) => j !== i) },
    }));
  }

  function updateTimelineItem(i: number, patch: Partial<TimelineItem>) {
    setContent((prev) => ({
      ...prev,
      [locale]: { ...prev[locale], timeline: prev[locale].timeline.map((t, j) => (j === i ? { ...t, ...patch } : t)) },
    }));
  }

  function addTimelineItem() {
    setContent((prev) => ({
      ...prev,
      [locale]: {
        ...prev[locale],
        timeline: [...prev[locale].timeline, { period: "", company: "", role: "", desc: "" }],
      },
    }));
  }

  function removeTimelineItem(i: number) {
    setContent((prev) => ({
      ...prev,
      [locale]: { ...prev[locale], timeline: prev[locale].timeline.filter((_, j) => j !== i) },
    }));
  }

  async function handleSave() {
    setSaving(true);
    setSaveStatus("idle");
    setSaveError("");
    try {
      const res = await fetch("/api/admin/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ files: { "src/data/home.json": content } }),
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

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-2">
          <Link href="/admin" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Адмін-панель
          </Link>
        </div>
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-2xl font-medium text-foreground">Головна сторінка</h1>
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

        {/* Companies */}
        <div className="flex flex-col gap-10 mb-16">
          {companies.map((company, index) => {
            const caseSlug = caseSlugFromUrl(company.caseUrl);
            return (
              <div key={index} className="border border-border rounded-2xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-base font-medium text-foreground">{company.name || "Нова компанія"}</h2>
                  <button onClick={() => removeCompany(index)} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Видалити
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className={labelClass}>Назва</label>
                    <input value={company.name} onChange={(e) => updateCompany(index, { name: e.target.value })} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Посилання на сайт</label>
                    <input value={company.url} onChange={(e) => updateCompany(index, { url: e.target.value })} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Тип продукту</label>
                    <input value={company.productType ?? ""} onChange={(e) => updateCompany(index, { productType: e.target.value })} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Роль</label>
                    <input value={company.role ?? ""} onChange={(e) => updateCompany(index, { role: e.target.value })} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Роки</label>
                    <input value={company.period} onChange={(e) => updateCompany(index, { period: e.target.value })} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Інструменти</label>
                    <input value={company.tools ?? ""} onChange={(e) => updateCompany(index, { tools: e.target.value })} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Іконка (шлях)</label>
                    <input value={company.icon ?? ""} onChange={(e) => updateCompany(index, { icon: e.target.value })} className={`${inputClass} font-mono`} placeholder="/images/icons/example.svg" />
                  </div>
                  <div>
                    <label className={labelClass}>Кейс</label>
                    <select
                      value={caseSlug}
                      onChange={(e) => {
                        const value = e.target.value;
                        updateCompany(index, {
                          caseUrl: value ? `/${locale}/cases/${value}` : undefined,
                          casePending: value ? false : company.casePending,
                        });
                      }}
                      className={inputClass}
                    >
                      <option value="">Немає / кейс готується</option>
                      {caseOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {!caseSlug && (
                  <label className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <input
                      type="checkbox"
                      checked={company.casePending ?? false}
                      onChange={(e) => updateCompany(index, { casePending: e.target.checked })}
                    />
                    Показувати &quot;кейс готується&quot;
                  </label>
                )}

                {/* Description */}
                <div className="mb-4">
                  <label className={labelClass}>Опис</label>
                  <textarea
                    value={company.description}
                    onChange={(e) => updateCompany(index, { description: e.target.value })}
                    rows={4}
                    className={`${inputClass} resize-none leading-relaxed`}
                  />
                </div>

                {/* Achievements */}
                <div className="mb-4">
                  <label className={labelClass}>Досягнення</label>
                  <div className="flex flex-col gap-2">
                    {(company.achievements ?? []).map((a, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input value={a} onChange={(e) => updateAchievement(index, i, e.target.value)} className={inputClass} />
                        <button onClick={() => removeAchievement(index, i)} className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors shrink-0">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6L6 18M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                    <button onClick={() => addAchievement(index)} className="text-sm text-muted-foreground hover:text-foreground transition-colors self-start">
                      + Додати досягнення
                    </button>
                  </div>
                </div>

                {/* Image rows */}
                <div>
                  <label className={labelClass}>Зображення</label>
                  <div className="flex flex-col gap-3">
                    {company.imageRows.map((row, rowIdx) => (
                      <div key={rowIdx} className="flex items-start gap-2">
                        <div className="flex-1 flex flex-col gap-2">
                          {Array.isArray(row) ? (
                            <div className="flex gap-2">
                              {row.map((val, colIdx) => (
                                <div key={colIdx} className="flex-1">
                                  <MediaUpload
                                    kind="image"
                                    dir={company.slug}
                                    value={val}
                                    onChange={(src) => updateImageRowValue(index, rowIdx, colIdx, src)}
                                  />
                                </div>
                              ))}
                            </div>
                          ) : (
                            <MediaUpload
                              kind="image"
                              dir={company.slug}
                              value={row}
                              onChange={(src) => updateImageRowValue(index, rowIdx, 0, src)}
                            />
                          )}
                        </div>
                        <button
                          onClick={() => toggleImagePair(index, rowIdx)}
                          title={Array.isArray(row) ? "Зробити одним рядком" : "Поставити поруч (2 в ряд)"}
                          className={`mt-0.5 w-8 h-8 flex items-center justify-center rounded-lg border transition-colors shrink-0 ${Array.isArray(row) ? "border-foreground text-foreground bg-foreground/5" : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"}`}
                        >
                          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect x="1" y="3" width="6" height="10" rx="1.5" />
                            <rect x="9" y="3" width="6" height="10" rx="1.5" />
                          </svg>
                        </button>
                        <button
                          onClick={() => removeImageRow(index, rowIdx)}
                          className="mt-0.5 w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors shrink-0"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6L6 18M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}

                    <div className="flex gap-3 pt-1">
                      <button onClick={() => addImageRow(index)} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        + Додати зображення
                      </button>
                      <button onClick={() => addImagePairRow(index)} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        + Додати пару поруч
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          <button onClick={addCompany} className="text-sm text-muted-foreground hover:text-foreground transition-colors self-start">
            + Додати компанію
          </button>
        </div>

        {/* About me */}
        <div className="border border-border rounded-2xl p-6 mb-10">
          <h2 className="text-base font-medium text-foreground mb-5">Про мене</h2>
          <div className="flex flex-col gap-3">
            {about.map((p, i) => (
              <div key={i} className="flex items-start gap-2">
                <textarea
                  value={p}
                  onChange={(e) => updateAbout(i, e.target.value)}
                  rows={2}
                  className={`${inputClass} resize-none leading-relaxed`}
                />
                <button onClick={() => removeAbout(i)} className="mt-0.5 w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
            <button onClick={addAbout} className="text-sm text-muted-foreground hover:text-foreground transition-colors self-start">
              + Додати абзац
            </button>
          </div>
        </div>

        {/* Timeline */}
        <div className="border border-border rounded-2xl p-6">
          <h2 className="text-base font-medium text-foreground mb-5">Досвід роботи</h2>
          <div className="flex flex-col gap-6">
            {timeline.map((item, i) => (
              <div key={i} className="border border-border rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs uppercase tracking-widest text-muted-foreground">Запис {i + 1}</span>
                  <button onClick={() => removeTimelineItem(i)} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Видалити
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className={labelClass}>Період</label>
                    <input value={item.period} onChange={(e) => updateTimelineItem(i, { period: e.target.value })} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Компанія</label>
                    <input value={item.company} onChange={(e) => updateTimelineItem(i, { company: e.target.value })} className={inputClass} />
                  </div>
                </div>
                <div className="mb-3">
                  <label className={labelClass}>Роль</label>
                  <input value={item.role} onChange={(e) => updateTimelineItem(i, { role: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Опис</label>
                  <textarea
                    value={item.desc}
                    onChange={(e) => updateTimelineItem(i, { desc: e.target.value })}
                    rows={3}
                    className={`${inputClass} resize-none leading-relaxed`}
                  />
                </div>
              </div>
            ))}
            <button onClick={addTimelineItem} className="text-sm text-muted-foreground hover:text-foreground transition-colors self-start">
              + Додати запис
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

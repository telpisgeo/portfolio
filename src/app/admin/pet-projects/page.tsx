"use client";

import { useState } from "react";
import Link from "next/link";
import homeJson from "@/data/home.json";
import type { HomeContent, PetProject } from "@/lib/home-content";
import MediaUpload from "@/components/admin/MediaUpload";

const initialContent = homeJson as unknown as HomeContent;

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export default function AdminPetProjectsPage() {
  const [content, setContent] = useState<HomeContent>(initialContent);
  const [locale, setLocale] = useState<"uk" | "en">("uk");
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "ok" | "error">("idle");
  const [saveError, setSaveError] = useState("");

  const petProjects = content[locale].petProjects ?? { title: "", items: [] };

  function setPetProjects(next: { title: string; items: PetProject[] }) {
    setContent((prev) => ({ ...prev, [locale]: { ...prev[locale], petProjects: next } }));
  }

  function updatePetProject(i: number, patch: Partial<PetProject>) {
    setPetProjects({ ...petProjects, items: petProjects.items.map((p, j) => (j === i ? { ...p, ...patch } : p)) });
  }

  function addPetProject() {
    const input = window.prompt("Slug нового проєкту (латиницею, напр. my-project):")?.trim();
    if (!input) return;
    const slug = slugify(input);
    if (!slug) {
      window.alert("Slug має містити хоча б одну латинську літеру або цифру");
      return;
    }
    setPetProjects({ ...petProjects, items: [...petProjects.items, { slug, name: "", description: "" }] });
  }

  function removePetProject(i: number) {
    if (!window.confirm("Видалити проєкт?")) return;
    setPetProjects({ ...petProjects, items: petProjects.items.filter((_, j) => j !== i) });
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
          <h1 className="text-2xl font-medium text-foreground">Pet-проєкт</h1>
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

        {/* Pet projects */}
        <div className="border border-border rounded-2xl p-6">
          <div className="mb-6">
            <label className={labelClass}>Заголовок розділу</label>
            <input value={petProjects.title} onChange={(e) => setPetProjects({ ...petProjects, title: e.target.value })} className={inputClass} />
          </div>
          <div className="flex flex-col gap-6">
            {petProjects.items.map((p, i) => (
              <div key={i} className="border border-border rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs uppercase tracking-widest text-muted-foreground">{p.name || `Проєкт ${i + 1}`}</span>
                  <button onClick={() => removePetProject(i)} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Видалити
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className={labelClass}>Назва</label>
                    <input value={p.name} onChange={(e) => updatePetProject(i, { name: e.target.value })} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Посилання (необов&apos;язково)</label>
                    <input value={p.url ?? ""} onChange={(e) => updatePetProject(i, { url: e.target.value })} className={`${inputClass} font-mono`} placeholder="https://..." />
                  </div>
                  <div>
                    <label className={labelClass}>Тип продукту</label>
                    <input value={p.productType ?? ""} onChange={(e) => updatePetProject(i, { productType: e.target.value })} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Іконка (шлях)</label>
                    <input value={p.icon ?? ""} onChange={(e) => updatePetProject(i, { icon: e.target.value })} className={`${inputClass} font-mono`} placeholder="/images/icons/example.svg" />
                  </div>
                  <div>
                    <label className={labelClass}>Роки</label>
                    <input value={p.period ?? ""} onChange={(e) => updatePetProject(i, { period: e.target.value })} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Роль</label>
                    <input value={p.role ?? ""} onChange={(e) => updatePetProject(i, { role: e.target.value })} className={inputClass} />
                  </div>
                  <div className="col-span-2">
                    <label className={labelClass}>Інструменти</label>
                    <input value={p.tools ?? ""} onChange={(e) => updatePetProject(i, { tools: e.target.value })} className={inputClass} />
                  </div>
                </div>
                <div className="mb-4">
                  <label className={labelClass}>Опис</label>
                  <textarea
                    value={p.description}
                    onChange={(e) => updatePetProject(i, { description: e.target.value })}
                    rows={6}
                    className={`${inputClass} resize-none leading-relaxed`}
                  />
                </div>
                <div className="mb-4">
                  <label className={labelClass}>Примітка під описом (необов&apos;язково)</label>
                  <input value={p.note ?? ""} onChange={(e) => updatePetProject(i, { note: e.target.value })} className={inputClass} placeholder="напр. Кейс у стані наповнення" />
                </div>
                <MediaUpload
                  kind="media"
                  dir={`pet-${p.slug}`}
                  value={p.image}
                  onChange={(src) => updatePetProject(i, { image: src })}
                  label="Зображення"
                />
              </div>
            ))}
            <button onClick={addPetProject} className="text-sm text-muted-foreground hover:text-foreground transition-colors self-start">
              + Додати проєкт
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

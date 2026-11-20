"use client";

import { useState } from "react";
import Link from "next/link";
import MediaUpload from "@/components/admin/MediaUpload";
import { FUN_CONTENT, isFunVideo, newFunId, type FunContent, type FunItem, type FunSlide } from "@/lib/fun-content";

const VIDEO_FALLBACK_RATIO = "16/9";

// Videos come back from MediaUpload without a ratio, so read it from the clip.
function measureVideoRatio(src: string): Promise<string> {
  return new Promise((resolve) => {
    const v = document.createElement("video");
    v.preload = "metadata";
    v.onloadedmetadata = () =>
      resolve(v.videoWidth && v.videoHeight ? `${v.videoWidth}/${v.videoHeight}` : VIDEO_FALLBACK_RATIO);
    v.onerror = () => resolve(VIDEO_FALLBACK_RATIO);
    v.src = src;
  });
}

export default function AdminFunPage() {
  const [content, setContent] = useState<FunContent>({ items: FUN_CONTENT.items.map((it) => (it.id ? it : { ...it, id: newFunId() })) });
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "ok" | "error">("idle");
  const [saveError, setSaveError] = useState("");

  const items = content.items;
  const setItems = (next: FunItem[]) => setContent({ items: next });

  async function toSlide(src: string, ratio?: string, poster?: string): Promise<FunSlide> {
    const finalRatio = ratio ?? (isFunVideo(src) ? await measureVideoRatio(src) : VIDEO_FALLBACK_RATIO);
    const slide: FunSlide = { src, ratio: finalRatio };
    if (poster) slide.poster = poster;
    return slide;
  }

  async function addVariant(id: string, src: string, ratio?: string, poster?: string) {
    if (!src) return;
    const slide = await toSlide(src, ratio, poster);
    setContent((prev) => ({ items: prev.items.map((it) => (it.id === id ? { ...it, more: [...(it.more ?? []), slide] } : it)) }));
  }

  function removeVariant(id: string, k: number) {
    setContent((prev) => ({ items: prev.items.map((it) => (it.id === id ? { ...it, more: (it.more ?? []).filter((_, j) => j !== k) } : it)) }));
  }

  async function addItem(src: string, ratio?: string, poster?: string) {
    if (!src) return;
    const item: FunItem = { id: newFunId(), ...(await toSlide(src, ratio, poster)) };
    // Newest first, like a feed.
    setContent((prev) => ({ items: [item, ...prev.items] }));
  }

  function updateItem(i: number, patch: Partial<FunItem>) {
    setItems(items.map((it, j) => (j === i ? { ...it, ...patch } : it)));
  }

  function removeItem(i: number) {
    if (!window.confirm("Прибрати з сторінки?")) return;
    setItems(items.filter((_, j) => j !== i));
  }

  function moveItem(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    setItems(next);
  }

  async function handleSave() {
    setSaving(true);
    setSaveStatus("idle");
    setSaveError("");
    try {
      const clean: FunContent = {
        items: items.map((it) => {
          const o: FunItem = { id: it.id, src: it.src, ratio: it.ratio };
          if (it.poster) o.poster = it.poster;
          if (it.more?.length) o.more = it.more.map((m) => (m.poster ? { src: m.src, ratio: m.ratio, poster: m.poster } : { src: m.src, ratio: m.ratio }));
          if (it.caption?.trim()) o.caption = it.caption.trim();
          if (it.description?.trim()) o.description = it.description.trim();
          return o;
        }),
      };
      const res = await fetch("/api/admin/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ files: { "src/data/fun.json": clean } }),
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

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-2">
          <Link href="/admin" className="text-sm text-muted-foreground hover:text-foreground transition-colors">← Адмін-панель</Link>
        </div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-medium text-foreground">Fun</h1>
          <button onClick={handleSave} disabled={saving} className="bg-foreground text-background rounded-full px-5 py-2 text-sm font-medium hover:opacity-80 transition-opacity disabled:opacity-40">
            {saving ? "Зберігаю..." : "Зберегти та задеплоїти"}
          </button>
        </div>
        <p className="text-sm text-muted-foreground mb-8">
          Стіна для сторінки <a href="/uk/fun" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground">/uk/fun</a>.
          Завантажуйте картинки або короткі відео по одній — нові додаються нагору. Один список для UA та EN.
        </p>

        {saveStatus === "ok" && (
          <div className="mb-6 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">✓ Збережено. Vercel розпочне деплой автоматично (~1 хв).</div>
        )}
        {saveStatus === "error" && (
          <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">Помилка: {saveError}</div>
        )}

        <div className="mb-8">
          <MediaUpload kind="media" dir="fun" value="" onChange={addItem} label="Додати" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {items.map((it, i) => (
            <div key={it.id} className="border border-border rounded-2xl p-3 flex flex-col gap-2">
              <div className="rounded-xl overflow-hidden bg-black/[0.06]" style={{ aspectRatio: it.ratio }}>
                {isFunVideo(it.src) ? (
                  <video src={it.src} poster={it.poster} className="w-full h-full object-cover" muted loop playsInline autoPlay />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={it.src} alt="" className="w-full h-full object-cover" />
                )}
              </div>
              <input
                className={inputClass}
                placeholder="Назва (необовʼязково)"
                value={it.caption ?? ""}
                onChange={(e) => updateItem(i, { caption: e.target.value })}
              />
              {!!it.more?.length && (
                <div className="flex flex-wrap gap-2">
                  {it.more.map((m, k) => (
                    <div key={`${m.src}-${k}`} className="relative w-12 h-12 rounded-lg overflow-hidden bg-black/[0.06]">
                      {isFunVideo(m.src) ? (
                        <video src={m.src} poster={m.poster} className="w-full h-full object-cover" muted playsInline />
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={m.src} alt="" className="w-full h-full object-cover" />
                      )}
                      <button type="button" onClick={() => removeVariant(it.id, k)} aria-label="Прибрати варіацію" className="absolute inset-0 bg-black/55 text-white text-sm opacity-0 hover:opacity-100 transition-opacity">×</button>
                    </div>
                  ))}
                </div>
              )}
              <MediaUpload kind="media" dir="fun" value="" onChange={(src, ratio, poster) => addVariant(it.id, src, ratio, poster)} label="+ Варіація" />
              <textarea
                className={`${inputClass} min-h-[72px] resize-y`}
                placeholder="Опис для сторінки роботи"
                value={it.description ?? ""}
                onChange={(e) => updateItem(i, { description: e.target.value })}
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex gap-3">
                  <button type="button" onClick={() => moveItem(i, -1)} disabled={i === 0} className="hover:text-foreground disabled:opacity-30">↑</button>
                  <button type="button" onClick={() => moveItem(i, 1)} disabled={i === items.length - 1} className="hover:text-foreground disabled:opacity-30">↓</button>
                </div>
                <button type="button" onClick={() => removeItem(i)} className="hover:text-red-600">Прибрати</button>
              </div>
            </div>
          ))}
        </div>
        {items.length === 0 && <p className="text-sm text-muted-foreground">Поки порожньо.</p>}
      </div>
    </div>
  );
}

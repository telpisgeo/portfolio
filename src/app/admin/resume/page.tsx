"use client";

import { useState } from "react";
import Link from "next/link";

const RESUMES = [
  { locale: "ua", label: "Резюме (UA)", href: "/Georgiy_Telpis_uxui_(product)_designer-ua.pdf" },
  { locale: "en", label: "Resume (EN)", href: "/Georgiy_Telpis_uxui_(product)_designer-en.pdf" },
] as const;

const MAX_BYTES = 3 * 1024 * 1024;

type Status = { state: "idle" | "uploading" | "ok" | "error"; message?: string };

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Не вдалося прочитати файл"));
    reader.readAsDataURL(file);
  });
}

export default function AdminResumePage() {
  const [statuses, setStatuses] = useState<Record<string, Status>>({});

  function setStatus(locale: string, status: Status) {
    setStatuses((prev) => ({ ...prev, [locale]: status }));
  }

  async function upload(locale: string, file: File) {
    if (file.type !== "application/pdf") return setStatus(locale, { state: "error", message: "Потрібен PDF-файл" });
    if (file.size > MAX_BYTES) return setStatus(locale, { state: "error", message: "Файл завеликий (макс. 3MB)" });
    setStatus(locale, { state: "uploading" });
    try {
      const data = await readAsDataUrl(file);
      const res = await fetch("/api/admin/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale, data }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? "Помилка завантаження");
      setStatus(locale, { state: "ok", message: "Збережено. Сайт оновиться після деплою (~1 хв)." });
    } catch (e) {
      setStatus(locale, { state: "error", message: e instanceof Error ? e.message : "Помилка завантаження" });
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-2xl font-medium text-foreground">Резюме</h1>
          <Link href="/admin" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Назад
          </Link>
        </div>

        <div className="flex flex-col gap-4">
          {RESUMES.map(({ locale, label, href }) => {
            const status = statuses[locale] ?? { state: "idle" };
            return (
              <div key={locale} className="border border-border rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-medium text-foreground">{label}</h2>
                  <a href={href} target="_blank" rel="noreferrer" className="text-sm text-muted-foreground hover:text-foreground underline">
                    Поточний файл
                  </a>
                </div>
                <input
                  type="file"
                  accept="application/pdf"
                  disabled={status.state === "uploading"}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) upload(locale, file);
                    e.target.value = "";
                  }}
                  className="text-sm"
                />
                {status.state === "uploading" && <p className="text-sm text-muted-foreground mt-3">Завантаження…</p>}
                {status.state === "ok" && <p className="text-sm text-green-700 mt-3">{status.message}</p>}
                {status.state === "error" && <p className="text-sm text-red-600 mt-3">{status.message}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export type CaseListItem = {
  slug: string;
  status: "draft" | "published";
  title: string;
  linkedFromHome: boolean;
};

export default function CasesListClient({ cases }: { cases: CaseListItem[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function createCase(duplicateFrom?: string) {
    const slug = window.prompt(
      duplicateFrom ? `Slug для копії кейсу "${duplicateFrom}" (латиницею):` : "Slug нового кейсу (латиницею, напр. my-case):"
    )?.trim();
    if (!slug) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(duplicateFrom ? { slug, duplicateFrom } : { slug }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Помилка створення кейсу");
        return;
      }
      window.alert(`Кейс "${slug}" створено. Зачекайте ~1 хв на деплой, потім оновіть цю сторінку.`);
      router.refresh();
    } catch {
      setError("Мережева помилка");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-2">
          <Link href="/admin" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Адмін-панель
          </Link>
        </div>
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-2xl font-medium text-foreground">Кейси</h1>
          <button
            onClick={() => createCase()}
            disabled={busy}
            className="bg-foreground text-background rounded-full px-5 py-2 text-sm font-medium hover:opacity-80 transition-opacity disabled:opacity-40"
          >
            + Створити кейс
          </button>
        </div>

        {error && (
          <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            Помилка: {error}
          </div>
        )}

        <div className="flex flex-col gap-3">
          {cases.length === 0 && (
            <p className="text-sm text-muted-foreground">Кейсів ще немає.</p>
          )}
          {cases.map((c) => (
            <div key={c.slug} className="border border-border rounded-2xl p-5 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Link href={`/admin/cases/${c.slug}`} className="text-base font-medium text-foreground hover:underline">
                    {c.title || c.slug}
                  </Link>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${c.status === "published" ? "bg-green-50 text-green-700" : "bg-muted text-muted-foreground"}`}>
                    {c.status === "published" ? "Опубліковано" : "Чернетка"}
                  </span>
                  {c.linkedFromHome && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-700" title="На цей кейс є посилання з головної сторінки">
                      Є посилання з головної
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground font-mono truncate">{c.slug}</p>
              </div>
              <button
                onClick={() => createCase(c.slug)}
                disabled={busy}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors shrink-0"
              >
                Дублювати
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

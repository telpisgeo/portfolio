"use client";

import { useState } from "react";
import contentJson from "@/data/content.json";

type CompanyContent = {
  slug: string;
  description: string;
  images: string[];
};

type Content = {
  uk: { companies: CompanyContent[] };
  en: { companies: CompanyContent[] };
};

const COMPANY_NAMES: Record<string, string> = {
  eschool: "Єдина школа",
  westudy: "Westudy",
  snovio: "Snov.io",
};

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState("");
  const [content, setContent] = useState<Content>(contentJson as Content);
  const [locale, setLocale] = useState<"uk" | "en">("uk");
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "ok" | "error">("idle");
  const [saveError, setSaveError] = useState("");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (password.length > 0) {
      setAuthed(true);
      setAuthError("");
    } else {
      setAuthError("Введіть пароль");
    }
  }

  function updateDescription(slug: string, value: string) {
    setContent((prev) => ({
      ...prev,
      [locale]: {
        ...prev[locale],
        companies: prev[locale].companies.map((c) =>
          c.slug === slug ? { ...c, description: value } : c
        ),
      },
    }));
  }

  function updateImage(slug: string, index: number, value: string) {
    setContent((prev) => ({
      ...prev,
      [locale]: {
        ...prev[locale],
        companies: prev[locale].companies.map((c) => {
          if (c.slug !== slug) return c;
          const imgs = [...c.images];
          imgs[index] = value;
          return { ...c, images: imgs };
        }),
      },
    }));
  }

  function addImage(slug: string) {
    setContent((prev) => ({
      ...prev,
      [locale]: {
        ...prev[locale],
        companies: prev[locale].companies.map((c) =>
          c.slug === slug ? { ...c, images: [...c.images, ""] } : c
        ),
      },
    }));
  }

  function removeImage(slug: string, index: number) {
    setContent((prev) => ({
      ...prev,
      [locale]: {
        ...prev[locale],
        companies: prev[locale].companies.map((c) => {
          if (c.slug !== slug) return c;
          const imgs = [...c.images];
          imgs.splice(index, 1);
          return { ...c, images: imgs };
        }),
      },
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
        body: JSON.stringify({ password, content }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSaveStatus("error");
        setSaveError(data.error ?? "Помилка збереження");
      } else {
        setSaveStatus("ok");
      }
    } catch {
      setSaveStatus("error");
      setSaveError("Мережева помилка");
    } finally {
      setSaving(false);
    }
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full max-w-sm px-6">
          <h1 className="text-2xl font-medium text-foreground">Адмін-панель</h1>
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-border rounded-xl px-4 py-3 text-sm bg-background text-foreground outline-none focus:border-foreground"
          />
          {authError && <p className="text-sm text-red-500">{authError}</p>}
          <button
            type="submit"
            className="bg-foreground text-background rounded-full px-5 py-2.5 text-sm font-medium hover:opacity-80 transition-opacity"
          >
            Увійти
          </button>
        </form>
      </div>
    );
  }

  const companies = content[locale].companies;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-2xl font-medium text-foreground">Редактор контенту</h1>
          <div className="flex items-center gap-3">
            <div className="flex border border-border rounded-full overflow-hidden text-sm">
              <button
                onClick={() => setLocale("uk")}
                className={`px-4 py-1.5 transition-colors ${locale === "uk" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
              >
                UA
              </button>
              <button
                onClick={() => setLocale("en")}
                className={`px-4 py-1.5 transition-colors ${locale === "en" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
              >
                EN
              </button>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-foreground text-background rounded-full px-5 py-2 text-sm font-medium hover:opacity-80 transition-opacity disabled:opacity-40"
            >
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

        <div className="flex flex-col gap-10">
          {companies.map((company) => (
            <div key={company.slug} className="border border-border rounded-2xl p-6">
              <h2 className="text-base font-medium text-foreground mb-5">
                {COMPANY_NAMES[company.slug] ?? company.slug}
              </h2>

              {/* Description */}
              <div className="mb-5">
                <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">
                  Опис
                </label>
                <textarea
                  value={company.description}
                  onChange={(e) => updateDescription(company.slug, e.target.value)}
                  rows={4}
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-background text-foreground outline-none focus:border-foreground resize-none leading-relaxed"
                />
              </div>

              {/* Images */}
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">
                  Зображення
                </label>
                <div className="flex flex-col gap-2">
                  {company.images.map((img, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        value={img}
                        onChange={(e) => updateImage(company.slug, i, e.target.value)}
                        className="flex-1 border border-border rounded-xl px-4 py-2.5 text-sm bg-background text-foreground outline-none focus:border-foreground font-mono"
                        placeholder="/images/works/example.webp"
                      />
                      <button
                        onClick={() => removeImage(company.slug, i)}
                        className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors shrink-0"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addImage(company.slug)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left py-1"
                  >
                    + Додати зображення
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

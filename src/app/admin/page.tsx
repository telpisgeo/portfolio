"use client";

import { useState } from "react";
import contentJson from "@/data/content.json";

// A row is either a single image path (string) or a pair (string[])
type ImageRow = string | string[];

type CompanyContent = {
  slug: string;
  description: string;
  imageRows: ImageRow[];
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

function toImageRows(raw: unknown): ImageRow[] {
  if (!Array.isArray(raw)) return [];
  return (raw as unknown[]).map((r) => {
    if (Array.isArray(r)) return (r as unknown[]).map(String);
    return String(r);
  });
}

const initialContent: Content = {
  uk: {
    companies: (contentJson.uk.companies as unknown[]).map((c: unknown) => {
      const co = c as Record<string, unknown>;
      return { slug: String(co.slug), description: String(co.description), imageRows: toImageRows(co.imageRows) };
    }),
  },
  en: {
    companies: (contentJson.en.companies as unknown[]).map((c: unknown) => {
      const co = c as Record<string, unknown>;
      return { slug: String(co.slug), description: String(co.description), imageRows: toImageRows(co.imageRows) };
    }),
  },
};

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState("");
  const [content, setContent] = useState<Content>(initialContent);
  const [locale, setLocale] = useState<"uk" | "en">("uk");
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "ok" | "error">("idle");
  const [saveError, setSaveError] = useState("");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (password.length > 0) { setAuthed(true); setAuthError(""); }
    else setAuthError("Введіть пароль");
  }

  function updateRows(slug: string, rows: ImageRow[]) {
    setContent((prev) => ({
      ...prev,
      [locale]: {
        ...prev[locale],
        companies: prev[locale].companies.map((c) => c.slug === slug ? { ...c, imageRows: rows } : c),
      },
    }));
  }

  function updateDescription(slug: string, value: string) {
    setContent((prev) => ({
      ...prev,
      [locale]: {
        ...prev[locale],
        companies: prev[locale].companies.map((c) => c.slug === slug ? { ...c, description: value } : c),
      },
    }));
  }

  // Add a single full-width row
  function addRow(slug: string) {
    const company = content[locale].companies.find((c) => c.slug === slug)!;
    updateRows(slug, [...company.imageRows, ""]);
  }

  // Add a side-by-side pair row
  function addPairRow(slug: string) {
    const company = content[locale].companies.find((c) => c.slug === slug)!;
    updateRows(slug, [...company.imageRows, ["", ""]]);
  }

  // Remove entire row
  function removeRow(slug: string, rowIdx: number) {
    const company = content[locale].companies.find((c) => c.slug === slug)!;
    updateRows(slug, company.imageRows.filter((_, i) => i !== rowIdx));
  }

  // Update a value inside a row
  function updateRowValue(slug: string, rowIdx: number, colIdx: number, value: string) {
    const company = content[locale].companies.find((c) => c.slug === slug)!;
    const rows = company.imageRows.map((row, i) => {
      if (i !== rowIdx) return row;
      if (Array.isArray(row)) {
        const updated = [...row];
        updated[colIdx] = value;
        return updated;
      }
      return value;
    });
    updateRows(slug, rows);
  }

  // Toggle: single ↔ pair
  function togglePair(slug: string, rowIdx: number) {
    const company = content[locale].companies.find((c) => c.slug === slug)!;
    const row = company.imageRows[rowIdx];
    const rows = company.imageRows.map((r, i) => {
      if (i !== rowIdx) return r;
      if (Array.isArray(r)) return r[0] ?? ""; // pair → single (keep first)
      return [r, ""];                            // single → pair
    });
    updateRows(slug, rows);
    void row;
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
      if (!res.ok) { setSaveStatus("error"); setSaveError(data.error ?? "Помилка збереження"); }
      else setSaveStatus("ok");
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
          <button type="submit" className="bg-foreground text-background rounded-full px-5 py-2.5 text-sm font-medium hover:opacity-80 transition-opacity">
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

        <div className="flex flex-col gap-10">
          {companies.map((company) => (
            <div key={company.slug} className="border border-border rounded-2xl p-6">
              <h2 className="text-base font-medium text-foreground mb-5">{COMPANY_NAMES[company.slug] ?? company.slug}</h2>

              {/* Description */}
              <div className="mb-6">
                <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">Опис</label>
                <textarea
                  value={company.description}
                  onChange={(e) => updateDescription(company.slug, e.target.value)}
                  rows={4}
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-background text-foreground outline-none focus:border-foreground resize-none leading-relaxed"
                />
              </div>

              {/* Image rows */}
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground mb-3 block">Зображення</label>
                <div className="flex flex-col gap-3">
                  {company.imageRows.map((row, rowIdx) => (
                    <div key={rowIdx} className="flex items-start gap-2">
                      <div className="flex-1 flex flex-col gap-2">
                        {Array.isArray(row) ? (
                          <div className="flex gap-2">
                            {(row as string[]).map((val, colIdx) => (
                              <input
                                key={colIdx}
                                value={val}
                                onChange={(e) => updateRowValue(company.slug, rowIdx, colIdx, e.target.value)}
                                className="flex-1 border border-border rounded-xl px-3 py-2 text-sm bg-background text-foreground outline-none focus:border-foreground font-mono"
                                placeholder="/images/works/example.webp"
                              />
                            ))}
                          </div>
                        ) : (
                          <input
                            value={row as string}
                            onChange={(e) => updateRowValue(company.slug, rowIdx, 0, e.target.value)}
                            className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-background text-foreground outline-none focus:border-foreground font-mono"
                            placeholder="/images/works/example.webp"
                          />
                        )}
                      </div>
                      {/* Toggle pair button */}
                      <button
                        onClick={() => togglePair(company.slug, rowIdx)}
                        title={Array.isArray(row) ? "Зробити одним рядком" : "Поставити поруч (2 в ряд)"}
                        className={`mt-0.5 w-8 h-8 flex items-center justify-center rounded-lg border transition-colors shrink-0 ${Array.isArray(row) ? "border-foreground text-foreground bg-foreground/5" : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"}`}
                      >
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <rect x="1" y="3" width="6" height="10" rx="1.5" />
                          <rect x="9" y="3" width="6" height="10" rx="1.5" />
                        </svg>
                      </button>
                      {/* Remove row button */}
                      <button
                        onClick={() => removeRow(company.slug, rowIdx)}
                        className="mt-0.5 w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors shrink-0"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}

                  <div className="flex gap-3 pt-1">
                    <button onClick={() => addRow(company.slug)} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      + Додати зображення
                    </button>
                    <button onClick={() => addPairRow(company.slug)} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      + Додати пару поруч
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Помилка входу");
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Мережева помилка");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm px-6">
        <h1 className="text-2xl font-medium text-foreground">Адмін-панель</h1>
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          className="border border-border rounded-xl px-4 py-3 text-sm bg-background text-foreground outline-none focus:border-foreground"
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="bg-foreground text-background rounded-full px-5 py-2.5 text-sm font-medium hover:opacity-80 transition-opacity disabled:opacity-40"
        >
          {loading ? "Входжу..." : "Увійти"}
        </button>
      </form>
    </div>
  );
}

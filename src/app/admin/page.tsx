"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-2xl font-medium text-foreground">Адмін-панель</h1>
          <button onClick={handleLogout} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Вийти
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <Link
            href="/admin/home"
            className="border border-border rounded-2xl p-6 hover:border-foreground transition-colors"
          >
            <h2 className="text-base font-medium text-foreground mb-1">Головна сторінка</h2>
            <p className="text-sm text-muted-foreground">Компанії, розділ &quot;Про мене&quot;, досвід роботи</p>
          </Link>

          <Link
            href="/admin/cases"
            className="border border-border rounded-2xl p-6 hover:border-foreground transition-colors"
          >
            <h2 className="text-base font-medium text-foreground mb-1">Кейси</h2>
            <p className="text-sm text-muted-foreground">Створення, редагування та статус кейсів</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

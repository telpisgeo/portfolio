"use client";

import { useEffect, useState } from "react";
import { useHideOnScroll } from "@/lib/useHideOnScroll";

export type StepItem = { label: string; href: string };

export default function CaseStepsNav({ items }: { items: StepItem[] }) {
  const [active, setActive] = useState(items[0]?.href.slice(1) ?? "");
  const [progress, setProgress] = useState(0);
  const navHidden = useHideOnScroll(true);

  useEffect(() => {
    const ids = items.map((i) => i.href.slice(1));
    const LINE = 150;

    function compute() {
      const tops = ids
        .map((id) => {
          const el = document.getElementById(id);
          return el ? { id, abs: el.getBoundingClientRect().top + window.scrollY } : null;
        })
        .filter((t): t is { id: string; abs: number } => t !== null)
        .sort((a, b) => a.abs - b.abs);

      if (tops.length === 0) return;
      const pos = window.scrollY + LINE;

      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        setActive(tops[tops.length - 1].id);
        setProgress(1);
        return;
      }

      let idx = 0;
      for (let k = 0; k < tops.length; k++) {
        if (tops[k].abs <= pos) idx = k;
      }
      const cur = tops[idx];
      const next = tops[idx + 1];
      const start = cur.abs;
      const end = next ? next.abs : document.documentElement.scrollHeight;
      const p = end > start ? Math.min(1, Math.max(0, (pos - start) / (end - start))) : 0;

      setActive(cur.id);
      setProgress(p);
    }

    compute();
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, [items]);

  function handleClick(e: React.MouseEvent, href: string) {
    e.preventDefault();
    const el = document.getElementById(href.slice(1));
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", href);
    }
  }

  return (
    <nav
      className={`sticky z-50 transition-[top,background-color] duration-300 ${navHidden ? "bg-transparent" : "bg-[#FCF9DF]"}`}
      style={{ top: navHidden ? 0 : 64 }}
    >
      <div className="px-1 md:px-8 py-4">
        <div className="max-w-[912px] mx-auto flex gap-2 overflow-x-auto no-scrollbar">
          {items.map((it) => {
            const id = it.href.slice(1);
            const isActive = active === id;
            return (
              <a
                key={it.href}
                href={it.href}
                onClick={(e) => handleClick(e, it.href)}
                className="relative shrink-0 md:flex-1 text-center overflow-hidden rounded-full bg-[#FFFEF9] border border-[#171311]/10 px-6 py-2.5 text-sm font-medium text-[#171311]"
              >
                {isActive && (
                  <span
                    aria-hidden
                    className="absolute inset-y-0 left-0 bg-[#FBCF0B] transition-[width] duration-150 ease-out"
                    style={{ width: `${Math.max(progress * 100, 8)}%` }}
                  />
                )}
                <span className="relative z-10">{it.label}</span>
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

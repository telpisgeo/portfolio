"use client";

import { useState } from "react";

type Project = {
  name: string;
  description: string;
  sidebarContent: string;
};

const projects: Project[] = [
  {
    name: "SendPulse",
    description: "Інструмент багатоканального маркетингу",
    sidebarContent:
      "Опис буде тут — редизайн редактора email-кампаній, партнерська програма та інструменти для створення курсів.",
  },
  {
    name: "Serpstat",
    description: "Універсальна платформа для пошукового маркетингу",
    sidebarContent:
      "Опис буде тут — дизайн-система з нуля, інструменти аналізу ключових слів, аудиту сайту та моніторингу позицій.",
  },
  {
    name: "MedCenter",
    description: "Cистема управління клінікою online",
    sidebarContent:
      "Опис буде тут — система запису до лікарів, управління розкладом, медичні картки та аналітика.",
  },
];

type Props = {
  locale: string;
};

export default function OtherProjects({ locale }: Props) {
  const [active, setActive] = useState<Project | null>(null);

  return (
    <>
      <div className="max-w-[1440px] w-full mx-auto px-6 sm:px-12 mt-12">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-6">
          {locale === "uk" ? "Інші проекти" : "Other projects"}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {projects.map((project) => (
            <button
              key={project.name}
              onClick={() => setActive(project)}
              className="flex items-center gap-3 p-4 text-left border border-border rounded-2xl hover:bg-muted/50 transition-colors group"
            >
              <div className="w-10 h-10 shrink-0 rounded-xl bg-muted flex items-center justify-center">
                <span className="text-muted-foreground/40 text-sm font-medium">
                  {project.name.charAt(0)}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">{project.name}</p>
                <p className="text-xs text-muted-foreground leading-snug">{project.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Sidebar overlay */}
      {active && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm animate-[fadeIn_0.8s_ease]"
            onClick={() => setActive(null)}
          />
          <div className="fixed right-0 top-0 h-full w-full max-w-[480px] z-50 bg-background shadow-2xl flex flex-col animate-[slideIn_1.2s_cubic-bezier(0.22,1,0.36,1)]">
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                  <span className="text-muted-foreground/40 text-sm font-medium">
                    {active.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-base font-medium text-foreground">{active.name}</p>
                  <p className="text-sm text-muted-foreground">{active.description}</p>
                </div>
              </div>
              <button
                onClick={() => setActive(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors text-muted-foreground"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-8 py-8">
              <div className="w-full h-48 rounded-[8px] bg-muted mb-6 flex items-center justify-center">
                <span className="text-muted-foreground/30 text-sm">Скріншот буде тут</span>
              </div>
              <p className="text-base text-foreground/75 leading-relaxed">
                {active.sidebarContent}
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
}

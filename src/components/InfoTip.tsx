"use client";

import { useEffect, useRef, useState } from "react";

/** Маленька іконка (i): текст у підказці з'являється при наведенні, фокусі або кліку/тапі.
 *  Позиціонується відносно найближчого `relative` предка. */
export default function InfoTip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const hovered = useRef(false);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: Event) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <span
      ref={ref}
      className="inline-block align-middle ml-2"
      onPointerEnter={(e) => { if (e.pointerType === "mouse") { hovered.current = true; setOpen(true); } }}
      onPointerLeave={(e) => { if (e.pointerType === "mouse") { hovered.current = false; setOpen(false); } }}
    >
      <button
        type="button"
        aria-label="Пояснення"
        aria-expanded={open}
        onClick={() => setOpen((v) => (hovered.current ? true : !v))}
        className="relative -top-[5px] flex h-6 w-6 md:h-7 md:w-7 items-center justify-center rounded-full border-2 border-foreground text-[13px] md:text-[15px] font-bold leading-none text-foreground transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
      >
        i
      </button>
      {open && (
        <span
          role="tooltip"
          className="absolute left-0 right-0 top-full z-20 mt-2 max-w-[460px] whitespace-normal rounded-xl bg-foreground px-4 py-3 text-sm md:text-base leading-[1.4] font-normal text-background shadow-lg"
        >
          {text}
        </span>
      )}
    </span>
  );
}

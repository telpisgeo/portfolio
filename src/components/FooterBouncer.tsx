"use client";

import { useEffect, useRef, useState } from "react";

/**
 * One round photo drifting around its parent like a DVD screensaver.
 * Constant speed; each wall hit swaps the photo and nudges the heading.
 */
export default function FooterBouncer({
  photos,
}: {
  photos: string[];
}) {
  const stage = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // Warm the cache so a swap never flashes empty.
    photos.forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    const el = stage.current;
    const node = dot.current;
    if (!el || !node) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const SPEED = 160; // px/s, constant
    let size = node.offsetWidth;
    let w = el.clientWidth;
    let h = el.clientHeight;
    let x = Math.random() * Math.max(1, w - size);
    let y = Math.random() * Math.max(1, h - size);
    const angle = Math.PI / 4 + Math.random() * (Math.PI / 6);
    let dx = Math.random() < 0.5 ? 1 : -1;
    let dy = Math.random() < 0.5 ? 1 : -1;
    let ax = Math.cos(angle);
    let ay = Math.sin(angle);

    const place = () => {
      node.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };
    place();
    if (reduce) return;

    const swap = () => {
      setIndex((i) => {
        let n = i;
        while (photos.length > 1 && n === i) n = Math.floor(Math.random() * photos.length);
        return n;
      });
    };

    const ro = new ResizeObserver(() => {
      size = node.offsetWidth;
      w = el.clientWidth;
      h = el.clientHeight;
      x = Math.min(x, Math.max(0, w - size));
      y = Math.min(y, Math.max(0, h - size));
    });
    ro.observe(el);

    let last = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      x += dx * ax * SPEED * dt;
      y += dy * ay * SPEED * dt;
      let hit = false;
      if (x <= 0) { x = 0; dx = 1; hit = true; }
      else if (x >= w - size) { x = w - size; dx = -1; hit = true; }
      if (y <= 0) { y = 0; dy = 1; hit = true; }
      else if (y >= h - size) { y = h - size; dy = -1; hit = true; }
      if (hit) {
        // Slightly new heading each time so the path never repeats.
        const a = Math.PI / 5 + Math.random() * (Math.PI / 4);
        ax = Math.cos(a);
        ay = Math.sin(a);
        swap();
      }
      place();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [photos]);

  return (
    <div ref={stage} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div ref={dot} className="absolute top-0 left-0 size-[clamp(84px,11.2vw,154px)] will-change-transform">
        {/* eslint-disable-next-line @next/next/no-img-element -- swapped on every bounce */}
        <img src={photos[index]} alt="" draggable={false} className="size-full rounded-full object-cover" />
      </div>
    </div>
  );
}

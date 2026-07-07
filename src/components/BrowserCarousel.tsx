"use client";

import { useEffect, useState } from "react";

export type CarouselSite = { url: string; src: string };

type Role = "center" | "next" | "prev" | "hidden";

function getRole(i: number, order: number[]): Role {
  if (order[0] === i) return "center";
  if (order[1] === i) return "next";
  if (order[order.length - 1] === i) return "prev";
  return "hidden";
}

const ROLE_STYLES: Record<Role, string> = {
  center: "translate-x-[-50%] translate-y-[-50%] scale-[0.7]  opacity-100 z-20",
  next:   "translate-x-[10%]  translate-y-[-50%] scale-[0.56] opacity-0   z-10",
  prev:   "translate-x-[-110%] translate-y-[-50%] scale-[0.56] opacity-0  z-10",
  hidden: "translate-x-[-50%] translate-y-[-50%] scale-[0.56] opacity-0   z-0",
};

export default function BrowserCarousel({ sites }: { sites: CarouselSite[] }) {
  const [order, setOrder] = useState(() => sites.map((_, i) => i));

  useEffect(() => {
    if (sites.length < 2) return;
    const id = setInterval(() => {
      setOrder(prev => {
        const next = [...prev];
        next.push(next.shift()!);
        return next;
      });
    }, 3600);
    return () => clearInterval(id);
  }, [sites.length]);

  return (
    <div
      className="w-full rounded-2xl overflow-hidden relative"
      style={{ aspectRatio: "1144 / 640", background: "#B9CBD7" }}
    >
      {sites.map((site, i) => {
        const role = getRole(i, order);
        return (
          <div
            key={i}
            className={`absolute top-1/2 left-1/2 w-full h-full bg-white rounded-[14px] shadow-[0_30px_60px_rgba(0,0,0,0.18),0_4px_12px_rgba(0,0,0,0.08)] overflow-hidden transition-all duration-[600ms] ease-in-out ${ROLE_STYLES[role]}`}
          >
            {/* browser bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-black/[0.07] bg-white">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
              <span className="ml-3 flex-1 bg-[#f1f1f3] rounded text-[12px] text-black/40 px-3 py-1">{site.url}</span>
            </div>
            {/* screenshot */}
            <img
              src={site.src}
              alt={site.url}
              className="w-full object-cover object-top"
              style={{ height: "calc(100% - 45px)" }}
              loading="lazy"
            />
          </div>
        );
      })}
    </div>
  );
}

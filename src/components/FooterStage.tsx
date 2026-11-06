"use client";

import { useCallback, useState } from "react";
import FooterBouncer from "./FooterBouncer";

/** Footer body: the bouncing photo plus a mailto line whose wording changes on every bounce. */
export default function FooterStage({
  photos,
  messages,
  email,
  children,
}: {
  photos: string[];
  messages: string[];
  email: string;
  children: React.ReactNode;
}) {
  const [msg, setMsg] = useState(0);
  const next = useCallback(() => {
    setMsg((cur) => {
      let n = cur;
      while (messages.length > 1 && n === cur) n = Math.floor(Math.random() * messages.length);
      return n;
    });
  }, [messages.length]);

  return (
    <div className="relative isolate flex min-h-[460px] sm:min-h-[520px] items-center justify-center overflow-hidden px-6 sm:px-12 py-10">
      <FooterBouncer photos={photos} onBounce={next} />
      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Fixed two-line slot so the socials below never jump when the wording changes. */}
        <div className="flex min-h-[2.3em] items-center justify-center text-[clamp(1.75rem,5.5vw,3.25rem)] leading-[1.1]">
          <a
            key={msg}
            href={`mailto:${email}`}
            aria-label={`${messages[msg]} (${email})`}
            title={email}
            className="max-w-[24ch] text-balance font-medium hover:opacity-80 transition-opacity animate-[fadeIn_0.35s_ease-out]"
          >
            {messages[msg]}
          </a>
        </div>
        {children}
      </div>
    </div>
  );
}

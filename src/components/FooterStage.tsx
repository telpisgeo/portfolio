"use client";

import FooterBouncer from "./FooterBouncer";

/** Footer body: one round photo bouncing off the footer edges (it passes under the text), and a mailto quote. */
export default function FooterStage({
  photos,
  text,
  author,
  email,
  children,
}: {
  photos: string[];
  text: string;
  author: string;
  email: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative isolate flex min-h-[460px] sm:min-h-[520px] items-center justify-center overflow-hidden px-6 sm:px-12 py-10">
      <FooterBouncer photos={photos} />
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="flex items-center justify-center text-[clamp(1.75rem,5.5vw,3.25rem)] leading-[1.1]">
          <a
            href={`mailto:${email}`}
            aria-label={`${text} — ${author} (${email})`}
            title={email}
            className="max-w-[24ch] text-balance font-medium hover:opacity-80 transition-opacity"
          >
            {text}
          </a>
        </div>
        <p className="mt-3 text-sm text-footer-text/50">— {author}</p>
        {children}
      </div>
    </div>
  );
}

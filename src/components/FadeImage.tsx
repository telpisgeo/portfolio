"use client";

import { useState } from "react";

export default function FadeImage({
  src,
  alt,
  ratio,
  className = "rounded-lg",
}: {
  src: string;
  alt: string;
  ratio: string;
  className?: string;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className={`relative w-full overflow-hidden bg-black/[0.06] ${className}`}
      style={{ aspectRatio: ratio.replace("/", " / ") }}
    >
      {!loaded && <div className="absolute inset-0 animate-pulse bg-black/[0.06]" />}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}

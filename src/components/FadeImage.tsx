"use client";

import { useState } from "react";
import Image from "next/image";

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
      {!loaded && <div className="absolute inset-0 animate-shimmer" />}
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 912px, 100vw"
        ref={(img) => {
          // Safari can skip onLoad for cached images; reveal them right away.
          if (img?.complete && img.naturalWidth > 0) setLoaded(true);
        }}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        className={`object-cover transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}

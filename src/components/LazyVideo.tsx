"use client";

import { useEffect, useRef } from "react";

export default function LazyVideo({
  src,
  className = "",
  style,
}: {
  src: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.src = el.dataset.src ?? "";
          el.load();
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={videoRef}
      data-src={src}
      autoPlay
      loop
      muted
      playsInline
      className={className}
      style={style}
    />
  );
}

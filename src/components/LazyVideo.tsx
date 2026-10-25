"use client";

import { useEffect, useRef } from "react";

// Loads the video only when it gets close to the viewport and pauses it again
// when it scrolls away, so a page with many autoplaying clips doesn't download
// or decode all of them at once.
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

    let loaded = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!loaded) {
            loaded = true;
            el.src = el.dataset.src ?? "";
            el.load();
          }
          el.play().catch(() => {});
        } else if (loaded) {
          el.pause();
        }
      },
      { rootMargin: "300px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={videoRef}
      data-src={src}
      preload="none"
      autoPlay
      loop
      muted
      playsInline
      className={className}
      style={style}
    />
  );
}

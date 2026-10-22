"use client";

import { useEffect, useRef } from "react";

// Preloads eagerly, then plays from the start when the video crosses the
// vertical center of the viewport and pauses once it leaves. With `once` it
// plays a single time and then stays on its last frame.
export default function CenterPlayVideo({
  src,
  className = "",
  once = false,
}: {
  src: string;
  className?: string;
  once?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    let played = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (once) {
          if (entry.isIntersecting && !played) {
            played = true;
            el.currentTime = 0;
            el.play().catch(() => {});
            observer.disconnect();
          }
          return;
        }
        if (entry.isIntersecting) {
          el.currentTime = 0;
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once]);

  return (
    <video
      ref={videoRef}
      src={src}
      className={className}
      preload="auto"
      loop={!once}
      muted
      playsInline
    />
  );
}

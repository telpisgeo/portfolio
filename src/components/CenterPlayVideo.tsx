"use client";

import { useEffect, useRef } from "react";

// Preloads eagerly, then plays from the start when the video crosses the
// vertical center of the viewport and pauses once it leaves. With `once` it
// plays a single time and then stays on its last frame.
//
// Safari needs extra care: React doesn't render `muted` as an attribute on a
// server-rendered <video>, and without it Safari blocks autoplay (the clip
// stays frozen on its first frame). So muted/playsinline are applied by hand,
// and a rejected play() is retried once the clip can play and on the first
// touch/scroll (Low Power Mode blocks autoplay until the user interacts).
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

    el.muted = true;
    el.defaultMuted = true;
    el.setAttribute("muted", "");
    el.setAttribute("playsinline", "");
    el.setAttribute("webkit-playsinline", "");

    let visible = false;
    let played = false;

    const tryPlay = () => {
      const p = el.play();
      if (p) p.catch(() => {});
    };
    // Don't wait for metadata before play(): iOS Safari doesn't fetch anything
    // until play() is called, so waiting for `loadedmetadata` would deadlock.
    const start = () => {
      try {
        el.currentTime = 0;
      } catch {
        // not seekable yet — it will start from the beginning anyway
      }
      tryPlay();
    };
    // Retry if the browser refused the first play() attempt.
    const retry = () => {
      if (visible && el.paused && !(once && played && el.ended)) tryPlay();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (once) {
          if (entry.isIntersecting && !played) {
            played = true;
            start();
            observer.disconnect();
          }
          return;
        }
        if (entry.isIntersecting) start();
        else el.pause();
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    observer.observe(el);

    el.addEventListener("canplay", retry);
    const gestures = ["touchstart", "pointerdown", "scroll"] as const;
    gestures.forEach((g) => window.addEventListener(g, retry, { passive: true, once: true }));

    return () => {
      observer.disconnect();
      el.removeEventListener("canplay", retry);
      gestures.forEach((g) => window.removeEventListener(g, retry));
    };
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

"use client";

import { useEffect, useRef } from "react";

// Muted looping clip that plays from the start when it reaches the vertical
// center of the viewport. With `once` it plays a single time and then stays on
// its last frame.
//
// Two code paths, because Safari / iOS (WebKit) refuse a script-initiated
// play() on a clip that hasn't played yet — it either never starts or freezes
// on frame 0 (`playing` → `pause` → `seeking`). A native `autoplay` attribute
// is honoured, so:
//  - WebKit: rely on `autoplay`/`loop` (WebKit also pauses clips that scroll
//    out of view). We never call play() ourselves except on a user gesture,
//    and only restart a clip that is already running (seek to 0) when it
//    crosses the center. `once` clips just play when they first become visible.
//  - everything else: `autoplay` only gives the first frame a head start; the
//    observer then pauses clips outside the center and starts them from 0
//    when they cross it.
const isWebKit = () => {
  const ua = navigator.userAgent;
  return /AppleWebKit/.test(ua) && !/Chrome|Chromium|Edg|Android/.test(ua);
};

export default function CenterPlayVideo({
  src,
  className = "",
  once = false,
  poster,
}: {
  src: string;
  className?: string;
  once?: boolean;
  // Still shown until the video has data — keeps the box from looking empty
  // while a large clip downloads (slow on Safari / mobile).
  poster?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    // React doesn't render `muted` as an attribute on a server-rendered
    // <video>; without it Safari treats the clip as unmuted and blocks autoplay.
    el.muted = true;
    el.defaultMuted = true;
    el.setAttribute("muted", "");
    el.setAttribute("playsinline", "");
    el.setAttribute("webkit-playsinline", "");

    const tryPlay = () => {
      const p = el.play();
      if (p) p.catch(() => {});
    };
    const gestures = ["touchend", "pointerdown", "click", "keydown"] as const;

    if (isWebKit()) {
      // Safari / iOS: native autoplay does the playing.
      let inView = false;
      const view = new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
      });
      view.observe(el);

      const center = new IntersectionObserver(
        ([entry]) => {
          // Restart a running loop from the beginning as it reaches the center.
          if (entry.isIntersecting && !once && !el.paused && el.currentTime > 0.5) {
            el.currentTime = 0;
          }
        },
        { rootMargin: "-45% 0px -45% 0px" }
      );
      center.observe(el);

      // If autoplay was refused (Low Power Mode, per-site setting), start the
      // clips that are on screen on the first user gesture.
      const kick = () => {
        if (inView && el.paused && !el.ended) tryPlay();
      };
      gestures.forEach((g) => window.addEventListener(g, kick, { passive: true }));

      return () => {
        view.disconnect();
        center.disconnect();
        gestures.forEach((g) => window.removeEventListener(g, kick));
      };
    }

    // Other browsers: pause outside the center, start from 0 when it is crossed.
    let want = false; // the clip should be playing right now
    let played = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    // Re-assert play() for a moment until the clip is really running.
    const ensurePlaying = (attempt = 0) => {
      clearTimeout(timer);
      if (!want || attempt > 8) return;
      if (el.paused && !el.ended) tryPlay();
      timer = setTimeout(() => ensurePlaying(attempt + 1), 350);
    };
    const start = () => {
      want = true;
      if (el.currentTime > 0.05 || el.ended) {
        try {
          el.currentTime = 0;
        } catch {
          // not seekable yet — it will start from the beginning anyway
        }
      }
      ensurePlaying();
    };
    const stop = () => {
      want = false;
      clearTimeout(timer);
      el.pause();
    };
    const onPause = () => {
      if (want && !el.ended) setTimeout(tryPlay, 0);
    };
    const onEnded = () => {
      want = false;
    };
    const retry = () => {
      if (want && el.paused && !el.ended) tryPlay();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (once) {
          if (entry.isIntersecting && !played) {
            played = true;
            start();
            observer.disconnect();
          } else if (!entry.isIntersecting && !played) {
            // `autoplay` may have started it early: wait at frame 0 for the center.
            el.pause();
            try {
              el.currentTime = 0;
            } catch {
              // ignore
            }
          }
          return;
        }
        if (entry.isIntersecting) start();
        else stop();
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    observer.observe(el);

    el.addEventListener("pause", onPause);
    el.addEventListener("ended", onEnded);
    el.addEventListener("canplay", retry);
    gestures.forEach((g) => window.addEventListener(g, retry, { passive: true, once: true }));

    return () => {
      clearTimeout(timer);
      observer.disconnect();
      el.removeEventListener("pause", onPause);
      el.removeEventListener("ended", onEnded);
      el.removeEventListener("canplay", retry);
      gestures.forEach((g) => window.removeEventListener(g, retry));
    };
  }, [once]);

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster || undefined}
      className={className}
      preload="auto"
      autoPlay
      loop={!once}
      muted
      playsInline
    />
  );
}

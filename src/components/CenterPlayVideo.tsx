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
// touch/scroll (Low Power Mode blocks autoplay until the user interacts). A
// seek right before play() also makes Safari drop the play() — see ensurePlaying.
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

    el.muted = true;
    el.defaultMuted = true;
    el.setAttribute("muted", "");
    el.setAttribute("playsinline", "");
    el.setAttribute("webkit-playsinline", "");

    let want = false; // the clip should be playing right now
    let played = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const tryPlay = () => {
      const p = el.play();
      if (p) p.catch(() => {});
    };
    // Safari cancels a play() that races with a seek (`currentTime = 0`): the
    // clip fires `playing` then `pause` and stays frozen on frame 0. So we seek
    // only when needed and keep re-asserting play() for a few seconds until the
    // clip is really running. Don't wait for metadata first: iOS Safari fetches
    // nothing until play() is called, so waiting for `loadedmetadata` deadlocks.
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
    // Safari also fires a stray `pause` right after the seek; undo it.
    const onPause = () => {
      if (want && !el.ended) setTimeout(tryPlay, 0);
    };
    const onEnded = () => {
      want = false;
    };
    // Retry if the browser refused play() (autoplay policy, Low Power Mode).
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
    const gestures = ["touchstart", "pointerdown", "scroll"] as const;
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
      loop={!once}
      muted
      playsInline
    />
  );
}

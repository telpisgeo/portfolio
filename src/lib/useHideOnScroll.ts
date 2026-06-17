"use client";

import { useEffect, useState } from "react";

/**
 * Returns `true` when the sticky header should be hidden — i.e. the user is
 * scrolling down past the top region. Reveals again on scroll up.
 */
export function useHideOnScroll(enabled = true, revealAbove = 80): boolean {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    let last = window.scrollY;

    function onScroll() {
      const y = window.scrollY;
      if (y < revealAbove) {
        setHidden(false);
      } else if (y > last + 4) {
        setHidden(true); // scrolling down
      } else if (y < last - 4) {
        setHidden(false); // scrolling up
      }
      last = y;
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [enabled, revealAbove]);

  return hidden;
}

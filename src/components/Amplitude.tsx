"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import * as amplitude from "@amplitude/unified";
import { isOwnerDevice } from "@/lib/analytics";

let initialized = false;

export default function Amplitude() {
  const pathname = usePathname();

  useEffect(() => {
    if (initialized) return;
    if (pathname?.startsWith("/admin")) return;
    if (isOwnerDevice()) return;
    initialized = true;
    amplitude.initAll("6d725ed8721e8b64f65b6316ce29d7a0", {
      analytics: { autocapture: true },
      sessionReplay: { sampleRate: 1 },
    });
  }, [pathname]);

  return null;
}

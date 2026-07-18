"use client";

import { useEffect } from "react";
import * as amplitude from "@amplitude/unified";

let initialized = false;

export default function Amplitude() {
  useEffect(() => {
    if (initialized) return;
    if (
      typeof window !== "undefined" &&
      (window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1")
    ) {
      return;
    }
    initialized = true;
    amplitude.initAll("6d725ed8721e8b64f65b6316ce29d7a0", {
      analytics: { autocapture: true },
      sessionReplay: { sampleRate: 1 },
    });
  }, []);

  return null;
}

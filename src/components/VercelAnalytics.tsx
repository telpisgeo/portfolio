"use client";

import { Analytics } from "@vercel/analytics/react";

export default function VercelAnalytics() {
  return (
    <Analytics
      beforeSend={(event) => {
        // Drop events on devices flagged as "owner" (run in console once:
        // localStorage.setItem("va-disable", "1") to stop counting your own visits).
        if (typeof window !== "undefined" && localStorage.getItem("va-disable") === "1") {
          return null;
        }
        return event;
      }}
    />
  );
}

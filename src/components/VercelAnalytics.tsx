"use client";

import { usePathname } from "next/navigation";
import { Analytics } from "@vercel/analytics/react";
import { isOwnerDevice } from "@/lib/analytics";

export default function VercelAnalytics() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <Analytics
      beforeSend={(event) => {
        if (isOwnerDevice()) return null;
        return event;
      }}
    />
  );
}

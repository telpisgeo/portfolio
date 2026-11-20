import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

const PRIVATE = ["/admin", "/api", "/sandbox", "/ads", "/graph", "/shabo"];

export default function robots(): MetadataRoute.Robots {
  return {
    // /ads, /graph and /shabo are private: closed to every crawler, AI bots included
    // (they also carry noindex + X-Robots-Tag as a second layer).
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE },
      // AI crawlers/search bots are explicitly welcome on public pages.
      {
        userAgent: [
          "GPTBot",
          "OAI-SearchBot",
          "ChatGPT-User",
          "ClaudeBot",
          "Claude-SearchBot",
          "Claude-User",
          "PerplexityBot",
          "Google-Extended",
          "Applebot-Extended",
        ],
        allow: "/",
        disallow: PRIVATE,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

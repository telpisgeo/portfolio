import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api", "/sandbox"],
    },
    sitemap: "https://www.telpis.com.ua/sitemap.xml",
    host: "https://www.telpis.com.ua",
  };
}

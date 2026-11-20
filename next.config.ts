import type { NextConfig } from "next";

// Baseline security headers for every response. CSP is intentionally omitted:
// the site loads Amplitude, Vercel Analytics/Speed Insights and inline JSON-LD,
// and a strict policy would need per-script nonces to avoid breaking them.
const securityHeaders = [
  // Never let the site be embedded in a frame on another origin (clickjacking).
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
  // Browsers must trust the declared Content-Type (no MIME sniffing).
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Send only the origin as referrer when navigating to other sites.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // The site uses none of these device APIs.
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  // Vercel already sends HSTS; repeat it with preload so it also applies to
  // any non-Vercel hosting of this app.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  // 90 is used for the large image on /fun/[id] (the default 75 is visibly soft on gradients).
  images: { qualities: [75, 90] },
  // Don't advertise the framework in every response.
  poweredByHeader: false,
  async headers() {
    return [
      { source: "/(.*)", headers: securityHeaders },
      // Private pages: tell every crawler (and AI indexer) not to index/cache.
      ...["/ads/:path*", "/graph/:path*", "/shabo"].map((source) => ({
        source,
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive, noimageindex" }],
      })),
    ];
  },
  // sharp's native libvips binary isn't always picked up by output file
  // tracing, which crashes /api/admin/media at runtime with ERR_DLOPEN_FAILED.
  outputFileTracingIncludes: {
    "/api/admin/media": ["./node_modules/@img/**/*", "./node_modules/sharp/**/*"],
  },
};

export default nextConfig;

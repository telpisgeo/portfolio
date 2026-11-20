import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 90 is used for the large image on /fun/[id] (the default 75 is visibly soft on gradients).
  images: { qualities: [75, 90] },
  // sharp's native libvips binary isn't always picked up by output file
  // tracing, which crashes /api/admin/media at runtime with ERR_DLOPEN_FAILED.
  outputFileTracingIncludes: {
    "/api/admin/media": ["./node_modules/@img/**/*", "./node_modules/sharp/**/*"],
  },
};

export default nextConfig;

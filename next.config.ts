import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // sharp's native libvips binary isn't always picked up by output file
  // tracing, which crashes /api/admin/media at runtime with ERR_DLOPEN_FAILED.
  outputFileTracingIncludes: {
    "/api/admin/media": ["./node_modules/@img/**/*", "./node_modules/sharp/**/*"],
  },
};

export default nextConfig;

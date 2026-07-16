import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allows a second dev server (e.g. preview in another Claude session) to run
  // against its own dist dir without fighting over the .next dev lock
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image optimization
  images: {
    domains: ["localhost"],
    unoptimized: process.env.NODE_ENV === "development",
  },
};

export default nextConfig;

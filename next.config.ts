import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  async rewrites() {
    return [
      { source: "/tdp", destination: "/tdp/index.html" },
      { source: "/tdp/", destination: "/tdp/index.html" },
    ];
  },
};

export default nextConfig;

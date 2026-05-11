import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "www.logos.covalenthq.com", pathname: "/**" },
      { protocol: "https", hostname: "logos.covalenthq.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;

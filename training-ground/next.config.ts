import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(process.cwd(), ".."),
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

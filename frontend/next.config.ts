import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api-seim.rayaku.com",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;

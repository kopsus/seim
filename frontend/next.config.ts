import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "images.tokopedia.net",
      },
    ],
  },
  /* config options here */
};

export default nextConfig;

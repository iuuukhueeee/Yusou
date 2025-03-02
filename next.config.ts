import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        "source": "/stats/:match*",
        "destination": "https://cloud.umami.is/:match*"
      }
    ]
  }

};

export default nextConfig;

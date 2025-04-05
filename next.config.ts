import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        "source": "/stats/:match*",
        "destination": "https://cloud.umami.is/:match*"
      }
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'iuuukhueeee-soul.s3.ap-southeast-1.amazonaws.com',
      },
    ]
  },
  async redirects() {
    return [
      {
        "source": "/",
        destination: "/upload",
        permanent: true
      }
    ]
  }

};

export default nextConfig;

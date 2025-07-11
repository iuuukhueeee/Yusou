import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/stats/:match*',
        destination: 'https://cloud.umami.is/:match*',
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'iuuukhueeee-soul.s3.ap-southeast-1.amazonaws.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'yusou.vercel.app',
          },
        ],
        destination: 'https://yusou.dev/:path*',
        permanent: true,
      },
    ]
  },
}

export default nextConfig

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://143.198.214.90/:path*',
      },
    ]
  },
};

export default nextConfig;

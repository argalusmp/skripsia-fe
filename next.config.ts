import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    // Only apply rewrites in development
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/api/:path*',
          destination: 'http://143.198.214.90/:path*', // Your local API server
        },
      ];
    }
    
    // In production, return an empty array (no rewrites)
    return [];
  },
};

export default nextConfig;

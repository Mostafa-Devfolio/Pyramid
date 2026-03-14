import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    dangerouslyAllowLocalIP: true,
    domains: ['pyramids.devfolio.net'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'pyramid.devfolio.net',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'pyramids.devfolio.net',
        pathname: '/uploads/**',
      },
    ],
  },
};

export default nextConfig;

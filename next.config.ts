import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['maps.googleapis.com'], // <-- Add this
  },
  experimental: {
    globalNotFound: true,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'leaflet.markercluster': 'leaflet.markercluster/dist/leaflet.markercluster-src.js',
    };
    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

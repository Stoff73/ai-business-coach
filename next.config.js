/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["ai"],
  },
  // Enable static exports for better performance
  output: "standalone",
  // Optimize images
  images: {
    domains: ["placeholder.svg"],
    unoptimized: true,
  },
  // Environment variables that should be available on client
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig

const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode
  reactStrictMode: true,

  // Image optimization
  images: {
    domains: ["cf.geekdo-images.com"],
  },

  // File extensions for pages
  pageExtensions: ["tsx", "ts", "jsx", "js"],

  // Webpack configuration
  webpack: config => {
    // Add path aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "src"),
    };
    return config;
  },

  // Output directory for the build
  distDir: ".next",

  // Disable TypeScript type checking during build (can be enabled for production)
  typescript: {
    ignoreBuildErrors: false,
  },

  // Disable ESLint during build (can be enabled for production)
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;

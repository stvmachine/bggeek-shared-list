const path = require("path");

module.exports = {
  images: {
    domains: ["cf.geekdo-images.com"],
  },
  // Configure Next.js to use src/pages directory
  pageExtensions: ["tsx", "ts", "jsx", "js"],
  experimental: {
    appDir: false,
  },
  swcMinify: false,
  // Override the pages directory to use src/pages
  webpack: config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "src"),
    };
    return config;
  },
  // Tell Next.js where to find pages
  distDir: ".next",
};

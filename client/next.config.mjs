/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["server.blogify.pankri.com", "localhost"],
  },
  experimental: {
    optimizeCss: true, // Enable CSS optimization
  },
  webpack(config) {
    // Ensure proper handling of CSS and JS files
    config.optimization.splitChunks = {
      chunks: 'all',
    };
    return config;
  },
};

export default nextConfig;

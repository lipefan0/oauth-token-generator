/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [];
  },
  // Suporte ao App Router
  experimental: {
    appDir: true
  },
  // Otimizações de imagem
  images: {
    domains: [],
    unoptimized: true
  }
};

module.exports = nextConfig;
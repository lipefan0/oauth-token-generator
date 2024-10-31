/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        {
          source: '/callback',
          destination: 'http://localhost:8080/callback',
        },
      ];
    },
  }
  
  module.exports = nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  async redirects() {
    return [
      {
        source: '/callback',
        has: [
          {
            type: 'query',
            key: 'code',
          },
        ],
        permanent: false,
        destination: '/?code=:code&state=:state',
      },
    ];
  },
};

module.exports = nextConfig;
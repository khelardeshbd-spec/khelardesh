/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['www.sofascore.com'],
  },
  // Allow serving from /public/media/
  async headers() {
    return [
      {
        source: '/media/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;

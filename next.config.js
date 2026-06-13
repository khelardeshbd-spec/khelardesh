/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.r2.dev',
      },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ['@max-xoo/fotmob'],
  },
}
module.exports = nextConfig

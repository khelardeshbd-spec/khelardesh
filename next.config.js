/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    runtime: 'edge',
  },
  images: {
    domains: ['pub-YOUR_R2_ACCOUNT.r2.dev'],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        http: false,
        https: false,
        'node:http': false,
        'node:https': false,
        querystring: false,
        'node:querystring': false,
        vm: false,
        'node:vm': false,
        fs: false,
        'node:fs': false,
        path: false,
        'node:path': false,
        dns: false,
        'node:dns': false,
        'util/types': false,
        'node:util/types': false,
      };

      config.resolve.alias = {
        ...config.resolve.alias,
        'crypto': require.resolve('crypto-browserify'),
        'node:crypto': require.resolve('crypto-browserify'),
        'stream': require.resolve('stream-browserify'),
        'node:stream': require.resolve('stream-browserify'),
      };

      const nodeBuiltinMap = {
        'net': 'commonjs node:net',
        'node:net': 'commonjs node:net',
        'tls': 'commonjs node:tls',
        'node:tls': 'commonjs node:tls',
      };
      config.externals = [...(config.externals || []), nodeBuiltinMap];
    }
    return config;
  },


}

module.exports = nextConfig



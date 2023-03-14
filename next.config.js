/* eslint-disable @typescript-eslint/no-var-requires */
const { i18n } = require('./next-i18next.config');

module.exports = {
  i18n,
  devIndicators: {},
  publicRuntimeConfig: {
    // Available on both server and client
    theme: 'DEFAULT',
    currency: 'VND',
  },
  distDir: process.env.NODE_ENV === 'production' ? 'build' : '.next',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        // FIXME
        pathname: '/NutriboxCDN/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/api/auth/signin',
        destination: '/login',
        permanent: true,
      },
    ];
  },
};

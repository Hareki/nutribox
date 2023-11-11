/* eslint-disable @typescript-eslint/no-var-requires */
const { i18n } = require('./next-i18next.config');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  i18n,
  devIndicators: {},
  publicRuntimeConfig: {
    // Available on both server and client
    theme: 'DEFAULT',
    currency: 'VND',
  },
  // distDir: process.env.NODE_ENV === 'production' ? '.next' : '.dev',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
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
  /**
   * @param {import('webpack').Configuration} config
   * @returns {import('webpack').Configuration}
   */
  webpack: (config) => {
    const originalEntry = config.entry;
    config.entry = async () => {
      const entries = await originalEntry();

      // entries['main.js'] is the starting point of the project
      if (
        entries['main.js'] &&
        !entries['main.js'].includes('./src/polyfills.ts')
      ) {
        entries['main.js'].unshift('./src/polyfills.ts');
      }

      return entries;
    };

    if (config.resolve.plugins) {
      config.resolve.plugins.push(new TsconfigPathsPlugin());
    } else {
      config.resolve.plugins = [new TsconfigPathsPlugin()];
    }

    return config;
  },
};

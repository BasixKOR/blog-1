/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...config.externals, 'puppeteer', 'puppeteer-core'];
    }

    // Ignore source map files
    config.module.rules.push({
      test: /\.js\.map$/,
      loader: 'ignore-loader',
    });

    // Add alias for puppeteer modules
    config.resolve.alias = {
      ...config.resolve.alias,
      'puppeteer/lib/cjs/puppeteer/common/Browser':
        'puppeteer-core/lib/cjs/puppeteer/common/Browser',
      'puppeteer/lib/cjs/puppeteer/common/Page': 'puppeteer-core/lib/cjs/puppeteer/common/Page',
      'puppeteer/lib/cjs/puppeteer/common/FrameManager':
        'puppeteer-core/lib/cjs/puppeteer/common/FrameManager',
      'puppeteer/lib/cjs/puppeteer/common/JSHandle':
        'puppeteer-core/lib/cjs/puppeteer/common/JSHandle',
    };

    return config;
  },
};

module.exports = nextConfig;

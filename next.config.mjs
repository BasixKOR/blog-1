import createMDX from '@next/mdx';
import rehypePrettyCode from 'rehype-pretty-code';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';

import postsData from './src/databases/legacy-posts.json' assert { type: 'json' };

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm, remarkFrontmatter, [remarkMdxFrontmatter, { name: 'metadata' }]],
    rehypePlugins: [rehypePrettyCode],
  },
});

export default withMDX({
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  swcMinify: true,
  reactStrictMode: true,
  poweredByHeader: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  redirects() {
    const posts = postsData.posts;
    const redirectPosts = posts.map((post) => ({
      source: `/${post.id}`,
      destination: `/${post.date.split('.')[0]}/${post.id}`,
      permanent: true,
    }));

    return [...redirectPosts];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        port: '',
      },
    ],
  },
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
});

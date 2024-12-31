/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    // SVG loader configuration
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },

  // Dangerously allow production builds to successfully complete even if
  // your project has type errors.
  typescript: {
      ignoreBuildErrors: true,
  },

  // ...other config
};

module.exports = nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/a/**',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'platform-lookaside.fbsbx.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_BLOB_HOSTNAME || 'nytsrwjmwiiyaxlb.public.blob.vercel-storage.com', // Updated hostname
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        pathname: '/**',
      }
    ],
    domains: [
      'nytsrwjmwiiyaxlb.public.blob.vercel-storage.com', // Add Vercel Blob Storage domain
      'firebasestorage.googleapis.com', // Also add Firebase Storage domain for completeness
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    unoptimized: false,
    minimumCacheTTL: 60
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.(mp4|webm)$/,
      use: {
        loader: 'file-loader',
        options: {
          publicPath: '/_next/static/videos/',
          outputPath: 'static/videos/',
          name: '[name].[hash].[ext]',
        },
      },
    });

    // Remove the previous fallback attempt
    // if (!config.resolve.fallback) {
    //   config.resolve.fallback = {};
    // }
    // config.resolve.fallback.process = require.resolve('process/browser');

    // Use ProvidePlugin to polyfill 'process' globally for dependencies
    const webpack = require('webpack'); // Import webpack
    config.plugins.push(
      new webpack.ProvidePlugin({
        process: 'process/browser',
      })
    );

    return config;
  },
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Define server-side runtime configuration
  serverRuntimeConfig: {
    // Will be available on the server-side ONLY
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_ADMIN_CLIENT_EMAIL: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    FIREBASE_ADMIN_PRIVATE_KEY: process.env.FIREBASE_ADMIN_PRIVATE_KEY,
    WEBHOOK_URL: process.env.WEBHOOK_URL,
  },
  // Public runtime config is generally discouraged for security reasons
  // publicRuntimeConfig: {},
};

module.exports = nextConfig;

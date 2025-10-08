/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig = {
  transpilePackages: ['@stackframe/stack', '@stackframe/stack-shared', 'oauth4webapi'],
  images: {
    domains: ['images.unsplash.com', 'blob.vercel-storage.com'],
    unoptimized: true, // For local logo files
  },
  webpack: (config) => {
    // Handle ES modules
    config.resolve.extensionAlias = {
      '.js': ['.js', '.ts', '.tsx'],
    };
    
    return config;
  },
}

module.exports = withPWA(nextConfig)

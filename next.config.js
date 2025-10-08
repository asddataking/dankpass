/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@stackframe/stack', '@stackframe/stack-shared', 'oauth4webapi'],
  images: {
    domains: ['images.unsplash.com', 'blob.vercel-storage.com'],
  },
  webpack: (config) => {
    // Handle ES modules
    config.resolve.extensionAlias = {
      '.js': ['.js', '.ts', '.tsx'],
    };
    
    return config;
  },
}

module.exports = nextConfig

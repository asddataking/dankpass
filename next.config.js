/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@stackframe/stack'],
  images: {
    domains: ['images.unsplash.com', 'blob.vercel-storage.com'],
  },
}

module.exports = nextConfig

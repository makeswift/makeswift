const createWithMakeswift = require('@makeswift/runtime/next/plugin')

const withMakeswift = createWithMakeswift()

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.contentstack.io',
      },
      {
        protocol: 'https',
        hostname: 'eu-images.contentstack.com',
      },
      {
        protocol: 'https',
        hostname: 'azure-na-images.contentstack.com',
      },
      {
        protocol: 'https',
        hostname: 'azure-eu-images.contentstack.com',
      },
      {
        protocol: 'https',
        hostname: 'gcp-na-images.contentstack.com',
      },
    ],
  },
}

module.exports = withMakeswift(nextConfig)
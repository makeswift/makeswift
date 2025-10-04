const createWithMakeswift = require('@makeswift/runtime/next/plugin')

const withMakeswift = createWithMakeswift()

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // Include your remote patterns here
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
      },
    ],
  },
}

module.exports = withMakeswift(nextConfig)

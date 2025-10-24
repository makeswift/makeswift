const createWithMakeswift = require('@makeswift/runtime/next/plugin')

const withMakeswift = createWithMakeswift()

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.ctfassets.net',
      },
    ],
  },
}

module.exports = withMakeswift(nextConfig)

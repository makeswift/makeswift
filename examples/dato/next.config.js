const withMakeswift = require('@makeswift/runtime/next/plugin')()

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.datocms-assets.com',
      },
    ],
  },
}

module.exports = withMakeswift(nextConfig)

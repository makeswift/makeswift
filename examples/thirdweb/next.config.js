/** @type {import('next').NextConfig} */

const withMakeswift = require("@makeswift/runtime/next/plugin")()

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["gateway.ipfscdn.io"],
  },
}

module.exports = withMakeswift(nextConfig)

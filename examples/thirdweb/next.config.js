/** @type {import('next').NextConfig} */

const withMakeswift = require('@makeswift/runtime/next/plugin')()

const nextConfig = {
  reactStrictMode: true,
}

module.exports = withMakeswift(nextConfig)

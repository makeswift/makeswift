/** @type {import('next').NextConfig} */

const withMakeswift = require('@makeswift/runtime/next/plugin')()

module.exports = withMakeswift({
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['cdn11.bigcommerce.com'],
  },
})

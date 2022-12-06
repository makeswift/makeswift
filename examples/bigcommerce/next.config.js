const withMakeswift = require('@makeswift/runtime/next/plugin')()
const { i18n } = require('./next-i18next.config')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['cdn11.bigcommerce.com'],
  },
  i18n,
}

module.exports = withMakeswift(nextConfig)

const withMakeswift = require('@makeswift/runtime/next/plugin')()
const { i18n } = require('./next-i18next.config')

const withPWA = require('next-pwa')({
  dest: 'public',
  cacheOnFrontEndNav: true,
  fallbacks: {
    image: '/fallback/image.png',
  },
  disable: process.env.NODE_ENV !== 'production',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['cdn11.bigcommerce.com'],
  },
  i18n,
}

module.exports = withMakeswift(withPWA(nextConfig))

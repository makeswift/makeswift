/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['cdn11.bigcommerce.com'],
  },
}

module.exports = nextConfig

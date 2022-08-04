const withMakeswift = require("@makeswift/runtime/next/plugin")();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["cdn.shopify.com"],
  },
};

module.exports = withMakeswift(nextConfig);

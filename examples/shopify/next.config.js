const withMakeswift = require("@makeswift/runtime/next/plugin")();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["cdn.shopify.com"],
  },
};

module.exports = withMakeswift(nextConfig);

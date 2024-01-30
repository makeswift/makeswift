import createWithMakeswift from '@makeswift/runtime/next/plugin'

const withMakeswift = createWithMakeswift()

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

export default withMakeswift(nextConfig)

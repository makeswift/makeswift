import createWithMakeswift from '@makeswift/runtime/next/plugin'

const withMakeswift = createWithMakeswift()

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['en-US', 'fr-FR', 'it-IT'],
    defaultLocale: 'en-US',
  },
}

export default withMakeswift(nextConfig)

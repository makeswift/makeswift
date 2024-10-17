import createWithMakeswift from '@makeswift/runtime/next/plugin'

const withMakeswift = createWithMakeswift()

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['en-US', 'fr-FR'],
    defaultLocale: 'en-US',
    domains: [
      {
        domain: 'pages.agurtovoy.work',
        defaultLocale: 'en-US',
      },
      {
        domain: 'pages-fr.agurtovoy.work',
        defaultLocale: 'fr-FR',
      },
    ],
  },
}

export default withMakeswift(nextConfig)

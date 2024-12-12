import { MAKESWIFT_SITE_API_KEY } from '@/makeswift/env'
import { MakeswiftApiHandler } from '@makeswift/runtime/next/server'

const handler = MakeswiftApiHandler(MAKESWIFT_SITE_API_KEY, {
  apiOrigin: process.env.MAKESWIFT_API_ORIGIN,
  appOrigin: process.env.MAKESWIFT_APP_ORIGIN,
  getFonts() {
    return [
      {
        family: 'var(--font-grenze-gotisch)',
        label: 'Grenze Gotisch',
        variants: [
          {
            weight: '400',
            style: 'normal',
          },
          {
            weight: '500',
            style: 'normal',
          },
          {
            weight: '700',
            style: 'normal',
          },
          {
            weight: '900',
            style: 'normal',
          },
        ],
      },
      {
        family: 'var(--font-grenze)',
        label: 'Grenze',
        variants: [
          {
            weight: '400',
            style: 'normal',
          },
          {
            weight: '500',
            style: 'normal',
          },
          {
            weight: '700',
            style: 'normal',
          },
        ],
      },
    ]
  },
})

export { handler as GET, handler as POST }

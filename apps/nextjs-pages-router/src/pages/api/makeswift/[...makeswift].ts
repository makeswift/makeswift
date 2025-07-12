import { MAKESWIFT_SITE_API_KEY } from '@/makeswift/env'
import { runtime } from '@/makeswift/runtime'
import { MakeswiftApiHandler } from '@makeswift/runtime/next/server'

export default MakeswiftApiHandler(MAKESWIFT_SITE_API_KEY, {
  runtime,
  apiOrigin: process.env.NEXT_PUBLIC_MAKESWIFT_API_ORIGIN,
  appOrigin: process.env.NEXT_PUBLIC_MAKESWIFT_APP_ORIGIN,
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

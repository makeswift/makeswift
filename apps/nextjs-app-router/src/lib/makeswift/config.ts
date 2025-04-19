import { type MakeswiftConfig } from '@makeswift/runtime'
import { runtime } from '@/lib/makeswift/runtime'

export const config: MakeswiftConfig = {
  runtime,
  apiKey: process.env.MAKESWIFT_SITE_API_KEY,
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
}

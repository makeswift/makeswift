import { MAKESWIFT_SITE_API_KEY } from '@/makeswift/env'
import { runtime } from '@/makeswift/runtime'
import { MakeswiftApiHandler } from '@makeswift/runtime/next/server'

// This import is required for the Smartling integration.
// To translate a page, we need to iterate the component data finding all translatable strings.
// Without control definitions, we can't traverse the component data.
// Importing components here allows us to get translatable strings and merge them back once they are translated.
import '@/makeswift/components'

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

import { MakeswiftApiHandler } from '@makeswift/runtime/next/server'
import { strict } from 'assert'

strict(process.env.MAKESWIFT_SITE_API_KEY)

export default MakeswiftApiHandler(process.env.MAKESWIFT_SITE_API_KEY, {
  getFonts() {
    return [
      {
        family: 'var(--font-inter)',
        label: 'Inter',
        variants: [
          { weight: '300', style: 'normal' },
          { weight: '300', style: 'italic' },
          { weight: '400', style: 'normal' },
          { weight: '400', style: 'italic' },
          { weight: '700', style: 'normal' },
          { weight: '800', style: 'normal' },
        ],
      },
    ]
  },
})

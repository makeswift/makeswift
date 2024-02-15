import { Makeswift } from '@makeswift/runtime/next'

import { runtime } from '@/makeswift/runtime'
import { MAKESWIFT_SITE_API_KEY } from '@/makeswift/env'

export const client = new Makeswift(MAKESWIFT_SITE_API_KEY, {
  runtime,
  apiOrigin: process.env.MAKESWIFT_API_ORIGIN,
})

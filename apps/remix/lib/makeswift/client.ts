import { Makeswift } from '@makeswift/runtime/remix'

import { runtime } from './runtime'
import { MAKESWIFT_SITE_API_KEY } from './env'

export const client = new Makeswift(MAKESWIFT_SITE_API_KEY, {
  runtime,
  apiOrigin: process.env.NEXT_PUBLIC_MAKESWIFT_API_ORIGIN,
})

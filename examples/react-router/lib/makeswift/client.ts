import { Makeswift } from '@makeswift/react-router'

import { MAKESWIFT_SITE_API_KEY } from './env'
import { runtime } from './runtime'

export const client = new Makeswift(MAKESWIFT_SITE_API_KEY, {
  runtime,
  apiOrigin: process.env.NEXT_PUBLIC_MAKESWIFT_API_ORIGIN,
})

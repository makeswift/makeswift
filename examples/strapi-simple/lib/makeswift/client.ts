import { Makeswift } from '@makeswift/runtime/next'

import { runtime } from './runtime'
import { env } from '@/env'

export const client = new Makeswift(env.MAKESWIFT_SITE_API_KEY, {
  runtime,
})

import { Makeswift } from '@makeswift/runtime/next'

import { env } from '@/env'

import { runtime } from './runtime'

export const client = new Makeswift(env.MAKESWIFT_SITE_API_KEY, {
  runtime,
})

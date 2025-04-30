import { Makeswift } from '@makeswift/runtime/next'
import { strict } from 'assert'
import { env } from 'env'

import { runtime } from './runtime'

strict(env.MAKESWIFT_SITE_API_KEY, 'MAKESWIFT_SITE_API_KEY is required')

export const client = new Makeswift(env.MAKESWIFT_SITE_API_KEY, {
  runtime: runtime,
})

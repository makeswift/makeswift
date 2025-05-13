import { Makeswift } from '@makeswift/remix'
import { runtime } from './runtime'
import { MAKESWIFT_SITE_API_KEY } from './env'

export const client = new Makeswift(MAKESWIFT_SITE_API_KEY, {
  runtime,
  apiOrigin: process.env.MAKESWIFT_API_ORIGIN,
})
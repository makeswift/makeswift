import { Makeswift } from '@makeswift/remix'
import { runtime } from './runtime'
import { MAKESWIFT_SITE_API_KEY, MAKESWIFT_API_ORIGIN } from './env'

console.log({ MAKESWIFT_SITE_API_KEY })
export const client = new Makeswift(MAKESWIFT_SITE_API_KEY, {
  runtime,
  // apiOrigin: MAKESWIFT_API_ORIGIN,
})

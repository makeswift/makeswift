import { Makeswift } from '@makeswift/express-react'

import { MAKESWIFT_API_ORIGIN, MAKESWIFT_SITE_API_KEY } from './env'
import { runtime } from './runtime'

export const client = new Makeswift(MAKESWIFT_SITE_API_KEY, {
  runtime,
  apiOrigin: MAKESWIFT_API_ORIGIN,
})

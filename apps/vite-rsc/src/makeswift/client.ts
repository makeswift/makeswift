import { Makeswift } from '@makeswift/express-react'

import { runtime } from './runtime'
import { MAKESWIFT_SITE_API_KEY } from './env'

export const client = new Makeswift(MAKESWIFT_SITE_API_KEY!, {
  runtime,
  apiOrigin: process.env.VITE_MAKESWIFT_API_ORIGIN,
})

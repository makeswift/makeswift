import { Makeswift } from '@makeswift/runtime/next'
import { strict } from 'assert'

import { runtime } from './runtime'

strict(process.env.MAKESWIFT_SITE_API_KEY)

export const client = new Makeswift(process.env.MAKESWIFT_SITE_API_KEY, { runtime })

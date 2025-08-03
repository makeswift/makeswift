import { createApiHandler } from '@makeswift/runtime/remix'

import { MAKESWIFT_SITE_API_KEY } from 'lib/makeswift/env'
import { runtime } from 'lib/makeswift/runtime'

export const { loader } = createApiHandler(MAKESWIFT_SITE_API_KEY, {
  runtime,
})

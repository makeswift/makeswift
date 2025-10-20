import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    MAKESWIFT_SITE_API_KEY: z.string().min(1),
    SANITY_ACCESS_TOKEN: z.string().min(1),
    SANITY_PROJECT_ID: z.string().min(1),
  },
  runtimeEnv: {
    MAKESWIFT_SITE_API_KEY: process.env.MAKESWIFT_SITE_API_KEY,
    SANITY_ACCESS_TOKEN: process.env.SANITY_ACCESS_TOKEN,
    SANITY_PROJECT_ID: process.env.SANITY_PROJECT_ID,
  },
})

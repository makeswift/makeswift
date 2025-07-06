import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    MAKESWIFT_SITE_API_KEY: z.string().min(1),
    CONTENTFUL_ACCESS_TOKEN: z.string().min(1),
    CONTENTFUL_SPACE_ID: z.string().min(1),
  },
  runtimeEnv: {
    MAKESWIFT_SITE_API_KEY: process.env.MAKESWIFT_SITE_API_KEY,
    CONTENTFUL_ACCESS_TOKEN: process.env.CONTENTFUL_ACCESS_TOKEN,
    CONTENTFUL_SPACE_ID: process.env.CONTENTFUL_SPACE_ID,
  },
})

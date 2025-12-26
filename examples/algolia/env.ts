import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    MAKESWIFT_SITE_API_KEY: z.string().min(1),
    ALGOLIA_SITE_VERIFICATION: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_ALGOLIA_APP_ID: z.string().min(1),
    NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY: z.string().min(1),
    NEXT_PUBLIC_ALGOLIA_INDEX_NAME: z.string().optional(),
    NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  },
  runtimeEnv: {
    MAKESWIFT_SITE_API_KEY: process.env.MAKESWIFT_SITE_API_KEY,
    ALGOLIA_SITE_VERIFICATION: process.env.ALGOLIA_SITE_VERIFICATION,
    NEXT_PUBLIC_ALGOLIA_APP_ID: process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY: process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY,
    NEXT_PUBLIC_ALGOLIA_INDEX_NAME: process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },
})

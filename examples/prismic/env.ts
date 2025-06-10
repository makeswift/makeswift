import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    PRISMIC_REPOSITORY_NAME: z.string(),
    MAKESWIFT_SITE_API_KEY: z.string(),
  },
  client: {
    NEXT_PUBLIC_PRISMIC_API_TOKEN: z.string(),
  },
  runtimeEnv: {
    PRISMIC_REPOSITORY_NAME: process.env.PRISMIC_REPOSITORY_NAME,
    NEXT_PUBLIC_PRISMIC_API_TOKEN: process.env.NEXT_PUBLIC_PRISMIC_API_TOKEN,
    MAKESWIFT_SITE_API_KEY: process.env.MAKESWIFT_SITE_API_KEY,
  },
})

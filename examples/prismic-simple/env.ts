import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  client: {
    NEXT_PUBLIC_SITE_URL: z.string().min(1),
  },
  server: {
    PRISMIC_REPOSITORY_NAME: z.string().min(1),
    PRISMIC_ACCESS_TOKEN: z.string().min(1),
    MAKESWIFT_SITE_API_KEY: z.string().min(1),
  },
  runtimeEnv: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    PRISMIC_REPOSITORY_NAME: process.env.PRISMIC_REPOSITORY_NAME,
    PRISMIC_ACCESS_TOKEN: process.env.PRISMIC_ACCESS_TOKEN,
    MAKESWIFT_SITE_API_KEY: process.env.MAKESWIFT_SITE_API_KEY,
  },
})

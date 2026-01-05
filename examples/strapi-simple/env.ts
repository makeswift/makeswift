import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  client: {
    NEXT_PUBLIC_SITE_URL: z.string().min(1),
    NEXT_PUBLIC_STRAPI_SERVER_URL: z.string().min(1),
  },
  server: {
    MAKESWIFT_SITE_API_KEY: z.string().min(1),
    STRAPI_ACCESS_TOKEN: z.string().min(1),
  },
  runtimeEnv: {
    MAKESWIFT_SITE_API_KEY: process.env.MAKESWIFT_SITE_API_KEY,
    STRAPI_ACCESS_TOKEN: process.env.STRAPI_ACCESS_TOKEN,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_STRAPI_SERVER_URL: process.env.NEXT_PUBLIC_STRAPI_SERVER_URL,
  },
})

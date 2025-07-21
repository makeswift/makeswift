import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    MAKESWIFT_SITE_API_KEY: z.string().min(1),
    STRAPI_ACCESS_TOKEN: z.string().min(1),
    STRAPI_SERVER_DOMAIN: z.string().min(1),
  },
  runtimeEnv: {
    MAKESWIFT_SITE_API_KEY: process.env.MAKESWIFT_SITE_API_KEY,
    STRAPI_ACCESS_TOKEN: process.env.STRAPI_ACCESS_TOKEN,
    STRAPI_SERVER_DOMAIN: process.env.STRAPI_SERVER_DOMAIN,
  },
})

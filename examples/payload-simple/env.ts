import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  client: {
    NEXT_PUBLIC_PAYLOAD_SERVER_DOMAIN: z.string().min(1),
    NEXT_PUBLIC_SITE_URL: z.string().min(1),
  },
  server: {
    MAKESWIFT_SITE_API_KEY: z.string().min(1),
    PAYLOAD_ACCESS_TOKEN: z.string().min(1),
    PAYLOAD_USER_SLUG: z.string().min(1),
  },
  runtimeEnv: {
    MAKESWIFT_SITE_API_KEY: process.env.MAKESWIFT_SITE_API_KEY,
    PAYLOAD_ACCESS_TOKEN: process.env.PAYLOAD_ACCESS_TOKEN,
    PAYLOAD_USER_SLUG: process.env.PAYLOAD_USER_SLUG,
    NEXT_PUBLIC_PAYLOAD_SERVER_DOMAIN: process.env.NEXT_PUBLIC_PAYLOAD_SERVER_DOMAIN,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },
})

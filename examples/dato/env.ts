import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    MAKESWIFT_SITE_API_KEY: z.string().min(1),
  },

  client: {
    NEXT_PUBLIC_DATO_CMS_API_TOKEN: z.string().min(1),
  },

  runtimeEnv: {
    MAKESWIFT_SITE_API_KEY: process.env.MAKESWIFT_SITE_API_KEY,
    NEXT_PUBLIC_DATO_CMS_API_TOKEN: process.env.NEXT_PUBLIC_DATO_CMS_API_TOKEN,
  },
})

import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    MAKESWIFT_SITE_API_KEY: z.string().min(1),
    DATO_CMS_API_TOKEN: z.string().min(1),
  },

  runtimeEnv: {
    MAKESWIFT_SITE_API_KEY: process.env.MAKESWIFT_SITE_API_KEY,
    DATO_CMS_API_TOKEN: process.env.DATO_CMS_API_TOKEN,
  },
})

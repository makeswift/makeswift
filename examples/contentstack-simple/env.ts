import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  client: {
    NEXT_PUBLIC_SITE_URL: z.string().min(1),
  },
  server: {
    MAKESWIFT_SITE_API_KEY: z.string().min(1),
    CONTENTSTACK_API_KEY: z.string().min(1),
    CONTENTSTACK_DELIVERY_TOKEN: z.string().min(1),
    CONTENTSTACK_ENVIRONMENT: z.string().min(1),
    CONTENTSTACK_REGION: z.enum(['US', 'EU', 'AZURE_NA', 'AZURE_EU', 'GCP_NA']).default('US'),
  },
  runtimeEnv: {
    MAKESWIFT_SITE_API_KEY: process.env.MAKESWIFT_SITE_API_KEY,
    CONTENTSTACK_API_KEY: process.env.CONTENTSTACK_API_KEY,
    CONTENTSTACK_DELIVERY_TOKEN: process.env.CONTENTSTACK_DELIVERY_TOKEN,
    CONTENTSTACK_ENVIRONMENT: process.env.CONTENTSTACK_ENVIRONMENT,
    CONTENTSTACK_REGION: process.env.CONTENTSTACK_REGION,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },
})

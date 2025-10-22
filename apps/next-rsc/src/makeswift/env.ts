import { strict } from 'node:assert'

strict(
  process.env.MAKESWIFT_SITE_API_KEY,
  '"MAKESWIFT_SITE_API_KEY" environment variable must be set.',
)

export const MAKESWIFT_SITE_API_KEY = process.env.MAKESWIFT_SITE_API_KEY

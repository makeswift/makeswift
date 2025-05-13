// Ensure this environment variable is set in your .env file
export const MAKESWIFT_SITE_API_KEY = process.env.MAKESWIFT_SITE_API_KEY || ''

if (!MAKESWIFT_SITE_API_KEY) {
  console.warn('MAKESWIFT_SITE_API_KEY environment variable not set')
}
// For Remix with Vite, we need to handle environment variables differently in client vs server
const isBrowser = typeof window !== 'undefined'

// Ensure this environment variable is set in your .env file
export const MAKESWIFT_SITE_API_KEY = isBrowser
  ? import.meta.env.VITE_MAKESWIFT_SITE_API_KEY || ''
  : process.env.MAKESWIFT_SITE_API_KEY || ''

// API and APP origins
export const MAKESWIFT_API_ORIGIN = isBrowser
  ? import.meta.env.VITE_MAKESWIFT_API_ORIGIN || 'https://api.makeswift.com'
  : process.env.MAKESWIFT_API_ORIGIN || 'https://api.makeswift.com'

export const MAKESWIFT_APP_ORIGIN = isBrowser
  ? import.meta.env.VITE_MAKESWIFT_APP_ORIGIN || 'https://app.makeswift.com'
  : process.env.MAKESWIFT_APP_ORIGIN || 'https://app.makeswift.com'

// Only log warning in development
if (!MAKESWIFT_SITE_API_KEY && (
  isBrowser 
    ? import.meta.env.DEV 
    : process.env.NODE_ENV === 'development'
)) {
  console.warn('MAKESWIFT_SITE_API_KEY environment variable not set')
}
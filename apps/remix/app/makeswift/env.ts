/**
 * Environment variables for Makeswift integration
 */

// The Makeswift API key for your site
export const MAKESWIFT_SITE_API_KEY = process.env.MAKESWIFT_SITE_API_KEY || 'YOUR_MAKESWIFT_SITE_API_KEY';

// The secret used to enable preview mode
export const MAKESWIFT_PREVIEW_SECRET = process.env.MAKESWIFT_PREVIEW_SECRET || 'preview-secret';

// The secret used for revalidation webhooks
export const MAKESWIFT_REVALIDATION_SECRET = process.env.MAKESWIFT_REVALIDATION_SECRET || 'revalidation-secret';

// Optional custom API origin
export const MAKESWIFT_API_ORIGIN = process.env.MAKESWIFT_API_ORIGIN;
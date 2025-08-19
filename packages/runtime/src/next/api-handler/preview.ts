export const PRERENDER_BYPASS_COOKIE = '__prerender_bypass'
export const PREVIEW_DATA_COOKIE = '__next_preview_data'

export const MAKESWIFT_SITE_VERSION_COOKIE = 'makeswift-site-version'

export const SearchParams = {
  PreviewToken: 'x-makeswift-preview-token',

  // Search params from rewrite-matching that are automatically added in Vercel.
  // These are a quirk of next.config.ts rewrite rules in Next.js when deployed
  // to Vercel.
  PreviewTokenMatch: 'mswftPreviewToken',
  OriginalPathMatch: 'mswftOriginalPath',
  RedirectDestinationMatch: 'mswftRedirectDestination',
} as const

export { MAKESWIFT_SITE_VERSION_COOKIE, SearchParams } from '../../api-handler/preview'

export const PRERENDER_BYPASS_COOKIE = '__prerender_bypass'
export const PREVIEW_DATA_COOKIE = '__next_preview_data'

// When there's a rewrite rule match, the matching values are included as query
// parameters in the request URL, where the parameter name is the expression
// used to match the value in the next.config. This behavior is typically
// observed on projects deployed to Vercel. We keep track of these param names
// so we can remove them in any subsequent redirects. Ideally, we can remove
// this behavior altogether when we no longer rely on rewrites, or use something
// like middleware.
//
// See:
// https://nextjs.org/docs/app/api-reference/config/next-config-js/rewrites#rewrite-parameters
export const RewriteRuleMatches = {
  PreviewToken: 'makeswiftRewritePreviewToken',
  OriginalPath: 'makeswiftRewriteOriginalPath',
} as const

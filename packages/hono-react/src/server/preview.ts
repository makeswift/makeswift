import { type Context, type MiddlewareHandler, type Next } from 'hono'
import { setCookie } from 'hono/cookie'

import {
  type SiteVersion,
  MAKESWIFT_SITE_VERSION_COOKIE,
  REDIRECT_SEARCH_PARAM,
  cookieSettingOptions,
  MakeswiftClient,
  redirectLiveHandler,
  SearchParams,
  secondsUntilSiteVersionExpiration,
  serializeSiteVersion,
} from '@makeswift/runtime/unstable-framework-support'

async function requestedSiteVersion({
  searchParams,
  client,
}: {
  searchParams: URLSearchParams
  client: MakeswiftClient
}): Promise<SiteVersion | null> {
  const previewToken = searchParams.get(SearchParams.PreviewToken)
  if (previewToken == null) return null

  const verifiedToken = await client.readPreviewToken(previewToken)
  if (verifiedToken == null) return null

  const { payload } = verifiedToken

  return { version: payload.version, token: previewToken }
}

export function createPreviewMiddleware({
  client,
}: {
  client: MakeswiftClient
}): MiddlewareHandler {
  return async function apiHandler(c: Context, next: Next): Promise<Response | void> {
    const { pathname, searchParams } = new URL(c.req.url, `https://example.com`)

    const redirectLive = searchParams.get(REDIRECT_SEARCH_PARAM)
    if (redirectLive != null) {
      return await redirectLiveHandler(c.req.raw, {
        previewCookieNames: [MAKESWIFT_SITE_VERSION_COOKIE],
      })
    }

    const siteVersion = await requestedSiteVersion({ searchParams, client })
    if (siteVersion == null) return next()

    const serializedSiteVersion = serializeSiteVersion(siteVersion)
    const secondsUntilExpiration = secondsUntilSiteVersionExpiration(siteVersion)

    setCookie(c, MAKESWIFT_SITE_VERSION_COOKIE, serializedSiteVersion, {
      ...cookieSettingOptions,
      maxAge: secondsUntilExpiration,
    })

    return c.redirect(pathname)
  }
}

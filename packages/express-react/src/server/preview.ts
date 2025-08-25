import {
  type Request as ExpressRequest,
  type Response as ExpressResponse,
  type RequestHandler,
  type NextFunction,
} from 'express'

import {
  type SiteVersion,
  MAKESWIFT_SITE_VERSION_COOKIE,
  REDIRECT_SEARCH_PARAM,
  cookieSettingOptions,
  MakeswiftClient,
  pipeResponseTo,
  redirectLiveHandler,
  SearchParams,
  secondsUntilSiteVersionExpiration,
  serializeSiteVersion,
  toApiRequest,
} from '@makeswift/runtime/framework-support'

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

export function createPreviewMiddleware({ client }: { client: MakeswiftClient }): RequestHandler {
  return async function apiHandler(req: ExpressRequest, res: ExpressResponse, next: NextFunction) {
    const { pathname, searchParams } = new URL(req.url, `https://example.com`)

    const redirectLive = searchParams.get(REDIRECT_SEARCH_PARAM)
    if (redirectLive != null) {
      return pipeResponseTo(
        await redirectLiveHandler(toApiRequest(req), {
          previewCookieNames: [MAKESWIFT_SITE_VERSION_COOKIE],
        }),
        res,
      )
    }

    const siteVersion = await requestedSiteVersion({ searchParams, client })
    if (siteVersion == null) return next()

    const serializedSiteVersion = serializeSiteVersion(siteVersion)
    const secondsUntilExpiration = secondsUntilSiteVersionExpiration(siteVersion)

    res.cookie(MAKESWIFT_SITE_VERSION_COOKIE, serializedSiteVersion, {
      ...cookieSettingOptions,
      maxAge: secondsUntilExpiration,
    })

    return res.redirect(pathname)
  }
}

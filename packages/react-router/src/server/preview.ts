import { redirect, createCookie } from 'react-router'

import {
  type SiteVersion,
  MAKESWIFT_SITE_VERSION_COOKIE,
  REDIRECT_SEARCH_PARAM,
  SET_COOKIE_HEADER,
  cookieSettingOptions,
  MakeswiftClient,
  serializeSiteVersion,
  secondsUntilSiteVersionExpiration,
  SearchParams,
  redirectLiveHandler,
} from '@makeswift/runtime/unstable-framework-support'

export const siteVersionCookie = createCookie(MAKESWIFT_SITE_VERSION_COOKIE, cookieSettingOptions)

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

type LoaderArgs = { request: Request }
type Loader<T extends LoaderArgs, R> = (args: T) => Promise<Response | R>

export function withMakeswift<T extends LoaderArgs, R>(
  loader: Loader<T, R>,
  { client }: { client: MakeswiftClient },
): Loader<T, R> {
  return async function withMakeswiftLoader(args: T): Promise<Response | R> {
    const { origin, pathname, searchParams } = new URL(args.request.url)

    const redirectLive = searchParams.get(REDIRECT_SEARCH_PARAM)
    if (redirectLive != null) {
      return redirectLiveHandler(args.request, { previewCookieNames: [siteVersionCookie.name] })
    }

    const siteVersion = await requestedSiteVersion({ searchParams, client })
    if (siteVersion == null) return loader(args)

    const serializedSiteVersion = serializeSiteVersion(siteVersion)
    const secondsUntilExpiration = secondsUntilSiteVersionExpiration(siteVersion)

    return redirect(`${origin}${pathname}`, {
      headers: {
        [SET_COOKIE_HEADER]: await siteVersionCookie.serialize(serializedSiteVersion, {
          maxAge: secondsUntilExpiration,
        }),
      },
    })
  }
}

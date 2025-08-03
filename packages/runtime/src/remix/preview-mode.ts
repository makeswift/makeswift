import { MakeswiftSiteVersion } from '../api/site-version'

import { SET_COOKIE_HEADER, cookieSettingOptions } from '../api-handler/cookies'

import { MakeswiftPreviewData, parseMakeswiftPreviewData } from '../next/preview-data'
import { redirect, createCookie } from 'react-router'

export const previewModeCookie = createCookie('x-makeswift-preview-data', cookieSettingOptions)

const SearchParams = {
  PreviewMode: 'x-makeswift-preview-mode',
} as const

async function getPreviewData(request: Request): Promise<MakeswiftPreviewData | null> {
  const previewData = await previewModeCookie.parse(request.headers.get('cookie'))
  return previewData != null ? parseMakeswiftPreviewData(previewData) : null
}

export async function getSiteVersion(request: Request) {
  return (await getPreviewData(request))?.siteVersion ?? MakeswiftSiteVersion.Live
}

export async function getPreviewMode(request: Request) {
  return (await getSiteVersion(request)) === MakeswiftSiteVersion.Working
}

type LoaderArgs = { request: Request }
type Loader<T extends LoaderArgs, R> = (args: T) => Promise<Response | R>

export function withMakeswift<T extends LoaderArgs, R>(
  loader: Loader<T, R>,
  { apiKey }: { apiKey: string },
): Loader<T, R> {
  return async function withMakeswiftLoader(args: T): Promise<Response | R> {
    const { origin, pathname, searchParams } = new URL(args.request.url)

    const secret = searchParams.get(SearchParams.PreviewMode)
    if (secret !== apiKey) return loader(args)

    return redirect(`${origin}${pathname}`, {
      headers: {
        [SET_COOKIE_HEADER]: await previewModeCookie.serialize({
          makeswift: true,
          siteVersion: MakeswiftSiteVersion.Working,
        }),
      },
    })
  }
}

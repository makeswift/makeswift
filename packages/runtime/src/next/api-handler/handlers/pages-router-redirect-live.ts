import { NextApiRequest, NextApiResponse } from 'next'

import { serialize as serializeCookie } from 'cookie'

import { cookieSettingOptions, SET_COOKIE_HEADER } from '../../../api-handler/cookies'

import { PRERENDER_BYPASS_COOKIE, PREVIEW_DATA_COOKIE, SearchParams } from '../preview'
import { pagesRouterGetRequestPath } from './get-request-url'

const previewCookieNames = [PRERENDER_BYPASS_COOKIE, PREVIEW_DATA_COOKIE] as const

export async function pagesRouterRedirectLiveHandler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const pathname = pagesRouterGetRequestPath(req) ?? '/'

  const destinationUrl = new URL(pathname, 'http://test.com')
  destinationUrl.searchParams.delete(SearchParams.RedirectLive)

  const patchedCookies = previewCookieNames.map(name =>
    serializeCookie(name, '', { ...cookieSettingOptions, maxAge: 0, expires: new Date(0) }),
  )
  res.setHeader(SET_COOKIE_HEADER, patchedCookies)

  res.redirect(`${destinationUrl.pathname}?${destinationUrl.searchParams.toString()}`)
}

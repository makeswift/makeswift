import { NextRequest, NextResponse } from 'next/server'

import { serialize as serializeCookie } from 'cookie'

import { cookieSettingOptions, SET_COOKIE_HEADER } from '../../../api-handler/cookies'

import { MAKESWIFT_SITE_VERSION_COOKIE, PRERENDER_BYPASS_COOKIE, SearchParams } from '../preview'
import { appRouterGetRequestUrl } from './get-request-url'

const previewCookieNames = [PRERENDER_BYPASS_COOKIE, MAKESWIFT_SITE_VERSION_COOKIE] as const

export async function appRouterRedirectLiveHandler(
  request: NextRequest,
  _context: any,
): Promise<NextResponse> {
  const redirectUrl = appRouterGetRequestUrl(request)

  redirectUrl.searchParams.delete(SearchParams.RedirectLive)

  const headers = new Headers()
  previewCookieNames.forEach(name => {
    headers.append(
      SET_COOKIE_HEADER,
      serializeCookie(name, '', { ...cookieSettingOptions, expires: new Date(0), maxAge: 0 }),
    )
  })

  return NextResponse.redirect(redirectUrl, { headers })
}

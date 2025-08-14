import { NextRequest, NextResponse } from 'next/server'
import { cookies, draftMode } from 'next/headers'

import { serialize as serializeCookie } from 'cookie'

import { cookieSettingOptions, SET_COOKIE_HEADER } from '../../../api-handler/cookies'
import {
  secondsUntilSiteVersionExpiration,
  serializeSiteVersion,
  type SiteVersion,
} from '../../../api/site-version'

import { MAKESWIFT_SITE_VERSION_COOKIE, PRERENDER_BYPASS_COOKIE, SearchParams } from '../preview'
import { MakeswiftClient } from '../../../client'

export function originalRequestProtocol(request: NextRequest): string | null {
  // The `x-forwarded-proto` header is not formally standardized, but many proxies
  // *append* the protocol used for the request to the existing value. As a result,
  // if the request passes through multiple proxies, the header may contain a
  // comma-separated list of protocols: https://code.djangoproject.com/ticket/33569
  const forwardedProto = request.headers.get('x-forwarded-proto')
  return forwardedProto != null ? forwardedProto.split(',')[0].trim() : null
}

export async function appRouterRedirectPreviewHandler(
  request: NextRequest,
  _context: any,
  client: MakeswiftClient,
): Promise<NextResponse> {
  const previewToken = request.nextUrl.searchParams.get(SearchParams.PreviewToken)

  if (previewToken == null) {
    return new NextResponse('Bad request: no preview token provided', { status: 400 })
  }

  const verificationResult = await client.readPreviewToken(previewToken)

  if (verificationResult == null) {
    return new NextResponse('Failed to verify preview token', { status: 401 })
  }

  const { payload } = verificationResult

  const draft = await draftMode()
  const cookieStore = await cookies()

  draft.enable()

  const prerenderBypassCookie = cookieStore.get(PRERENDER_BYPASS_COOKIE)

  if (prerenderBypassCookie?.value == null) {
    return new NextResponse('Could not retrieve draft mode bypass cookie', { status: 500 })
  }

  const siteVersion: SiteVersion = { version: payload.version, token: previewToken }
  const serializedSiteVersion = serializeSiteVersion(siteVersion)
  const secondsUntilExpiration = secondsUntilSiteVersionExpiration(siteVersion)

  const draftCookies: { name: string; value: string }[] = [
    prerenderBypassCookie,
    { name: MAKESWIFT_SITE_VERSION_COOKIE, value: serializedSiteVersion },
  ]

  const redirectProtocol =
    originalRequestProtocol(request) ?? request.nextUrl.protocol.replace(':', '')

  const redirectHost =
    request.headers.get('x-forwarded-host') ?? request.headers.get('host') ?? request.nextUrl.host

  const redirectUrl = new URL(
    `${redirectProtocol}://${redirectHost}${request.nextUrl.pathname}${request.nextUrl.search}`,
  )

  redirectUrl.searchParams.delete(SearchParams.PreviewToken)

  const headers = new Headers()
  draftCookies.forEach(({ name, value }) => {
    headers.append(
      SET_COOKIE_HEADER,
      serializeCookie(name, value, { ...cookieSettingOptions, maxAge: secondsUntilExpiration }),
    )
  })

  return NextResponse.redirect(redirectUrl, { headers })
}

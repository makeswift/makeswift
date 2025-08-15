import { NextApiRequest, NextApiResponse } from 'next'

import { parse as parseSetCookie } from 'set-cookie-parser'
import { serialize as serializeCookie } from 'cookie'

import { cookieSettingOptions, SET_COOKIE_HEADER } from '../../../api-handler/cookies'

import { PRERENDER_BYPASS_COOKIE, PREVIEW_DATA_COOKIE, SearchParams } from '../preview'
import { MakeswiftClient } from '../../../client'
import {
  secondsUntilSiteVersionExpiration,
  serializeSiteVersion,
  type SiteVersion,
} from '../../../api/site-version'
import { pagesRouterGetRequestPath } from './get-request-url'

export async function pagesRouterRedirectPreviewHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  client: MakeswiftClient,
): Promise<void> {
  const pathname = pagesRouterGetRequestPath(req)

  if (pathname == null) {
    return res
      .status(400)
      .send('Bad request: incoming request does not have an associated pathname')
  }

  const previewToken = req.query[SearchParams.PreviewToken] as string | undefined

  if (previewToken == null) {
    return res.status(400).send('Bad request: no preview token provided')
  }

  const verificationResult = await client.readPreviewToken(previewToken)

  if (verificationResult == null) {
    return res.status(401).send('Failed to verify preview token')
  }

  const { payload } = verificationResult

  const siteVersion: SiteVersion = { version: payload.version, token: previewToken }
  const secondsUntilExpiration = secondsUntilSiteVersionExpiration(siteVersion)
  const serializedSiteVersion = serializeSiteVersion(siteVersion)

  const setCookie = res
    .setPreviewData({ siteVersion: serializedSiteVersion })
    .getHeader(SET_COOKIE_HEADER)

  res.removeHeader(SET_COOKIE_HEADER)

  const parsedCookies = parseSetCookie(Array.isArray(setCookie) ? setCookie : '')

  const prerenderBypassCookie = parsedCookies.find(c => c.name === PRERENDER_BYPASS_COOKIE)
  const previewDataCookie = parsedCookies.find(c => c.name === PREVIEW_DATA_COOKIE)

  if (prerenderBypassCookie?.value == null || previewDataCookie?.value == null) {
    return res.status(500).send('Could not retrieve preview mode cookies')
  }

  const patchedCookies = [prerenderBypassCookie, previewDataCookie].map(({ name, value }) => {
    return serializeCookie(name, value, { ...cookieSettingOptions, maxAge: secondsUntilExpiration })
  })
  res.setHeader(SET_COOKIE_HEADER, patchedCookies)

  const destinationUrl = new URL(pathname, 'http://test.com')
  destinationUrl.searchParams.delete(SearchParams.PreviewToken)

  res.redirect(`${destinationUrl.pathname}?${destinationUrl.searchParams.toString()}`)
}

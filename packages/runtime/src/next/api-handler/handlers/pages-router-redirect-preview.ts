import { NextApiRequest, NextApiResponse } from 'next'

import { parse as parseSetCookie } from 'set-cookie-parser'
import { serialize as serializeCookie } from 'cookie'

import { cookieSettingOptions, SET_COOKIE_HEADER } from '../../../api-handler/cookies'

import { PRERENDER_BYPASS_COOKIE, PREVIEW_DATA_COOKIE, SearchParams } from '../preview'
import { MakeswiftClient } from '../../../client'
import { serializeSiteVersion } from '../../../api/site-version'

export async function pagesRouterRedirectPreviewHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  client: MakeswiftClient,
): Promise<void> {
  // Next.js automatically strips the locale prefix from rewritten request's URL, even when the
  // rewrite's `locale` option is set to `false`: https://github.com/vercel/next.js/discussions/21798.
  // At the same time, it also maps rewrite's URL segments (e.g. `:path`) to query parameters
  // on the rewritten request, so we use `query.path` to recover the original request path.
  const pathname = req.query.path as string | undefined

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

  const siteVersion = serializeSiteVersion({ version: payload.version, token: previewToken })
  const setCookie = res.setPreviewData({ siteVersion }).getHeader(SET_COOKIE_HEADER)
  res.removeHeader(SET_COOKIE_HEADER)

  const parsedCookies = parseSetCookie(Array.isArray(setCookie) ? setCookie : '')

  const prerenderBypassCookie = parsedCookies.find(c => c.name === PRERENDER_BYPASS_COOKIE)
  const previewDataCookie = parsedCookies.find(c => c.name === PREVIEW_DATA_COOKIE)

  if (prerenderBypassCookie?.value == null || previewDataCookie?.value == null) {
    return res.status(500).send('Could not retrieve preview mode cookies')
  }

  const patchedCookies = [prerenderBypassCookie, previewDataCookie].map(({ name, value }) => {
    return serializeCookie(name, value, { ...cookieSettingOptions })
  })
  res.setHeader(SET_COOKIE_HEADER, patchedCookies)

  const destinationUrl = new URL(pathname, 'http://test.com')
  destinationUrl.searchParams.delete(SearchParams.PreviewToken)

  res.redirect(`${destinationUrl.pathname}?${destinationUrl.searchParams.toString()}`)
}

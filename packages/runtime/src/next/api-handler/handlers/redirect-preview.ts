import { NextApiRequest, NextApiResponse } from 'next'

import { parse as parseSetCookie } from 'set-cookie-parser'
import { serialize as serializeCookie } from 'cookie'

import { MakeswiftSiteVersion } from '../../../api/site-version'
import { cookieSettingOptions, SET_COOKIE_HEADER } from '../../../api-handler/cookies'

import { PRERENDER_BYPASS_COOKIE, PREVIEW_DATA_COOKIE, SearchParams } from '../draft'

export async function redirectPreviewHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  { apiKey }: { apiKey: string },
): Promise<void> {
  const secret = req.query[SearchParams.PreviewMode]
  // Next.js automatically strips the locale prefix from rewritten request's URL, even when the
  // rewrite's `locale` option is set to `false`: https://github.com/vercel/next.js/discussions/21798.
  // At the same time, it also maps rewrite's URL segments (e.g. `:path`) to query parameters
  // on the rewritten request, so we use `query.path` to recover the original request path.
  const pathname = req.query.path as string | undefined

  if (secret == null) {
    return res.status(401).send('Unauthorized to enable preview mode: no secret provided')
  }

  if (secret !== apiKey) {
    return res.status(401).send('Unauthorized to enable preview mode: secret is incorrect')
  }

  if (pathname == null) {
    return res
      .status(400)
      .send('Bad request: incoming request does not have an associated pathname')
  }

  const setCookie = res
    // Eventually, we can make the preview data value dynamic using the request
    .setPreviewData({ makeswift: true, siteVersion: MakeswiftSiteVersion.Working })
    .getHeader(SET_COOKIE_HEADER)

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
  destinationUrl.searchParams.delete(SearchParams.PreviewMode)

  res.redirect(`${destinationUrl.pathname}?${destinationUrl.searchParams.toString()}`)
}

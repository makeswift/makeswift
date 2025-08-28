import { NextApiRequest, NextApiResponse } from 'next'
import { NextRequest, NextResponse } from 'next/server'
import { P, match } from 'ts-pattern'

import { parse as parseSetCookie } from 'set-cookie-parser'
import { serialize as serializeCookie } from 'cookie'

import { MakeswiftSiteVersion } from '../../../api/site-version'
import {
  cookieSettingOptions,
  PRERENDER_BYPASS_COOKIE,
  PREVIEW_DATA_COOKIE,
  SearchParams,
  SET_COOKIE_HEADER,
} from './utils/draft'
import { type Context } from '../app-router-handler'

type RedirectPreviewError = string

type Response = unknown

export type RedirectPreviewResponse = RedirectPreviewError | Response

type RedirectPreviewHandlerArgs =
  | [request: NextRequest, context: Context, params: { apiKey: string }]
  | [req: NextApiRequest, res: NextApiResponse<RedirectPreviewResponse>, params: { apiKey: string }]

const routeHandlerPattern = [P.instanceOf(Request), P.any, P.any] as const
const apiRoutePattern = [P.any, P.any, P.any] as const

export default async function redirectPreviewHandler(
  request: NextRequest,
  context: Context,
  { apiKey }: { apiKey: string },
): Promise<NextResponse<RedirectPreviewResponse>>
export default async function redirectPreviewHandler(
  req: NextApiRequest,
  res: NextApiResponse<RedirectPreviewResponse>,
  { apiKey }: { apiKey: string },
): Promise<void>
export default async function redirectPreviewHandler(
  ...args: RedirectPreviewHandlerArgs
): Promise<NextResponse<RedirectPreviewResponse> | void> {
  return match(args)
    .with(routeHandlerPattern, args => redirectPreviewRouteHandler(...args))
    .with(apiRoutePattern, args => redirectPreviewApiRouteHandler(...args))
    .exhaustive()
}

async function redirectPreviewRouteHandler(
  _request: NextRequest,
  _context: Context,
  {}: { apiKey: string },
): Promise<NextResponse<RedirectPreviewResponse>> {
  const message =
    'Cannot request preview endpoint from an API handler registered in `app`. Move your Makeswift API handler to the `pages/api` directory'
  console.error(message)
  return NextResponse.json(message, { status: 500 })
}

async function redirectPreviewApiRouteHandler(
  req: NextApiRequest,
  res: NextApiResponse<RedirectPreviewResponse>,
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

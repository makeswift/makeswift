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
  REDIRECT_PATH_QUERY_PARAM,
  SearchParams,
  SET_COOKIE_HEADER,
} from './utils/draft'

type Context = { params: { [key: string]: string | string[] } }

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

  if (secret == null) {
    return res.status(401).send('Unauthorized to enable preview mode: no secret provided')
  }
  if (secret !== apiKey) {
    return res.status(401).send('Unauthorized to enable preview mode: secret is incorrect')
  }

  const redirectPath = req.query[REDIRECT_PATH_QUERY_PARAM]
  if (typeof redirectPath !== 'string') {
    return res.status(400).send(`Bad request: invalid redirect path provided: ${redirectPath}`)
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

  const destinationUrl = new URL(redirectPath, 'http://test.com')
  Object.entries(req.query).forEach(([key, value]) => {
    if (typeof value !== 'string') return
    destinationUrl.searchParams.set(key, value)
  })
  destinationUrl.searchParams.delete(SearchParams.PreviewMode)
  destinationUrl.searchParams.delete(REDIRECT_PATH_QUERY_PARAM)

  res.redirect(`${destinationUrl.pathname}?${destinationUrl.searchParams.toString()}`)
}

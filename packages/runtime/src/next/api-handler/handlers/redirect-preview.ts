import { NextApiRequest, NextApiResponse } from 'next'
import { NextRequest, NextResponse } from 'next/server'
import { P, match } from 'ts-pattern'

import { parse as parseSetCookie } from 'set-cookie-parser'
import { serialize as serializeCookie } from 'cookie'

import {
  cookieSettingOptions,
  MAKESWIFT_VERSION_DATA_COOKIE,
  PRERENDER_BYPASS_COOKIE,
  PREVIEW_DATA_COOKIE,
  SearchParams,
  SET_COOKIE_HEADER,
} from './utils/cookie'
import { Makeswift } from '../../client'
import { cookies, draftMode } from 'next/headers'

export function originalRequestProtocol(request: NextRequest): string | null {
  // The `x-forwarded-proto` header is not formally standardized, but many proxies
  // *append* the protocol used for the request to the existing value. As a result,
  // if the request passes through multiple proxies, the header may contain a
  // comma-separated list of protocols: https://code.djangoproject.com/ticket/33569
  const forwardedProto = request.headers.get('x-forwarded-proto')
  return forwardedProto != null ? forwardedProto.split(',')[0].trim() : null
}

type Context = { params: { [key: string]: string | string[] } }

type RedirectPreviewError = string

type Response = unknown

export type RedirectPreviewResponse = RedirectPreviewError | Response

type RedirectPreviewHandlerArgs =
  | [request: NextRequest, context: Context, client: Makeswift]
  | [req: NextApiRequest, res: NextApiResponse<RedirectPreviewResponse>, client: Makeswift]

const routeHandlerPattern = [P.instanceOf(Request), P.any, P.any] as const
const apiRoutePattern = [P.any, P.any, P.any] as const

export default async function redirectPreviewHandler(
  request: NextRequest,
  context: Context,
  client: Makeswift,
): Promise<NextResponse<RedirectPreviewResponse>>
export default async function redirectPreviewHandler(
  req: NextApiRequest,
  res: NextApiResponse<RedirectPreviewResponse>,
  client: Makeswift,
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
  request: NextRequest,
  _context: Context,
  client: Makeswift,
): Promise<NextResponse<RedirectPreviewResponse>> {
  const previewToken = request.nextUrl.searchParams.get(SearchParams.PreviewToken)

  if (previewToken == null) {
    return new NextResponse('Bad request: no preview token provided', { status: 400 })
  }

  const { payload } = await client.readPreviewToken(previewToken)

  const draft = await draftMode()
  const cookieStore = await cookies()

  draft.enable()

  const prerenderBypassCookie = cookieStore.get(PRERENDER_BYPASS_COOKIE)

  if (prerenderBypassCookie?.value == null) {
    return new NextResponse('Could not retrieve draft mode bypass cookie', { status: 500 })
  }

  const draftCookies: { name: string; value: string }[] = [
    prerenderBypassCookie,
    {
      name: MAKESWIFT_VERSION_DATA_COOKIE,
      value: JSON.stringify({ makeswift: true, version: payload.version, token: previewToken }),
    },
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
    headers.append(SET_COOKIE_HEADER, serializeCookie(name, value, { ...cookieSettingOptions }))
  })

  return NextResponse.redirect(redirectUrl, { headers })
}

async function redirectPreviewApiRouteHandler(
  req: NextApiRequest,
  res: NextApiResponse<RedirectPreviewResponse>,
  client: Makeswift,
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

  const { payload } = await client.readPreviewToken(previewToken)

  const setCookie = res
    // Eventually, we can make the preview data value dynamic using the request
    .setPreviewData({ makeswift: true, version: payload.version, token: previewToken })
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
  destinationUrl.searchParams.delete(SearchParams.PreviewToken)

  res.redirect(`${destinationUrl.pathname}?${destinationUrl.searchParams.toString()}`)
}

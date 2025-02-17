import { NextApiRequest, NextApiResponse } from 'next'
import { NextRequest, NextResponse } from 'next/server'
import { P, match } from 'ts-pattern'
import { parse as parseSetCookie } from 'set-cookie-parser'

const PRERENDER_BYPASS_COOKIE = '__prerender_bypass'
const PREVIEW_DATA_COOKIE = '__next_preview_data'

type Context = { params: { [key: string]: string | string[] } }

type PreviewModeCookiesError = string

type Response = { cookies: { name: string; value: string }[] }

export type PreviewModeCookiesResponse = PreviewModeCookiesError | Response

type PreviewModeCookiesHandlerArgs =
  | [request: NextRequest, context: Context, params: { apiKey: string }]
  | [
      req: NextApiRequest,
      res: NextApiResponse<PreviewModeCookiesResponse>,
      params: { apiKey: string },
    ]

const routeHandlerPattern = [P.instanceOf(Request), P.any, P.any] as const
const apiRoutePattern = [P.any, P.any, P.any] as const

export default async function previewModeCookiesHandler(
  request: NextRequest,
  context: Context,
  { apiKey }: { apiKey: string },
): Promise<NextResponse<PreviewModeCookiesResponse>>
export default async function previewModeCookiesHandler(
  req: NextApiRequest,
  res: NextApiResponse<PreviewModeCookiesResponse>,
  { apiKey }: { apiKey: string },
): Promise<void>
export default async function previewModeCookiesHandler(
  ...args: PreviewModeCookiesHandlerArgs
): Promise<NextResponse<PreviewModeCookiesResponse> | void> {
  return match(args)
    .with(routeHandlerPattern, args => previewModeCookiesRouteHandler(...args))
    .with(apiRoutePattern, args => previewModeCookiesApiRouteHandler(...args))
    .exhaustive()
}

async function previewModeCookiesRouteHandler(
  _request: NextRequest,
  _context: Context,
  {}: { apiKey: string },
): Promise<NextResponse<PreviewModeCookiesResponse>> {
  const message =
    'Cannot request preview endpoint from an API handler registered in `app`. Move your Makeswift API handler to the `pages/api` directory'
  console.error(message)
  return NextResponse.json(message, { status: 500 })
}

async function previewModeCookiesApiRouteHandler(
  req: NextApiRequest,
  res: NextApiResponse<PreviewModeCookiesResponse>,
  { apiKey }: { apiKey: string },
): Promise<void> {
  const secret = req.query.secret

  if (secret !== apiKey) return res.status(401).send('Unauthorized')

  const setCookie = res
    .setPreviewData({ makeswift: true, siteVersion: 'Working' })
    .getHeader('set-cookie')

  res.removeHeader('set-cookie')

  const parsedCookies = parseSetCookie(Array.isArray(setCookie) ? setCookie : '')

  const prerenderBypassCookie = parsedCookies.find(c => c.name === PRERENDER_BYPASS_COOKIE)
  const previewDataCookie = parsedCookies.find(c => c.name === PREVIEW_DATA_COOKIE)

  if (prerenderBypassCookie?.value == null || previewDataCookie?.value == null) {
    return res.status(500).send('Could not retrieve preview mode cookies')
  }

  return res.json({
    cookies: [
      { name: prerenderBypassCookie.name, value: prerenderBypassCookie.value },
      { name: previewDataCookie.name, value: previewDataCookie.value },
    ],
  })
}

import { NextApiRequest, NextApiResponse } from 'next'
import { NextRequest, NextResponse } from 'next/server'
import { P, match } from 'ts-pattern'
import { parse as parseSetCookie } from 'set-cookie-parser'
import { serialize as serializeCookie } from 'cookie'
import { MakeswiftSiteVersion } from '../../../api/site-version'

const SET_COOKIE_HEADER = 'set-cookie'
const PRERENDER_BYPASS_COOKIE = '__prerender_bypass'
const PREVIEW_DATA_COOKIE = '__next_preview_data'

type Context = { params: { [key: string]: string | string[] } }

type PreviewModeError = string

type Response = { __brand: 'PreviewModeResponse' }

export type PreviewModeResponse = PreviewModeError | Response

type PreviewModeHandlerArgs =
  | [request: NextRequest, context: Context, params: { apiKey: string }]
  | [req: NextApiRequest, res: NextApiResponse<PreviewModeResponse>, params: { apiKey: string }]

const routeHandlerPattern = [P.instanceOf(Request), P.any, P.any] as const
const apiRoutePattern = [P.any, P.any, P.any] as const

export default async function previewModeHandler(
  request: NextRequest,
  context: Context,
  { apiKey }: { apiKey: string },
): Promise<NextResponse<PreviewModeResponse>>
export default async function previewModeHandler(
  req: NextApiRequest,
  res: NextApiResponse<PreviewModeResponse>,
  { apiKey }: { apiKey: string },
): Promise<void>
export default async function previewModeHandler(
  ...args: PreviewModeHandlerArgs
): Promise<NextResponse<PreviewModeResponse> | void> {
  return match(args)
    .with(routeHandlerPattern, args => previewModeRouteHandler(...args))
    .with(apiRoutePattern, args => previewModeApiRouteHandler(...args))
    .exhaustive()
}

async function previewModeRouteHandler(
  _request: NextRequest,
  _context: Context,
  {}: { apiKey: string },
): Promise<NextResponse<PreviewModeResponse>> {
  const message =
    'Cannot request preview endpoint from an API handler registered in `app`. Move your Makeswift API handler to the `pages/api` directory'
  console.error(message)
  return NextResponse.json(message, { status: 500 })
}

async function previewModeApiRouteHandler(
  req: NextApiRequest,
  res: NextApiResponse<PreviewModeResponse>,
  { apiKey }: { apiKey: string },
): Promise<void> {
  const secret = req.query.secret

  if (secret == null) {
    return res.status(401).send('Unauthorized to enable preview mode: no secret provided')
  }
  if (secret !== apiKey) {
    return res.status(401).send('Unauthorized to enable preview mode: secret is incorrect')
  }

  // Eventually, we can make the preview data value dynamic using the request
  const setCookie = res
    .setPreviewData({ makeswift: true, siteVersion: MakeswiftSiteVersion.Working })
    .getHeader(SET_COOKIE_HEADER)

  res.removeHeader(SET_COOKIE_HEADER)

  const parsedCookies = parseSetCookie(Array.isArray(setCookie) ? setCookie : '')

  const prerenderBypassCookie = parsedCookies.find(c => c.name === PRERENDER_BYPASS_COOKIE)
  const previewDataCookie = parsedCookies.find(c => c.name === PREVIEW_DATA_COOKIE)

  if (prerenderBypassCookie?.value == null || previewDataCookie?.value == null) {
    return res.status(500).send('Could not retrieve preview mode cookies')
  }

  const patchedCookies = [prerenderBypassCookie, previewDataCookie].map(
    ({ name, value, ...options }) => {
      return serializeCookie(name, value, {
        ...options,
        sameSite: 'none',
        secure: true,
        partitioned: true,
      })
    },
  )

  res.setHeader(SET_COOKIE_HEADER, patchedCookies)

  return res.json({ __brand: 'PreviewModeResponse' })
}

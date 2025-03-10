import { NextApiRequest, NextApiResponse } from 'next'
import { NextRequest, NextResponse } from 'next/server'
import { P, match } from 'ts-pattern'
import { cookies, draftMode } from 'next/headers'

import { parse as parseSetCookie } from 'set-cookie-parser'
import { serialize as serializeCookie } from 'cookie'

import { MakeswiftSiteVersion } from '../../../api/site-version'
import {
  cookieSettingOptions,
  MAKESWIFT_DRAFT_DATA_COOKIE,
  PRERENDER_BYPASS_COOKIE,
  PREVIEW_DATA_COOKIE,
  SearchParams,
  SET_COOKIE_HEADER,
} from './utils/draft'

type Context = { params: { [key: string]: string | string[] } }

type RedirectDraftError = string

type Response = unknown

export type RedirectDraftResponse = RedirectDraftError | Response

type RedirectDraftHandlerArgs =
  | [request: NextRequest, context: Context, params: { apiKey: string }]
  | [req: NextApiRequest, res: NextApiResponse<RedirectDraftResponse>, params: { apiKey: string }]

const routeHandlerPattern = [P.instanceOf(Request), P.any, P.any] as const
const apiRoutePattern = [P.any, P.any, P.any] as const

export default async function redirectDraftHandler(
  request: NextRequest,
  context: Context,
  { apiKey }: { apiKey: string },
): Promise<NextResponse<RedirectDraftResponse>>
export default async function redirectDraftHandler(
  req: NextApiRequest,
  res: NextApiResponse<RedirectDraftResponse>,
  { apiKey }: { apiKey: string },
): Promise<void>
export default async function redirectDraftHandler(
  ...args: RedirectDraftHandlerArgs
): Promise<NextResponse<RedirectDraftResponse> | void> {
  return match(args)
    .with(routeHandlerPattern, args => redirectDraftRouteHandler(...args))
    .with(apiRoutePattern, args => redirectDraftApiRouteHandler(...args))
    .exhaustive()
}

async function redirectDraftRouteHandler(
  request: NextRequest,
  _context: Context,
  { apiKey }: { apiKey: string },
): Promise<NextResponse<RedirectDraftResponse>> {
  const secret = request.nextUrl.searchParams.get(SearchParams.DraftMode)

  if (secret == null) {
    return new NextResponse('Unauthorized to enable draft mode: no secret provided', {
      status: 401,
    })
  }
  if (secret !== apiKey) {
    return new NextResponse('Unauthorized to enable draft mode: incorrect secret', { status: 401 })
  }

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
      name: MAKESWIFT_DRAFT_DATA_COOKIE,
      // Eventually, we can make this value dynamic using the request
      value: JSON.stringify({ makeswift: true, siteVersion: MakeswiftSiteVersion.Working }),
    },
  ]

  const destinationUrl = new URL(request.nextUrl)
  destinationUrl.searchParams.delete(SearchParams.DraftMode)

  const headers = new Headers()
  draftCookies.forEach(({ name, value }) => {
    headers.append(SET_COOKIE_HEADER, serializeCookie(name, value, { ...cookieSettingOptions }))
  })

  return NextResponse.redirect(destinationUrl, { headers })
}

async function redirectDraftApiRouteHandler(
  req: NextApiRequest,
  res: NextApiResponse<RedirectDraftResponse>,
  { apiKey }: { apiKey: string },
): Promise<void> {
  const secret = req.query[SearchParams.PreviewMode]

  if (secret == null) {
    return res.status(401).send('Unauthorized to enable preview mode: no secret provided')
  }
  if (secret !== apiKey) {
    return res.status(401).send('Unauthorized to enable preview mode: secret is incorrect')
  }

  if (req.url == null) {
    return res.status(400).send('Bad request: incoming request does not have URL property')
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

  const destinationUrl = new URL(req.url, 'http://test.com')
  destinationUrl.searchParams.delete(SearchParams.PreviewMode)

  res.redirect(`${destinationUrl.pathname}?${destinationUrl.searchParams.toString()}`)
}

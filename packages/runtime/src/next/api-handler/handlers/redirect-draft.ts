import { NextApiRequest, NextApiResponse } from 'next'
import { NextRequest, NextResponse } from 'next/server'
import { P, match } from 'ts-pattern'
import { cookies, draftMode } from 'next/headers'

import { serialize as serializeCookie } from 'cookie'

import {
  cookieSettingOptions,
  jwtKeyFromUuid,
  MAKESWIFT_DRAFT_DATA_COOKIE,
  PRERENDER_BYPASS_COOKIE,
  SearchParams,
  SET_COOKIE_HEADER,
} from './utils/draft'
import { jwtVerify } from 'jose'
import { createHash } from 'crypto'
import { siteRefSchema } from '../../../api/site-version'

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

export function originalRequestProtocol(request: NextRequest): string | null {
  // The `x-forwarded-proto` header is not formally standardized, but many proxies
  // *append* the protocol used for the request to the existing value. As a result,
  // if the request passes through multiple proxies, the header may contain a
  // comma-separated list of protocols: https://code.djangoproject.com/ticket/33569
  const forwardedProto = request.headers.get('x-forwarded-proto')
  return forwardedProto != null ? forwardedProto.split(',')[0].trim() : null
}

// TODO: Should we use a different handler instead?
async function redirectDraftRouteHandler(
  request: NextRequest,
  _context: Context,
  { apiKey }: { apiKey: string },
): Promise<NextResponse<RedirectDraftResponse>> {
  const jwt = request.nextUrl.searchParams.get(SearchParams.Ref)

  if (jwt == null) {
    return new NextResponse('Unauthorized to enable draft mode: no ref provided', {
      status: 401,
    })
  }

  try {
    const { payload } = await jwtVerify(jwt, jwtKeyFromUuid(apiKey))
    siteRefSchema.parse(payload)
  } catch (error) {
    return new NextResponse(`Unauthorized to enable draft mode: incorrect ref ${error}`, {
      status: 401,
    })
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
      // TODO: Should we store the jwt, or just the ref/payload?
      value: JSON.stringify(jwt),
    },
  ]

  const redirectProtocol =
    originalRequestProtocol(request) ?? request.nextUrl.protocol.replace(':', '')

  const redirectHost =
    request.headers.get('x-forwarded-host') ?? request.headers.get('host') ?? request.nextUrl.host

  const redirectUrl = new URL(
    `${redirectProtocol}://${redirectHost}${request.nextUrl.pathname}${request.nextUrl.search}`,
  )

  redirectUrl.searchParams.delete(SearchParams.Ref)

  const headers = new Headers()
  draftCookies.forEach(({ name, value }) => {
    headers.append(SET_COOKIE_HEADER, serializeCookie(name, value, { ...cookieSettingOptions }))
  })

  return NextResponse.redirect(redirectUrl, { headers })
}

async function redirectDraftApiRouteHandler(
  _req: NextApiRequest,
  res: NextApiResponse<RedirectDraftResponse>,
  {}: { apiKey: string },
): Promise<void> {
  const message =
    'Cannot request draft endpoint from an API handler registered in `pages`. Move your Makeswift API handler to the `app` directory'
  console.error(message)
  return res.status(500).send(message)
}

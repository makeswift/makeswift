import { NextApiRequest, NextApiResponse } from 'next'
import { NextRequest, NextResponse } from 'next/server'
import { P, match } from 'ts-pattern'
import {
  MAKESWIFT_DRAFT_DATA_COOKIE,
  PRERENDER_BYPASS_COOKIE,
  PREVIEW_DATA_COOKIE,
  SET_COOKIE_HEADER,
  cookieSettingOptions,
} from './utils/draft'
import { serialize as serializeCookie } from 'cookie'
import { type Context } from '../app-router-handler'

function clearCookiesHeader(cookieNames: string[]): string {
  const headers = new Headers()

  cookieNames.forEach(name => {
    headers.append(
      SET_COOKIE_HEADER,
      serializeCookie(name, '', { ...cookieSettingOptions, expires: new Date(0) }),
    )
  })

  const setCookieHeader = headers.get(SET_COOKIE_HEADER)

  if (setCookieHeader == null) {
    throw new Error(
      `Could not generate set-cookie header to clear cookies: ${cookieNames.join(', ')}`,
    )
  }

  return setCookieHeader
}

type ClearDraftError = string

type Response = { __brand: 'ClearDraftResponse' }

export type ClearDraftResponse = ClearDraftError | Response

type ClearDraftHandlerArgs =
  | [request: NextRequest, context: Context, params: { apiKey: string }]
  | [req: NextApiRequest, res: NextApiResponse<ClearDraftResponse>, params: { apiKey: string }]

const routeHandlerPattern = [P.instanceOf(Request), P.any, P.any] as const
const apiRoutePattern = [P.any, P.any, P.any] as const

export default async function clearDraftHandler(
  request: NextRequest,
  context: Context,
  { apiKey }: { apiKey: string },
): Promise<NextResponse<ClearDraftResponse>>
export default async function clearDraftHandler(
  req: NextApiRequest,
  res: NextApiResponse<ClearDraftResponse>,
  { apiKey }: { apiKey: string },
): Promise<void>
export default async function clearDraftHandler(
  ...args: ClearDraftHandlerArgs
): Promise<NextResponse<ClearDraftResponse> | void> {
  return match(args)
    .with(routeHandlerPattern, args => clearDraftRouteHandler(...args))
    .with(apiRoutePattern, args => clearDraftApiRouteHandler(...args))
    .exhaustive()
}

async function clearDraftRouteHandler(
  _request: NextRequest,
  _context: Context,
  {}: { apiKey: string },
): Promise<NextResponse<ClearDraftResponse>> {
  const headers = new Headers()

  headers.append(
    SET_COOKIE_HEADER,
    clearCookiesHeader([PRERENDER_BYPASS_COOKIE, MAKESWIFT_DRAFT_DATA_COOKIE]),
  )

  return NextResponse.json({ __brand: 'ClearDraftResponse' }, { headers })
}

async function clearDraftApiRouteHandler(
  _req: NextApiRequest,
  res: NextApiResponse<ClearDraftResponse>,
  {}: { apiKey: string },
): Promise<void> {
  res.setHeader(
    SET_COOKIE_HEADER,
    clearCookiesHeader([PRERENDER_BYPASS_COOKIE, PREVIEW_DATA_COOKIE]),
  )

  return res.json({ __brand: 'ClearDraftResponse' })
}

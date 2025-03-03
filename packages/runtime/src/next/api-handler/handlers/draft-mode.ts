import { NextApiRequest, NextApiResponse } from 'next'
import { NextRequest, NextResponse } from 'next/server'
import { P, match } from 'ts-pattern'
import { cookies, draftMode } from 'next/headers'
import { MakeswiftSiteVersion } from '../../../api/site-version'

const PRERENDER_BYPASS_COOKIE = '__prerender_bypass'
const DRAFT_DATA_COOKIE = 'x-makeswift-draft-data'

type Context = { params: { [key: string]: string | string[] } }

type DraftModeError = string

type Response = { __brand: 'DraftModeResponse' }

export type DraftModeResponse = DraftModeError | Response

type DraftModeHandlerArgs =
  | [request: NextRequest, context: Context, params: { apiKey: string }]
  | [req: NextApiRequest, res: NextApiResponse<DraftModeResponse>, params: { apiKey: string }]

const routeHandlerPattern = [P.instanceOf(Request), P.any, P.any] as const
const apiRoutePattern = [P.any, P.any, P.any] as const

export default async function draftModeHandler(
  request: NextRequest,
  context: Context,
  { apiKey }: { apiKey: string },
): Promise<NextResponse<DraftModeResponse>>
export default async function draftModeHandler(
  req: NextApiRequest,
  res: NextApiResponse<DraftModeResponse>,
  { apiKey }: { apiKey: string },
): Promise<void>
export default async function draftModeHandler(
  ...args: DraftModeHandlerArgs
): Promise<NextResponse<DraftModeResponse> | void> {
  return match(args)
    .with(routeHandlerPattern, args => draftModeRouteHandler(...args))
    .with(apiRoutePattern, args => draftModeApiRouteHandler(...args))
    .exhaustive()
}

async function draftModeRouteHandler(
  request: NextRequest,
  _context: Context,
  { apiKey }: { apiKey: string },
): Promise<NextResponse<DraftModeResponse>> {
  const secret = request.nextUrl.searchParams.get('secret')

  if (secret !== apiKey) {
    return new NextResponse('Unauthorized to enable draft mode', { status: 401 })
  }

  const draft = await draftMode()
  const cookieStore = await cookies()

  draft.enable()

  const bypassCookie = cookieStore.get(PRERENDER_BYPASS_COOKIE)

  if (bypassCookie?.value == null) {
    return new NextResponse('Could not retrieve draft mode bypass cookie', { status: 500 })
  }

  cookieStore.set({
    name: bypassCookie.name,
    value: bypassCookie.value,
    sameSite: 'none',
    secure: true,
    partitioned: true,
  })

  cookieStore.set({
    name: DRAFT_DATA_COOKIE,
    // Eventually, we can make the value dynamic using the request
    value: JSON.stringify({ makeswift: true, siteVersion: MakeswiftSiteVersion.Working }),
    sameSite: 'none',
    secure: true,
    partitioned: true,
  })

  const siteVersionCookie = cookieStore.get(DRAFT_DATA_COOKIE)

  if (siteVersionCookie?.value == null) {
    return new NextResponse('Could not retrieve draft mode site version cookie', { status: 500 })
  }

  return NextResponse.json({ __brand: 'DraftModeResponse' })
}

async function draftModeApiRouteHandler(
  _req: NextApiRequest,
  res: NextApiResponse<DraftModeResponse>,
  {}: { apiKey: string },
): Promise<void> {
  const message =
    'Cannot request draft endpoint from an API handler registered in `pages`. Move your Makeswift API handler to the `app` directory'
  console.error(message)
  return res.status(500).send(message)
}

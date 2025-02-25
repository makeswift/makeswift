import { NextApiRequest, NextApiResponse } from 'next'
import { NextRequest, NextResponse } from 'next/server'
import { P, match } from 'ts-pattern'
import { cookies, draftMode } from 'next/headers'

const PRERENDER_BYPASS_COOKIE = '__prerender_bypass'
const DRAFT_DATA_COOKIE = 'x-makeswift-draft-data'

type Context = { params: { [key: string]: string | string[] } }

type DraftModeCookiesError = string

type Response = { cookies: { name: string; value: string }[] }

export type DraftModeCookiesResponse = DraftModeCookiesError | Response

type DraftModeCookiesHandlerArgs =
  | [request: NextRequest, context: Context, params: { apiKey: string }]
  | [
      req: NextApiRequest,
      res: NextApiResponse<DraftModeCookiesResponse>,
      params: { apiKey: string },
    ]

const routeHandlerPattern = [P.instanceOf(Request), P.any, P.any] as const
const apiRoutePattern = [P.any, P.any, P.any] as const

export default async function draftModeCookiesHandler(
  request: NextRequest,
  context: Context,
  { apiKey }: { apiKey: string },
): Promise<NextResponse<DraftModeCookiesResponse>>
export default async function draftModeCookiesHandler(
  req: NextApiRequest,
  res: NextApiResponse<DraftModeCookiesResponse>,
  { apiKey }: { apiKey: string },
): Promise<void>
export default async function draftModeCookiesHandler(
  ...args: DraftModeCookiesHandlerArgs
): Promise<NextResponse<DraftModeCookiesResponse> | void> {
  return match(args)
    .with(routeHandlerPattern, args => draftModeCookiesRouteHandler(...args))
    .with(apiRoutePattern, args => draftModeCookiesApiRouteHandler(...args))
    .exhaustive()
}

async function draftModeCookiesRouteHandler(
  request: NextRequest,
  _context: Context,
  { apiKey }: { apiKey: string },
): Promise<NextResponse<DraftModeCookiesResponse>> {
  const secret = request.nextUrl.searchParams.get('secret')

  if (secret !== apiKey) {
    return new NextResponse('Unauthorized to retrieve draft mode cookies', { status: 401 })
  }

  const draft = await draftMode()
  const cookieStore = await cookies()

  draft.enable()
  const prerenderDraftModeCookies = cookieStore.get(PRERENDER_BYPASS_COOKIE)

  if (prerenderDraftModeCookies?.value == null) {
    return new NextResponse('Could not retrieve draft mode cookies', { status: 500 })
  }

  return NextResponse.json({
    cookies: [
      { name: prerenderDraftModeCookies.name, value: prerenderDraftModeCookies.value },
      {
        name: DRAFT_DATA_COOKIE,
        value: JSON.stringify({ makeswift: true, siteVersion: 'Working' }),
      },
    ],
  })
}

async function draftModeCookiesApiRouteHandler(
  _req: NextApiRequest,
  res: NextApiResponse<DraftModeCookiesResponse>,
  {}: { apiKey: string },
): Promise<void> {
  const message =
    'Cannot request draft endpoint from an API handler registered in `pages`. Move your Makeswift API handler to the `app` directory'
  console.error(message)
  return res.status(500).send(message)
}

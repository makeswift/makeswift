import { NextApiRequest, NextApiResponse } from 'next'
import { NextRequest, NextResponse } from 'next/server'
import { P, match } from 'ts-pattern'
import { cookies, draftMode } from 'next/headers'
import {
  MAKESWIFT_DRAFT_MODE_DATA_COOKIE,
  MakeswiftDraftData,
  MakeswiftSiteVersion,
} from '../../draft-mode'

type Context = { params: { [key: string]: string | string[] } }

type GetDraftModeError = string

type GetDraftModeResult = { __brand: 'GetDraftModeResult' }

export type GetDraftModeResponse = GetDraftModeError | GetDraftModeResult

type GetDraftModeHandlerArgs =
  | [request: NextRequest, context: Context, params: { apiKey: string }]
  | [req: NextApiRequest, res: NextApiResponse<GetDraftModeResponse>, params: { apiKey: string }]

export default async function getDraftMode(
  request: NextRequest,
  context: Context,
  { apiKey }: { apiKey: string },
): Promise<NextResponse<GetDraftModeResponse>>
export default async function getDraftMode(
  req: NextApiRequest,
  res: NextApiResponse<GetDraftModeResponse>,
  { apiKey }: { apiKey: string },
): Promise<void>
export default async function getDraftMode(
  ...args: GetDraftModeHandlerArgs
): Promise<NextResponse<GetDraftModeResponse> | void> {
  const routeHandlerPattern = [P.instanceOf(Request), P.any, P.any] as const
  const apiRoutePattern = [P.any, P.any, P.any] as const

  return match(args)
    .with(routeHandlerPattern, args => getDraftModeRouteHandler(...args))
    .with(apiRoutePattern, args => getDraftModeApiRouteHandler(...args))
    .exhaustive()
}

async function getDraftModeRouteHandler(
  request: NextRequest,
  _context: Context,
  { apiKey }: { apiKey: string },
): Promise<NextResponse<GetDraftModeResponse>> {
  const secret = request.nextUrl.searchParams.get('x-makeswift-draft-mode')

  if (secret !== apiKey) return new NextResponse('Unauthorized', { status: 401 })

  const draftModeData: MakeswiftDraftData = {
    makeswift: true,
    siteVersion: MakeswiftSiteVersion.Working,
  }

  const res = new NextResponse<GetDraftModeResponse>()

  draftMode().enable()
  cookies().set(MAKESWIFT_DRAFT_MODE_DATA_COOKIE, JSON.stringify(draftModeData))

  return res
}

async function getDraftModeApiRouteHandler(
  req: NextApiRequest,
  res: NextApiResponse<GetDraftModeResponse>,
  { apiKey }: { apiKey: string },
): Promise<void> {
  const secret = req.query['x-makeswift-draft-mode']
  if (secret !== apiKey) return res.status(401).send('Unauthorized')
}

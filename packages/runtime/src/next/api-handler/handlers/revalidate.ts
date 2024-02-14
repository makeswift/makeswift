import { NextApiRequest, NextApiResponse } from 'next'
import isErrorWithMessage from '../../../utils/isErrorWithMessage'
import { NextRequest, NextResponse } from 'next/server'
import { P, match } from 'ts-pattern'
import { revalidatePath } from 'next/cache'

type Context = { params: { [key: string]: string | string[] } }

type RevalidationResult = { revalidated: boolean }

type RevalidationError = { message: string }

export type RevalidationResponse = RevalidationResult | RevalidationError

type RevalidateHandlerArgs =
  | [request: NextRequest, context: Context, params: { apiKey: string }]
  | [req: NextApiRequest, res: NextApiResponse<RevalidationResponse>, params: { apiKey: string }]

const routeHandlerPattern = [P.instanceOf(Request), P.any, P.any] as const
const apiRoutePattern = [P.any, P.any, P.any] as const

export async function revalidate(
  request: NextRequest,
  context: Context,
  { apiKey }: { apiKey: string },
): Promise<NextResponse<RevalidationResponse>>
export async function revalidate(
  req: NextApiRequest,
  res: NextApiResponse<RevalidationResponse>,
  { apiKey }: { apiKey: string },
): Promise<void>
export async function revalidate(
  ...args: RevalidateHandlerArgs
): Promise<NextResponse<RevalidationResponse> | void> {
  const [, , { apiKey }] = args

  const secret = match(args)
    .with(routeHandlerPattern, ([request]) => request.nextUrl.searchParams.get('secret'))
    .with(apiRoutePattern, ([req]) => req.query.secret)
    .exhaustive()

  if (secret !== apiKey) {
    const body = { message: 'Unauthorized' }
    const status = 401

    return match(args)
      .with(routeHandlerPattern, () => NextResponse.json(body, { status }))
      .with(apiRoutePattern, ([, res]) => res.status(status).json(body))
      .exhaustive()
  }

  const path = match(args)
    .with(routeHandlerPattern, ([request]) => request.nextUrl.searchParams.get('path'))
    .with(apiRoutePattern, ([req]) => req.query.path)
    .exhaustive()

  if (typeof path !== 'string') {
    const status = 400
    const body = { message: 'Bad Request' }

    return match(args)
      .with(routeHandlerPattern, () => NextResponse.json(body, { status }))
      .with(apiRoutePattern, ([, res]) => res.status(status).json(body))
      .exhaustive()
  }

  const revalidate = match(args)
    .with(routeHandlerPattern, () => revalidatePath)
    .with(apiRoutePattern, ([, res]) => res.revalidate)
    .exhaustive()

  try {
    await revalidate(path)

    const body = { revalidated: true }

    return match(args)
      .with(routeHandlerPattern, () => NextResponse.json(body))
      .with(apiRoutePattern, ([, res]) => res.json(body))
      .exhaustive()
  } catch (error) {
    if (isErrorWithMessage(error)) {
      const status = 500
      const body = { message: error.message }

      return match(args)
        .with(routeHandlerPattern, () => NextResponse.json(body, { status }))
        .with(apiRoutePattern, ([, res]) => res.status(status).json(body))
        .exhaustive()
    }

    const status = 500
    const body = { message: 'Error Revalidating' }

    return match(args)
      .with(routeHandlerPattern, () => NextResponse.json(body, { status }))
      .with(apiRoutePattern, ([, res]) => res.status(status).json(body))
      .exhaustive()
  }
}

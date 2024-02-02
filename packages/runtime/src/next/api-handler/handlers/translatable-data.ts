import { NextApiRequest, NextApiResponse } from 'next'
import { Data } from '../../../state/react-page'
import { Makeswift } from '../../client'
import { NextRequest, NextResponse } from 'next/server'
import { P, match } from 'ts-pattern'

type Context = { params: { [key: string]: string | string[] } }

type TranslatableDataResult = { translatableData: Record<string, Data> }

type TranslatableDataError = { message: string }

export type TranslatableDataResponse = TranslatableDataResult | TranslatableDataError

type TranslatableDataHandlerArgs =
  | [request: NextRequest, context: Context, client: Makeswift]
  | [req: NextApiRequest, res: NextApiResponse<TranslatableDataResponse>, client: Makeswift]

export default async function translatableData(
  request: NextRequest,
  context: Context,
  client: Makeswift,
): Promise<NextResponse<TranslatableDataResponse>>
export default async function translatableData(
  req: NextApiRequest,
  res: NextApiResponse<TranslatableDataResponse>,
  client: Makeswift,
): Promise<void>
export default async function translatableData(
  ...args: TranslatableDataHandlerArgs
): Promise<NextResponse<TranslatableDataResponse> | void> {
  const routeHandlerPattern = [P.instanceOf(Request), P.any, P.any] as const
  const apiRoutePattern = [P.any, P.any, P.any] as const
  const [, , client] = args

  const body = await match(args)
    .with(routeHandlerPattern, ([request]) => request.json())
    .with(apiRoutePattern, ([req]) => req.body)
    .exhaustive()
  const elementTree = body.elementTree

  if (elementTree == null) {
    const status = 400
    const body = { message: 'elementTree must be defined.' }

    return match(args)
      .with(routeHandlerPattern, () => NextResponse.json(body, { status }))
      .with(apiRoutePattern, ([, res]) => res.status(status).json(body))
      .exhaustive()
  }

  try {
    let translatableData = client.getTranslatableData(elementTree)

    const body = { translatableData }

    return match(args)
      .with(routeHandlerPattern, () => NextResponse.json(body))
      .with(apiRoutePattern, ([, res]) => res.json(body))
      .exhaustive()
  } catch (error) {
    const status = 500
    const body = { message: 'Failed to get traslatable data.' }

    return match(args)
      .with(routeHandlerPattern, () => NextResponse.json(body, { status }))
      .with(apiRoutePattern, ([, res]) => res.status(status).json(body))
      .exhaustive()
  }
}

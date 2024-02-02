import { NextApiRequest, NextApiResponse } from 'next'
import { Element } from '../../../state/react-page'
import { Makeswift } from '../../client'
import { NextRequest, NextResponse } from 'next/server'
import { P, match } from 'ts-pattern'

type Context = { params: { [key: string]: string | string[] } }

type TranslatedDataResult = { elementTree: Element }

type TranslatedDataError = { message: string }

export type TranslatedDataResponse = TranslatedDataResult | TranslatedDataError

type MergeTranslatedDataHandlerArgs =
  | [request: NextRequest, context: Context, client: Makeswift]
  | [req: NextApiRequest, res: NextApiResponse<TranslatedDataResponse>, client: Makeswift]

export default async function mergeTranslatedData(
  request: NextRequest,
  context: Context,
  client: Makeswift,
): Promise<NextResponse<TranslatedDataResponse>>
export default async function mergeTranslatedData(
  req: NextApiRequest,
  res: NextApiResponse<TranslatedDataResponse>,
  client: Makeswift,
): Promise<void>
export default async function mergeTranslatedData(
  ...args: MergeTranslatedDataHandlerArgs
): Promise<NextResponse<TranslatedDataResponse> | void> {
  const routeHandlerPattern = [P.instanceOf(Request), P.any, P.any] as const
  const apiRoutePattern = [P.any, P.any, P.any] as const
  const [, , client] = args

  const body = await match(args)
    .with(routeHandlerPattern, ([request]) => request.json())
    .with(apiRoutePattern, ([req]) => req.body)
    .exhaustive()

  const translatedData = body.translatedData
  const elementTree = body.elementTree

  if (translatedData == null) {
    const status = 400
    const body = { message: 'translatedData must be defined' }

    return match(args)
      .with(routeHandlerPattern, () => NextResponse.json(body, { status }))
      .with(apiRoutePattern, ([, res]) => res.status(status).json(body))
      .exhaustive()
  }

  if (elementTree == null) {
    const status = 400
    const body = { message: 'elementTree must be defined' }

    return match(args)
      .with(routeHandlerPattern, () => NextResponse.json(body, { status }))
      .with(apiRoutePattern, ([, res]) => res.status(status).json(body))
      .exhaustive()
  }

  const translatedElementTree = client.mergeTranslatedData(elementTree, translatedData)

  const responseBody = { elementTree: translatedElementTree }

  return match(args)
    .with(routeHandlerPattern, () => NextResponse.json(responseBody))
    .with(apiRoutePattern, ([, res]) => res.json(responseBody))
    .exhaustive()
}

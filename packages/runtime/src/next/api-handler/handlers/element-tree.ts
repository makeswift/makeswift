import { NextApiRequest, NextApiResponse } from 'next'
import { ReactRuntime } from '../../../react'
import { Element } from '../../../state/react-page'
import { NextRequest, NextResponse } from 'next/server'
import { P, match } from 'ts-pattern'

type Context = { params: { [key: string]: string | string[] } }

type ElementTreeResult = { elementTree: Element }

type ElementTreeError = { message: string }

export type ElementTreeResponse = ElementTreeResult | ElementTreeError

type ElementTreeHandlerArgs =
  | [request: NextRequest, context: Context, runtime: ReactRuntime]
  | [req: NextApiRequest, res: NextApiResponse<ElementTreeResponse>, runtime: ReactRuntime]

export default async function elementTree(
  request: NextRequest,
  context: Context,
  runtime: ReactRuntime,
): Promise<NextResponse<ElementTreeResponse>>
export default async function elementTree(
  req: NextApiRequest,
  res: NextApiResponse<ElementTreeResponse>,
  runtime: ReactRuntime,
): Promise<void>
export default async function elementTree(
  ...args: ElementTreeHandlerArgs
): Promise<NextResponse<ElementTreeResponse> | void> {
  const routeHandlerPattern = [P.instanceOf(Request), P.any, P.any] as const
  const apiRoutePattern = [P.any, P.any, P.any] as const
  const [, , runtime] = args

  const body = await match(args)
    .with(routeHandlerPattern, ([request]) => request.json())
    .with(apiRoutePattern, ([req]) => req.body)
    .exhaustive()
  const elementTree = body.elementTree
  const replacementContext = body.replacementContext

  if (elementTree == null) {
    const status = 400
    const body = { message: 'elementTree must be defined' }

    return match(args)
      .with(routeHandlerPattern, () => NextResponse.json(body, { status }))
      .with(apiRoutePattern, ([, res]) => res.status(status).json(body))
      .exhaustive()
  }

  if (replacementContext == null) {
    const status = 400
    const body = { message: 'replacementContext must be defined' }

    return match(args)
      .with(routeHandlerPattern, () => NextResponse.json(body, { status }))
      .with(apiRoutePattern, ([, res]) => res.status(status).json(body))
      .exhaustive()
  }

  const generatedElementTree = runtime.copyElementTree(elementTree, replacementContext)

  const response = { elementTree: generatedElementTree }

  return match(args)
    .with(routeHandlerPattern, () => NextResponse.json(response))
    .with(apiRoutePattern, ([, res]) => res.json(response))
    .exhaustive()
}

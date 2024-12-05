import { NextApiRequest, NextApiResponse } from 'next'
import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { P, match } from 'ts-pattern'
import { z } from 'zod'

type Context = { params: { [key: string]: string | string[] } }

type WebhookSuccess = { success: true }

type WebhookError = { message: string }

export type WebhookResponse = WebhookSuccess | WebhookError

type WebhookHandlerArgs =
  | [request: NextRequest, context: Context, params: { apiKey: string }]
  | [req: NextApiRequest, res: NextApiResponse<WebhookResponse>, params: { apiKey: string }]

const routeHandlerPattern = [P.instanceOf(Request), P.any, P.any] as const
const apiRoutePattern = [P.any, P.any, P.any] as const

export default async function handler(
  request: NextRequest,
  context: Context,
  { apiKey }: { apiKey: string },
): Promise<NextResponse<WebhookResponse>>
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<WebhookResponse>,
  { apiKey }: { apiKey: string },
): Promise<void>
export default async function handler(
  ...args: WebhookHandlerArgs
): Promise<NextResponse<WebhookResponse> | void> {
  const [, , { apiKey }] = args

  const secret = match(args)
    .with(routeHandlerPattern, ([request]) => request.nextUrl.searchParams.get('secret'))
    .with(apiRoutePattern, ([req]) => req.query.secret)
    .exhaustive()

  console.log('webhook handler')

  if (secret !== apiKey) {
    const status = 401
    const body = { message: 'Unauthorized' }

    return match(args)
      .with(routeHandlerPattern, () => NextResponse.json(body, { status }))
      .with(apiRoutePattern, ([, res]) => res.status(status).json(body))
      .exhaustive()
  }

  const body = await match(args)
    .with(routeHandlerPattern, ([request]) => request.json())
    .with(apiRoutePattern, ([req]) => req.body)
    .exhaustive()

  const payload = webhookPayloadSchema.parse(body)

  const pathnames = payload.site.publishedPathnames
  const swatches = payload.site.publishedSwatches
  const elementTrees = payload.site.publishedElementTrees
  const tags = [...pathnames, ...swatches, ...elementTrees]

  console.log({ pathnames, swatches, elementTrees })

  tags.forEach(tag => {
    revalidateTag(tag)
  })

  const response = { success: true } as const

  return match(args)
    .with(routeHandlerPattern, () => NextResponse.json(response))
    .with(apiRoutePattern, ([, res]) => res.json(response))
    .exhaustive()
}

const webhookPayloadSchema = z.object({
  type: z.string(),
  site: z.object({
    id: z.string(),
    publishedPages: z.array(z.object({ id: z.string() })),
    publishedPathnames: z.array(z.string()),
    publishedSwatches: z.array(z.string()),
    publishedElementTrees: z.array(z.string()),
  }),
})

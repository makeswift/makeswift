import { NextApiRequest, NextApiResponse } from 'next'
import { NextRequest, NextResponse } from 'next/server'
import { P, match } from 'ts-pattern'
import { z } from 'zod'
import { handleSitePublished, sitePublishedWebhookPayloadSchema } from './site-published'

type Context = { params: { [key: string]: string | string[] } }

type WebhookSuccess = { success: true }

type WebhookError = { message: string }

export type WebhookResponse = WebhookSuccess | WebhookError

export type WebhookHandlerArgs =
  | [request: NextRequest, context: Context, params: { apiKey: string }]
  | [req: NextApiRequest, res: NextApiResponse<WebhookResponse>, params: { apiKey: string }]

const routeHandlerPattern = [P.instanceOf(Request), P.any, P.any] as const
const apiRoutePattern = [P.any, P.any, P.any] as const

function getSecret(args: WebhookHandlerArgs) {
  return match(args)
    .with(routeHandlerPattern, ([request]) => request.nextUrl.searchParams.get('secret'))
    .with(apiRoutePattern, ([req]) => req.query.secret)
    .exhaustive()
}

function getRequestBody(args: WebhookHandlerArgs) {
  return match(args)
    .with(routeHandlerPattern, ([request]) => request.json())
    .with(apiRoutePattern, ([req]) => req.body)
    .exhaustive()
}

function respond(args: WebhookHandlerArgs, response: WebhookResponse, status?: number) {
  return match(args)
    .with(routeHandlerPattern, () => NextResponse.json(response, { status }))
    .with(apiRoutePattern, ([, res]) => res.json(response))
    .exhaustive()
}

export const WebhookEventType = {
  SITE_PUBLISHED: 'site.published',
} as const

const webhookPayloadSchema = sitePublishedWebhookPayloadSchema

type WebhookPayloadSchema = z.infer<typeof webhookPayloadSchema>

export type WebhookPayloadHandlerResponse = {
  body: WebhookResponse
  status: 200
}

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
  const secret = getSecret(args)

  if (secret !== apiKey) return respond(args, { message: 'Unauthorized' }, 401)

  let payload: WebhookPayloadSchema

  try {
    const body = await getRequestBody(args)
    payload = webhookPayloadSchema.parse(body)
  } catch (error) {
    return respond(args, { message: 'Invalid request body' }, 400)
  }

  const result = match(payload.type)
    .with(WebhookEventType.SITE_PUBLISHED, () => handleSitePublished(payload))
    .exhaustive()

  return respond(args, result.body, result.status)
}

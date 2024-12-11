import { NextApiRequest, NextApiResponse } from 'next'
import { NextRequest, NextResponse } from 'next/server'
import { P, match } from 'ts-pattern'
import { handleSitePublished } from './site-published'
import {
  sitePublishedWebhookPayloadSchema,
  WebhookEventType,
  WebhookPayloadSchema,
  WebhookResponseBody,
} from './types'

type Context = { params: { [key: string]: string | string[] } }

export type WebhookHandlerArgs =
  | [request: NextRequest, context: Context, params: { apiKey: string }]
  | [req: NextApiRequest, res: NextApiResponse<WebhookResponseBody>, params: { apiKey: string }]

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

function respond(args: WebhookHandlerArgs, response: WebhookResponseBody, status?: number) {
  return match(args)
    .with(routeHandlerPattern, () => NextResponse.json(response, { status }))
    .with(apiRoutePattern, ([, res]) => res.json(response))
    .exhaustive()
}

export default async function handler(
  request: NextRequest,
  context: Context,
  { apiKey }: { apiKey: string },
): Promise<NextResponse<WebhookResponseBody>>
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<WebhookResponseBody>,
  { apiKey }: { apiKey: string },
): Promise<void>
export default async function handler(
  ...args: WebhookHandlerArgs
): Promise<NextResponse<WebhookResponseBody> | void> {
  const [, , { apiKey }] = args
  const secret = getSecret(args)

  if (secret !== apiKey) return respond(args, { message: 'Unauthorized' }, 401)

  let payload: WebhookPayloadSchema

  try {
    const body = await getRequestBody(args)
    payload = sitePublishedWebhookPayloadSchema.parse(body)
  } catch (error) {
    console.error(error)
    return respond(args, { message: 'Invalid request body' }, 400)
  }

  const result = match(payload.type)
    .with(WebhookEventType.SITE_PUBLISHED, () => handleSitePublished(payload))
    .exhaustive()

  return respond(args, result.body, result.status)
}

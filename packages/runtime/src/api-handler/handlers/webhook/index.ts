import { match } from 'ts-pattern'
import { type ApiRequest, ApiResponse, searchParams } from '../../request-response'

import {
  type OnPublish,
  type WebhookPayloadSchema,
  type WebhookResponseBody,
  sitePublishedWebhookPayloadSchema,
  WebhookEventType,
} from './types'

import { handleSitePublished } from './site-published'

type WebhookParams = {
  apiKey: string
  events?: { onPublish?: OnPublish }
  revalidate: (path?: string, cacheTags?: string[]) => Promise<void>
}

export async function webhookHandler(
  req: ApiRequest,
  { apiKey, events, revalidate }: WebhookParams,
): Promise<ApiResponse<WebhookResponseBody>> {
  const secret = searchParams(req).get('secret')
  if (secret !== apiKey) {
    return ApiResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  let payload: WebhookPayloadSchema

  try {
    const body = await req.json()
    payload = sitePublishedWebhookPayloadSchema.parse(body)
  } catch (error) {
    console.error(error)
    return ApiResponse.json({ message: 'Invalid request body' }, { status: 400 })
  }

  function handleRevalidate() {
    // TODO be less ugly
    revalidate(undefined, payload.data.revalidateTags)
  }

  const result = await match(payload.type)
    .with(WebhookEventType.SITE_PUBLISHED, () =>
      handleSitePublished(payload, { onPublish: events?.onPublish, revalidate: handleRevalidate }),
    )
    .exhaustive()

  return ApiResponse.json(result.body, { status: result.status })
}

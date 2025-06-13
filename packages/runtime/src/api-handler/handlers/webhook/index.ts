import { match } from 'ts-pattern'
import { type ApiRequest, type ApiResponse } from '../../request-response'

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
  revalidate: () => void
}

export async function webhookHandler(
  req: ApiRequest,
  res: ApiResponse,
  { apiKey, events, revalidate }: WebhookParams,
): Promise<ApiResponse<WebhookResponseBody>> {
  const secret = req.getSearchParam('secret')
  if (secret !== apiKey) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  let payload: WebhookPayloadSchema

  try {
    const body = await req.json()
    payload = sitePublishedWebhookPayloadSchema.parse(body)
  } catch (error) {
    console.error(error)
    return res.status(400).json({ message: 'Invalid request body' })
  }

  const result = await match(payload.type)
    .with(WebhookEventType.SITE_PUBLISHED, () =>
      handleSitePublished(payload, { onPublish: events?.onPublish, revalidate }),
    )
    .exhaustive()

  return res.status(result.status).json(result.body)
}

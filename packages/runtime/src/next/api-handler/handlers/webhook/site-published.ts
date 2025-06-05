import { revalidateTag } from 'next/cache'
import {
  type OnPublish,
  type SitePublishedWebhookPayload,
  type WebhookHandlerResult,
} from './types'

import { MAKESWIFT_CACHE_TAG } from '../../../cache'

type SitePublishedParams = {
  onPublish?: OnPublish
}

export async function handleSitePublished(
  _payload: SitePublishedWebhookPayload,
  { onPublish }: SitePublishedParams,
): Promise<WebhookHandlerResult> {
  revalidateTag(MAKESWIFT_CACHE_TAG)

  try {
    await onPublish?.()
  } catch (error) {
    // log and ignore any error in user-provided onPublish
    console.error("Unhandled exception in the 'onPublish' callback:", error)
  }

  return { body: { success: true }, status: 200 }
}

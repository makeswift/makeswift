import { revalidateTag } from 'next/cache'
import { OnPublish, SitePublishedWebhookPayload, WebhookHandlerResult } from './types'

type SitePublishedParams = {
  onPublish?: OnPublish
}

export async function handleSitePublished(
  _payload: SitePublishedWebhookPayload,
  { onPublish }: SitePublishedParams
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

export const MAKESWIFT_CACHE_TAG = '@@makeswift'

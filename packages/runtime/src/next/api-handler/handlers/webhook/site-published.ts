import { revalidateTag } from 'next/cache'
import { SitePublishedWebhookPayload, WebhookHandlerResult } from './types'

export function handleSitePublished(_payload: SitePublishedWebhookPayload): WebhookHandlerResult {
  revalidateTag(MAKESWIFT_CACHE_TAG)

  return { body: { success: true }, status: 200 }
}

export const MAKESWIFT_CACHE_TAG = '@@makeswift'

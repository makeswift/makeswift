import {
  type OnPublish,
  type SitePublishedWebhookPayload,
  type WebhookHandlerResult,
} from './types'

type SitePublishedParams = {
  onPublish?: OnPublish
  revalidate: () => void
}

export async function handleSitePublished(
  _payload: SitePublishedWebhookPayload,
  { onPublish, revalidate }: SitePublishedParams,
): Promise<WebhookHandlerResult> {
  revalidate()

  try {
    await onPublish?.()
  } catch (error) {
    // log and ignore any error in user-provided onPublish
    console.error("Unhandled exception in the 'onPublish' callback:", error)
  }

  return { body: { success: true }, status: 200 }
}

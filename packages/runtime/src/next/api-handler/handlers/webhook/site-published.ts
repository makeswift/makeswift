import { z } from 'zod'
import { revalidatePath, revalidateTag } from 'next/cache'

import { WebhookEventType, WebhookPayloadHandlerResponse } from '.'
import { nodeIDorUUIDtoUUIDSchema } from '../../../../utils/node-id'

export const sitePublishedWebhookPayloadSchema = z.object({
  type: z.literal(WebhookEventType.SITE_PUBLISHED),
  data: z.object({
    publish: z.object({
      from: z.string(),
      to: z.string(),
    }),
    at: z.number(),
  }),
})

type SitePublishedWebhookPayload = z.infer<typeof sitePublishedWebhookPayloadSchema>

export function handleSitePublished(
  payload: SitePublishedWebhookPayload,
): WebhookPayloadHandlerResponse {
  if (payload.site.global) {
    // https://nextjs.org/docs/app/api-reference/functions/revalidatePath#revalidating-all-data
    revalidatePath('/', 'layout')
    return { body: { success: true }, status: 200 }
  }

  const pathnames = payload.site.pages.map(({ pathname }) => pathname)
  const swatchIds = payload.site.swatches.map(({ id }) => id)
  const typographyIds = payload.site.typographies.map(({ id }) => id)
  const componentIds = payload.site.components.map(({ id }) => id)
  const tags = [...pathnames, ...swatchIds, ...typographyIds, ...componentIds]

  tags.forEach(tag => revalidateTag(tag))

  return { body: { success: true }, status: 200 }
}

export const TransformTag = {
  // ID needs to be an UUID, not NodeID
  id(id: string) {
    return nodeIDorUUIDtoUUIDSchema.parse(id)
  },
  pathname(pathname: string) {
    // Implement pathname cleaning
    return pathname
  },
}

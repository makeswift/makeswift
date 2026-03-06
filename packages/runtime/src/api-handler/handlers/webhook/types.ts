import { z } from 'zod'

import { type ErrorResponseBody } from '../../request-response'
import { diffProjectionSchema } from './diff-projection'

export const WebhookEventType = {
  SITE_PUBLISHED: 'site.published',
} as const

export const sitePublishedWebhookPayloadSchema = z.object({
  type: z.literal(WebhookEventType.SITE_PUBLISHED),
  data: z.object({
    siteId: z.string().uuid(),
    publish: z.object({
      from: z.string().uuid().nullable(),
      to: z.string().uuid(),
    }),
    at: z.number(),
    // catch(undefined) ensures a server-side schema change never breaks the
    // webhook handler — if parsing fails, unstable_diff degrades to undefined
    // and the consumer falls back to full revalidation.
    unstable_diff: diffProjectionSchema.nullable().optional().catch(undefined),
  }),
})

export type SitePublishedWebhookPayload = z.infer<typeof sitePublishedWebhookPayloadSchema>

export type SitePublishedWebhookPayloadData = z.infer<
  typeof sitePublishedWebhookPayloadSchema
>['data']

const webhookPayloadSchema = sitePublishedWebhookPayloadSchema

export type WebhookPayloadSchema = z.infer<typeof webhookPayloadSchema>

type WebhookSuccessBody = { success: true }

export type WebhookResponseBody = WebhookSuccessBody | ErrorResponseBody

export type WebhookHandlerResult = {
  body: WebhookResponseBody
  status: 200
}

export type OnPublish = (payload: SitePublishedWebhookPayloadData) => void | Promise<void>

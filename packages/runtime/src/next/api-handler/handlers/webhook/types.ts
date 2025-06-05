import { z } from 'zod'

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
  }),
})

export type SitePublishedWebhookPayload = z.infer<typeof sitePublishedWebhookPayloadSchema>

const webhookPayloadSchema = sitePublishedWebhookPayloadSchema

export type WebhookPayloadSchema = z.infer<typeof webhookPayloadSchema>

type WebhookSuccessBody = { success: true }

type WebhookErrorBody = { message: string }

export type WebhookResponseBody = WebhookSuccessBody | WebhookErrorBody

export type WebhookHandlerResult = {
  body: WebhookResponseBody
  status: 200
}

export type OnPublish = () => void | Promise<void>

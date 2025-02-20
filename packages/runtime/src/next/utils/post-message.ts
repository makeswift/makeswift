import { z } from 'zod'

export const PostMessageType = {
  // Builder handshake messages
  PreviewModeHandshake: 'makeswift_preview_mode',
  DraftModeHandshake: 'makeswift_draft_mode',

  // Alert builder of fetches
  CrossOriginRequestSent: 'cross_origin_request_sent',
  SameOriginResponseReceived: 'same_origin_response_received',

  // Alert builder of *likely* failed attempts to set cookies
  CookieWriteAtRisk: 'cookie_write_at_risk',
} as const

export const cookieRiskMessageSchema = z.object({
  type: z.literal('cookie_write_at_risk'),
  data: z.object({
    version: z.literal(1),
    source: z.union([
      z.literal('cross_origin_request'),
      z.literal('same_site_request'),
      z.literal('local_write'),
    ]),
  }),
})

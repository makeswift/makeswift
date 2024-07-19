import { z } from 'zod'

export const openPageLinkDataSchema = z.object({
  type: z.literal('OPEN_PAGE'),
  payload: z.object({
    pageId: z.string().nullable().optional(),
    openInNewTab: z.boolean(),
  }),
})

export const openUrlLinkDataSchema = z.object({
  type: z.literal('OPEN_URL'),
  payload: z.object({
    url: z.string(),
    openInNewTab: z.boolean(),
  }),
})

export const sendEmailLinkDataSchema = z.object({
  type: z.literal('SEND_EMAIL'),
  payload: z.object({
    to: z.string(),
    subject: z.string().optional(),
    body: z.string().optional(),
  }),
})

export const callPhoneLinkDataSchema = z.object({
  type: z.literal('CALL_PHONE'),
  payload: z.object({
    phoneNumber: z.string(),
  }),
})

export const scrollToElementLink = z.object({
  type: z.literal('SCROLL_TO_ELEMENT'),
  payload: z.object({
    elementIdConfig: z
      .object({
        elementKey: z.string(),
        propName: z.string(),
      })
      .nullable()
      .optional(),
    block: z.enum(['start', 'center', 'end']),
  }),
})

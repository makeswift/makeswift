import { z } from 'zod'

// see https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView#syntax
const scrollLogicalPosition = z.enum(['start', 'center', 'end', 'nearest'])

export const scrollOptions = z.object({
  behavior: z.enum(['smooth', 'instant', 'auto']).optional(),
  block: scrollLogicalPosition.optional(),
  inline: scrollLogicalPosition.optional(),
})

export const link = z.union([
  z.object({
    type: z.literal('OPEN_PAGE'),
    payload: z
      .object({
        pageId: z.string().nullable().optional(),
        openInNewTab: z.boolean(),
      })
      .transform((v) => ({
        pageId: v.pageId,
        ...v,
      })),
  }),

  z.object({
    type: z.literal('OPEN_URL'),
    payload: z.object({
      url: z.string(),
      openInNewTab: z.boolean(),
    }),
  }),

  z.object({
    type: z.literal('SEND_EMAIL'),
    payload: z.object({
      to: z.string(),
      subject: z.string().optional(),
      body: z.string().optional(),
    }),
  }),

  z.object({
    type: z.literal('CALL_PHONE'),
    payload: z.object({
      phoneNumber: z.string(),
    }),
  }),

  z.object({
    type: z.literal('SCROLL_TO_ELEMENT'),
    payload: z
      .object({
        elementIdConfig: z
          .object({
            elementKey: z.string(),
            propName: z.string(),
          })
          .nullable()
          .optional(),
        block: scrollLogicalPosition,
      })
      .transform((v) => ({
        ...v,
        elementIdConfig: v.elementIdConfig,
      })),
  }),
])

export const data = z.union([link, z.null()])
export const target = z.enum(['_blank', '_self'])

import { z } from 'zod'

import { Schema } from '@makeswift/controls'

export const componentDocument = z.object({
  id: z.string(),
  name: z.string().nullable(),
  locale: z.string().nullable(),
  data: Schema.element,
  siteId: z.string(),
  inheritsFromParent: z.boolean(),
})

export const componentDocumentFallback = z.object({
  id: z.string(),
  locale: z.string().nullable(),
  data: z.null(),
})

const unstableNotFoundComponentDocumentResponse = z.object({
  notFound: z.literal(true),
})

export const componentDocumentResponse = z.union([
  unstableNotFoundComponentDocumentResponse,
  componentDocument,
])

import { z } from 'zod'

import { Schema } from '@makeswift/controls'

import { type CacheData } from '../../../api/api-resources-client'

const documentContext = z.object({
  key: z.string(),
  locale: z.string().optional(),
})

const cacheData = z.object({
  apiResources: z.custom<CacheData['apiResources']>(),
  localizedResourcesMap: z.custom<CacheData['localizedResourcesMap']>(),
})

export const RenderElementPayload = {
  schema: z.object({
    elementData: Schema.elementData,
    cacheData,
    documentContext,
  }),
}

export type RenderElementPayload = z.infer<typeof RenderElementPayload.schema>

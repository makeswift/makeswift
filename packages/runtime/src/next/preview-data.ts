// DECOUPLE_TODO: move to a more appropriate place

import { z } from 'zod'
import { makeswiftSiteVersionSchema } from '../api/site-version'

const makeswiftPreviewDataSchema = z.object({
  makeswift: z.literal(true),
  siteVersion: makeswiftSiteVersionSchema,
})

export type MakeswiftPreviewData = z.infer<typeof makeswiftPreviewDataSchema>

export function parseMakeswiftPreviewData(previewData: unknown): MakeswiftPreviewData | null {
  const result = makeswiftPreviewDataSchema.safeParse(previewData)
  return result.success ? result.data : null
}

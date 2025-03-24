import { PreviewData } from 'next'
import { z } from 'zod'
import { type MakeswiftSiteVersion, makeswiftSiteVersionSchema } from '../api/site-version'

const makeswiftPreviewDataSchema = z.object({
  makeswift: z.literal(true),
  siteVersion: makeswiftSiteVersionSchema,
})
export type MakeswiftPreviewData = z.infer<typeof makeswiftPreviewDataSchema>

export function getMakeswiftSiteVersion(previewData: PreviewData): MakeswiftSiteVersion | null {
  const result = makeswiftPreviewDataSchema.safeParse(previewData)

  if (result.success) return result.data.siteVersion

  return null
}

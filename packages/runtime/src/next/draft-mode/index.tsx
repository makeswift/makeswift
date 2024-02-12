import { z } from 'zod'

export const MAKESWIFT_DRAFT_MODE_DATA_COOKIE = 'x-makeswift-draft-data'

const makeswiftSiteVersionSchema = z.enum(['Live', 'Working'])
export const MakeswiftSiteVersion = makeswiftSiteVersionSchema.Enum
export type MakeswiftSiteVersion = z.infer<typeof makeswiftSiteVersionSchema>

export const makeswiftDraftDataSchema = z.object({
  makeswift: z.literal(true),
  siteVersion: makeswiftSiteVersionSchema,
})
export type MakeswiftDraftData = z.infer<typeof makeswiftDraftDataSchema>

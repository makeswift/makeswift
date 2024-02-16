import { z } from 'zod'
import { cookies, draftMode } from 'next/headers'
import { makeswiftSiteVersionSchema, MakeswiftSiteVersion } from '../preview-mode'

export const MAKESWIFT_DRAFT_MODE_DATA_COOKIE = 'x-makeswift-draft-data'

export const makeswiftDraftDataSchema = z.object({
  makeswift: z.literal(true),
  siteVersion: makeswiftSiteVersionSchema,
})

export type MakeswiftDraftData = z.infer<typeof makeswiftDraftDataSchema>

function getDraftData(): MakeswiftDraftData | null {
  const { isEnabled: isDraftModeEnabled } = draftMode()
  if (!isDraftModeEnabled) return null

  const cookie = cookies().get(MAKESWIFT_DRAFT_MODE_DATA_COOKIE)
  if (cookie == null) return null

  const draftData = JSON.parse(cookie.value)
  const result = makeswiftDraftDataSchema.safeParse(draftData)

  if (result.success) return result.data
  return null
}

export function getSiteVersion() {
  return getDraftData()?.siteVersion ?? MakeswiftSiteVersion.Live
}

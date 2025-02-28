import { z } from 'zod'
import { cookies, draftMode } from 'next/headers'
import { MakeswiftSiteVersion, makeswiftSiteVersionSchema } from '../../api/site-version'

export const MAKESWIFT_DRAFT_MODE_DATA_COOKIE = 'x-makeswift-draft-data'

export const makeswiftDraftDataSchema = z.object({
  makeswift: z.literal(true),
  siteVersion: makeswiftSiteVersionSchema,
})

export type MakeswiftDraftData = z.infer<typeof makeswiftDraftDataSchema>

async function getDraftData(): Promise<MakeswiftDraftData | null> {
  const { isEnabled: isDraftModeEnabled } = await draftMode()
  if (!isDraftModeEnabled) return null

  const cookie = (await cookies()).get(MAKESWIFT_DRAFT_MODE_DATA_COOKIE)
  if (cookie == null) return null

  const draftData = JSON.parse(cookie.value)
  const result = makeswiftDraftDataSchema.safeParse(draftData)

  if (result.success) return result.data
  return null
}

export async function getSiteVersion() {
  return (await getDraftData())?.siteVersion ?? MakeswiftSiteVersion.Live
}

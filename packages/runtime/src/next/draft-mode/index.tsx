import { cookies, draftMode } from 'next/headers'
import { MakeswiftVersionData, versionDataPayloadSchema } from '../../api/site-version'

export const MAKESWIFT_VERSION_DATA_COOKIE = 'makeswift-version-data'

async function getDraftData(): Promise<MakeswiftVersionData | null> {
  const { isEnabled: isDraftModeEnabled } = await draftMode()
  if (!isDraftModeEnabled) return null

  const cookie = (await cookies()).get(MAKESWIFT_VERSION_DATA_COOKIE)
  if (cookie == null) return null

  const draftData = JSON.parse(cookie.value)
  const result = versionDataPayloadSchema.safeParse(draftData)

  if (result.success) return result.data
  return null
}

export async function getSiteVersion(): Promise<MakeswiftVersionData | null> {
  return await getDraftData()
}

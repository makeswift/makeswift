import { cookies, draftMode } from 'next/headers'
import { deserializeSiteVersion, MakeswiftVersionData } from '../../api/site-version'
import { MAKESWIFT_VERSION_DATA_COOKIE } from '../api-handler/draft'

async function getDraftData(): Promise<MakeswiftVersionData | null> {
  const { isEnabled: isDraftModeEnabled } = await draftMode()
  if (!isDraftModeEnabled) return null

  const cookie = (await cookies()).get(MAKESWIFT_VERSION_DATA_COOKIE)
  if (cookie == null) return null

  return deserializeSiteVersion(cookie.value)
}

export { getDraftData as getSiteVersion }

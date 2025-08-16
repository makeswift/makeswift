import { cookies, draftMode } from 'next/headers'
import { deserializeSiteVersion, SiteVersion } from '../api/site-version'
import { MAKESWIFT_SITE_VERSION_COOKIE } from './api-handler/preview'

export async function getSiteVersion(): Promise<SiteVersion | null> {
  const { isEnabled: isDraftModeEnabled } = await draftMode()
  if (!isDraftModeEnabled) return null

  const cookie = (await cookies()).get(MAKESWIFT_SITE_VERSION_COOKIE)
  if (cookie == null) return null

  return deserializeSiteVersion(cookie.value)
}

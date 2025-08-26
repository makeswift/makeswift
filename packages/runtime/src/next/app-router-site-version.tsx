import { cookies, draftMode } from 'next/headers'
import { deserializeSiteVersion, SiteVersion } from '../api/site-version'
import { MAKESWIFT_SITE_VERSION_COOKIE, PRERENDER_BYPASS_COOKIE } from './api-handler/preview'

export async function getSiteVersion(): Promise<SiteVersion | null> {
  const { isEnabled: isDraftModeEnabled } = await draftMode()
  if (!isDraftModeEnabled) return null

  const allCookies = await cookies()
  const cookie = allCookies.get(MAKESWIFT_SITE_VERSION_COOKIE)
  if (cookie == null) {
    if (allCookies.get(PRERENDER_BYPASS_COOKIE) == null) {
      // logging this as an error for greater visibility during local development;
      // end-users will not see this warning in production
      console.error(
        'WARNING: Draft mode is enabled, but both the site version and the prerender bypass cookies are missing.\n' +
          'This is abnormal and could cause Makeswift editing and preview to not work as expected.\n' +
          "Double-check that you're not forcing static rendering (export const dynamic = 'force-static') on your Makeswift pages.\n" +
          'More info: https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#dynamic',
      )
    }

    return null
  }

  return deserializeSiteVersion(cookie.value)
}

import { type Context } from 'hono'
import { getCookie } from 'hono/cookie'

import {
  deserializeSiteVersion,
  type SiteVersion,
  MAKESWIFT_SITE_VERSION_COOKIE,
} from '@makeswift/runtime/unstable-framework-support'

export async function getSiteVersion(c: Context): Promise<SiteVersion | null> {
  const cookie = getCookie(c, MAKESWIFT_SITE_VERSION_COOKIE)
  return cookie != null ? deserializeSiteVersion(cookie) : null
}

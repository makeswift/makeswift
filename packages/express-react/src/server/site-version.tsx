import { type Request as ExpressRequest } from 'express'

import {
  deserializeSiteVersion,
  type SiteVersion,
  MAKESWIFT_SITE_VERSION_COOKIE,
} from '@makeswift/runtime/unstable-framework-support'

import { parse as parseCookie } from 'cookie'

export async function getSiteVersion(request: ExpressRequest): Promise<SiteVersion | null> {
  const cookieHeader = request.headers['cookie']
  if (cookieHeader == null) return null

  const cookie = parseCookie(cookieHeader)[MAKESWIFT_SITE_VERSION_COOKIE]
  if (cookie == null) return null

  return deserializeSiteVersion(cookie)
}

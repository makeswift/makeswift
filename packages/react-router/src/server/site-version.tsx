import {
  deserializeSiteVersion,
  type SiteVersion,
} from '@makeswift/runtime/unstable-framework-support'
import { siteVersionCookie } from './preview'

export async function getSiteVersion(request: Request): Promise<SiteVersion | null> {
  const cookieHeader = request.headers.get('Cookie')
  const cookieValue = await siteVersionCookie.parse(cookieHeader)
  if (cookieValue == null) return null

  return deserializeSiteVersion(cookieValue)
}

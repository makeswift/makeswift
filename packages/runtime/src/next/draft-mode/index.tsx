import { cookies, draftMode } from 'next/headers'
import { MakeswiftSiteVersion, SiteRef, siteRefSchema } from '../../api/site-version'
import { jwtKeyFromUuid } from '../api-handler/handlers/utils/draft'
import { jwtVerify } from 'jose'

export const MAKESWIFT_DRAFT_MODE_DATA_COOKIE = 'x-makeswift-ref'

async function getDraftData(): Promise<SiteRef | null> {
  const { isEnabled: isDraftModeEnabled } = await draftMode()
  if (!isDraftModeEnabled) return null

  const cookie = (await cookies()).get(MAKESWIFT_DRAFT_MODE_DATA_COOKIE)
  if (cookie == null) return null

  const jwt = JSON.parse(cookie.value)
  // TODO: If we need to verify the JWT, we need the site api key
  const { payload } = await jwtVerify(jwt, jwtKeyFromUuid(process.env.MAKESWIFT_SITE_API_KEY!))
  const result = siteRefSchema.safeParse(payload)

  if (result.success) return result.data
  return null
}

export async function getSiteVersion() {
  const draftData = await getDraftData()

  if (draftData == null || !('siteVersion' in draftData)) return MakeswiftSiteVersion.Live

  return draftData['siteVersion']
}

export async function getCommitId() {
  const draftData = await getDraftData()

  if (draftData == null || !('commitId' in draftData)) return null

  return draftData['commitId']
}

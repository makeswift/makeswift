import { cookies, draftMode } from 'next/headers'
import { MakeswiftSiteVersion, getMakeswiftSiteVersion } from './preview-mode'

export function getSiteVersion(): MakeswiftSiteVersion {
  const { isEnabled } = draftMode()

  if (isEnabled) {
    const cookie = cookies().get('x-makeswift-draft-mode-data')
    const draftModeData = cookie == null ? null : JSON.parse(cookie.value)

    return getMakeswiftSiteVersion(draftModeData) ?? MakeswiftSiteVersion.Live
  }

  return MakeswiftSiteVersion.Live
}

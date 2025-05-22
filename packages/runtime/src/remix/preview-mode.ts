import { MakeswiftSiteVersion } from '../api/site-version'
import { MakeswiftPreviewData, parseMakeswiftPreviewData } from '../next/preview-data'
import { parse as parseCookieHeader } from 'cookie'

export const MAKESWIFT_PREVIEW_MODE_DATA_COOKIE = 'x-makeswift-preview-data'

function getPreviewData(request: Request): MakeswiftPreviewData | null {
  const cookies = parseCookieHeader(request.headers.get('cookie') ?? '')

  const serializedPreviewData = cookies[MAKESWIFT_PREVIEW_MODE_DATA_COOKIE]
  if (serializedPreviewData == null) return null

  try {
    const previewData = JSON.parse(serializedPreviewData)
    return parseMakeswiftPreviewData(previewData)
  } catch (err) {
    console.error('Failed to extract preview data from ', serializedPreviewData, err)
    return null
  }
}

export async function getSiteVersion(request: Request) {
  return getPreviewData(request)?.siteVersion ?? MakeswiftSiteVersion.Live
}

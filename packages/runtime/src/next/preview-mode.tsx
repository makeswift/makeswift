import { PreviewData } from 'next'
import { MakeswiftSiteVersion } from '../api/site-version'
import { parseMakeswiftPreviewData } from './preview-data'

export { type MakeswiftPreviewData } from './preview-data'

export function getMakeswiftSiteVersion(previewData: PreviewData): MakeswiftSiteVersion | null {
  return parseMakeswiftPreviewData(previewData)?.siteVersion ?? null
}

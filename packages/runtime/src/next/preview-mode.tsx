import { PreviewData } from 'next'

import { versionDataPayloadSchema, MakeswiftVersionData } from '../api/site-version'

export function getMakeswiftSiteVersion(previewData: PreviewData): MakeswiftVersionData | null {
  const result = versionDataPayloadSchema.safeParse(previewData)

  if (result.success) return result.data

  return null
}

export { type MakeswiftVersionData } from '../api/site-version'

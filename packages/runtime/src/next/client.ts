import { PreviewData } from 'next'
import { z } from 'zod'

import { deserializeSiteVersion, type SiteVersion } from '../api/site-version'

import { MakeswiftClient } from '../client'
import { MAKESWIFT_CACHE_TAG } from './cache'

const previewDataSchema = z.object({
  siteVersion: z.string(),
})

export class Makeswift extends MakeswiftClient {
  static getSiteVersion(previewData: PreviewData): SiteVersion | null {
    const parsedSiteVersion = previewDataSchema.safeParse(previewData)
    if (!parsedSiteVersion.success) return null

    return deserializeSiteVersion(parsedSiteVersion.data.siteVersion)
  }

  static getPreviewMode(previewData: PreviewData): boolean {
    return this.getSiteVersion(previewData) != null
  }

  fetchOptions(siteVersion: SiteVersion): Record<string, unknown> {
    return {
      revalidate: siteVersion != null ? 0 : undefined,
      next: {
        revalidate: siteVersion != null ? 0 : undefined,
        tags: [MAKESWIFT_CACHE_TAG],
      },
    }
  }
}

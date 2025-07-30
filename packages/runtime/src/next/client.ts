import { PreviewData } from 'next'

import { type SiteVersion, siteVersionSchema } from '../api/site-version'

import { MakeswiftClient } from '../client'
import { MAKESWIFT_CACHE_TAG } from './cache'

export class Makeswift extends MakeswiftClient {
  static getSiteVersion(previewData: PreviewData): SiteVersion | null {
    const result = siteVersionSchema.safeParse(previewData)

    if (result.success) return result.data

    return null
  }

  static getPreviewMode(previewData: PreviewData): boolean {
    return this.getSiteVersion(previewData) != null
  }

  fetchOptions(_siteVersion: SiteVersion): Record<string, unknown> {
    return {
      next: {
        tags: [MAKESWIFT_CACHE_TAG],
      },
    }
  }
}

import { PreviewData } from 'next'

import { MakeswiftVersionData } from '../api/site-version'
import { getMakeswiftSiteVersion } from './preview-mode'

import { MakeswiftClient } from '../client'
import { MAKESWIFT_CACHE_TAG } from './cache'

export class Makeswift extends MakeswiftClient {
  static getSiteVersion(previewData: PreviewData): MakeswiftVersionData | null {
    return getMakeswiftSiteVersion(previewData)
  }

  static getPreviewMode(previewData: PreviewData): boolean {
    return getMakeswiftSiteVersion(previewData) != null
  }

  fetchOptions(_siteVersion: MakeswiftVersionData | null): Record<string, unknown> {
    return {
      next: {
        tags: [MAKESWIFT_CACHE_TAG],
      },
    }
  }
}

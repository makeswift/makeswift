import { PreviewData } from 'next'

import { MakeswiftSiteVersion } from '../api/site-version'
import { getMakeswiftSiteVersion } from './preview-mode'

import { MakeswiftClient } from '../client'
import { MAKESWIFT_CACHE_TAG } from './cache'

export class Makeswift extends MakeswiftClient {

  static getSiteVersion(previewData: PreviewData): MakeswiftSiteVersion {
    return getMakeswiftSiteVersion(previewData) ?? MakeswiftSiteVersion.Live
  }

  static getPreviewMode(previewData: PreviewData): boolean {
    return getMakeswiftSiteVersion(previewData) === MakeswiftSiteVersion.Working
  }

  fetchOptions(
    _siteVersion: MakeswiftSiteVersion,
  ): Record<string, unknown> {
    return {
      next: {
        tags: [MAKESWIFT_CACHE_TAG],
      },
    }
  }
}

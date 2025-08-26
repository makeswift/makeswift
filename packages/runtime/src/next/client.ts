import { PreviewData } from 'next'
import { z } from 'zod'

import { deserializeSiteVersion, type SiteVersion } from '../api/site-version'

import { MakeswiftClient, MakeswiftConfig } from '../client'
import { MAKESWIFT_GLOBAL_CACHE_TAG } from './cache'

const previewDataSchema = z.object({
  siteVersion: z.string(),
})

export enum RevalidationTagStrategy {
  GRANULAR = 'granular',
  GLOBAL = 'global',
  NONE = 'none',
}

export class Makeswift extends MakeswiftClient {
  private revalidationTagStrategy: RevalidationTagStrategy

  constructor(apiKey: string, config: MakeswiftConfig, revalidationTagStrategy: RevalidationTagStrategy = RevalidationTagStrategy.GLOBAL) {
    super(apiKey, config)
    this.revalidationTagStrategy = revalidationTagStrategy
  }

  static getSiteVersion(previewData: PreviewData): SiteVersion | null {
    const parsedSiteVersion = previewDataSchema.safeParse(previewData)
    if (!parsedSiteVersion.success) return null

    return deserializeSiteVersion(parsedSiteVersion.data.siteVersion)
  }

  static getPreviewMode(previewData: PreviewData): boolean {
    return this.getSiteVersion(previewData) != null
  }

  fetchOptions(_siteVersion: SiteVersion, cacheTags?: string[]): Record<string, unknown> {
    switch (this.revalidationTagStrategy) {
      case RevalidationTagStrategy.GRANULAR:
        return {
          next: {
            tags: cacheTags ? [...cacheTags] : [MAKESWIFT_GLOBAL_CACHE_TAG],
          },
        }
      case RevalidationTagStrategy.GLOBAL:
        return {
          next: {
            tags: [MAKESWIFT_GLOBAL_CACHE_TAG],
          },
        }
      case RevalidationTagStrategy.NONE:
        return {}
    }
  }
}

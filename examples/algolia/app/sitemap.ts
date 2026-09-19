import { MetadataRoute } from 'next'

import { MakeswiftPage } from '@makeswift/runtime/next'

import { env } from '@/env'
import { client } from '@/lib/makeswift/client'

type NextSitemapItem = MetadataRoute.Sitemap[number]

const DOMAIN = env.NEXT_PUBLIC_SITE_URL ?? 'https://example.com'
const DEFAULT_PRIORITY = 0.75
const DEFAULT_FREQUENCY = 'hourly'

function pageToSitemapEntry(page: MakeswiftPage): NextSitemapItem {
  const pageUrl = new URL(page.path, DOMAIN)
  return {
    url: pageUrl.href,
    lastModified: page.updatedAt,
    changeFrequency: page.sitemapFrequency ?? DEFAULT_FREQUENCY,
    priority: page.sitemapPriority ?? DEFAULT_PRIORITY,
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages: MakeswiftPage[] = []
  let cursor: string | undefined = undefined
  let hasMorePages = true

  do {
    const paginatedResults = await client.getPages({
      limit: 100, // Maximum allowed limit (1-100)
      after: cursor,
    })

    pages.push(...paginatedResults.data)
    hasMorePages = paginatedResults.hasMore
    cursor = paginatedResults.data.at(-1)?.id
  } while (hasMorePages)

  return pages.filter(page => !page.excludedFromSearch).map(page => pageToSitemapEntry(page))
}

import { MetadataRoute } from 'next'

import { MakeswiftPage } from '@makeswift/runtime/next'

import { env } from '@/env'
import { client } from '@/lib/makeswift/client'
import { getAllBlogs } from '@/lib/contentful/fetchers'
import { type BlogPostFromQuery } from '@/lib/contentful/format'

type NextSitemapItem = MetadataRoute.Sitemap[number]

const DOMAIN = env.NEXT_PUBLIC_SITE_URL
const DEFAULT_PRIORITY = 0.75
const DEFAULT_FREQUENCY = 'hourly'

function pageToSitemapEntry(page: MakeswiftPage): NextSitemapItem {
  const pageUrl = new URL(page.path, DOMAIN)
  return {
    url: pageUrl.href,
    lastModified: page.createdAt,
    changeFrequency: page.sitemapFrequency ?? DEFAULT_FREQUENCY,
    priority: page.sitemapPriority ?? DEFAULT_PRIORITY,
  }
}

function contentfulToSitemapEntry(blog: BlogPostFromQuery): NextSitemapItem {
  const pageUrl = new URL(`/blog/${blog.slug}`, DOMAIN)
  return {
    url: pageUrl.href,
    lastModified: blog.sys?.publishedAt || blog.feedDate,
    changeFrequency: DEFAULT_FREQUENCY, 
    priority: DEFAULT_PRIORITY,
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

  const makeswiftPages = pages.filter(page => !page.excludedFromSearch).map(page => pageToSitemapEntry(page))
  const contentfulPages = (await getAllBlogs()).map(blog => contentfulToSitemapEntry(blog))
  
  return [...makeswiftPages, ...contentfulPages]
}

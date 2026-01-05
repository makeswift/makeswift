import { MetadataRoute } from 'next'

import { MakeswiftPage } from '@makeswift/runtime/next'

import { env } from '@/env'
import { getAllBlogs } from '@/lib/contentstack/fetchers'
import { type BlogPostFromQuery } from '@/lib/contentstack/format'
import { client } from '@/lib/makeswift/client'

type NextSitemapItem = MetadataRoute.Sitemap[number]

const SITE_URL = env.NEXT_PUBLIC_SITE_URL
const DEFAULT_PRIORITY = 0.75
const DEFAULT_FREQUENCY = 'hourly'

function makeswiftPageToSitemapEntry(page: MakeswiftPage): NextSitemapItem {
  const pageUrl = new URL(page.path, SITE_URL)
  return {
    url: pageUrl.href,
    lastModified: page.createdAt,
    changeFrequency: page.sitemapFrequency ?? DEFAULT_FREQUENCY,
    priority: page.sitemapPriority ?? DEFAULT_PRIORITY,
  }
}

function contentstackToSitemapEntry(blog: BlogPostFromQuery): NextSitemapItem | null {
  if (!blog.slug) {
    return null
  }
  
  const pageUrl = new URL(`/blog/${blog.slug}`, SITE_URL)
  return {
    url: pageUrl.href,
    lastModified: blog.system?.updated_at || blog.feed_date,
    changeFrequency: DEFAULT_FREQUENCY,
    priority: DEFAULT_PRIORITY,
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const makeswiftPages = await client
    .getPages()
    .filter(page => !page.excludedFromSearch)
    .map(page => makeswiftPageToSitemapEntry(page))
    .toArray()
  const contentstackPages = (await getAllBlogs())
    .map(blog => contentstackToSitemapEntry(blog))
    .filter((entry): entry is NextSitemapItem => entry !== null)

  return [...makeswiftPages, ...contentstackPages]
}

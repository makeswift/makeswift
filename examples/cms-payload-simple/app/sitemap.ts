import { MetadataRoute } from 'next'

import { MakeswiftPage } from '@makeswift/runtime/next'

import { env } from '@/env'
import { client } from '@/lib/makeswift/client'
import { getAllBlogs } from '@/lib/payload/fetchers'
import { type BlogPostData } from '@/lib/payload/format'

type NextSitemapItem = MetadataRoute.Sitemap[number]

const SITE_URL = env.NEXT_PUBLIC_SITE_URL
const DEFAULT_PRIORITY = 0.75
const DEFAULT_FREQUENCY = 'hourly'

function pageToSitemapEntry(page: MakeswiftPage): NextSitemapItem {
  const pageUrl = new URL(page.path, SITE_URL)
  return {
    url: pageUrl.href,
    lastModified: page.createdAt,
    changeFrequency: page.sitemapFrequency ?? DEFAULT_FREQUENCY,
    priority: page.sitemapPriority ?? DEFAULT_PRIORITY,
  }
}

function contentfulToSitemapEntry(blog: BlogPostData): NextSitemapItem {
  const pageUrl = new URL(`/blog/${blog.slug}`, SITE_URL)
  return {
    url: pageUrl.href,
    lastModified: blog.updatedAt || blog.feedDate,
    changeFrequency: DEFAULT_FREQUENCY,
    priority: DEFAULT_PRIORITY,
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const makeswiftPages = await client
    .getPages()
    .filter(page => !page.excludedFromSearch)
    .map(page => pageToSitemapEntry(page))
    .toArray()
  const contentfulPages = (await getAllBlogs()).map(blog => contentfulToSitemapEntry(blog))

  return [...makeswiftPages, ...contentfulPages]
}

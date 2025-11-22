import { MetadataRoute } from 'next'

import { MakeswiftPage } from '@makeswift/runtime/next'

import { env } from '@/env'
import { getAllBlogs } from '@/lib/dato/fetchers'
import { type BlogPostFromQuery } from '@/lib/dato/format'
import { client } from '@/lib/makeswift/client'

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

function datoToSitemapEntry(blog: BlogPostFromQuery): NextSitemapItem {
  const pageUrl = new URL(`/blog/${blog.slug}`, SITE_URL)
  return {
    url: pageUrl.href,
    lastModified: blog?.feedDate ?? blog._publishedAt,
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
  const datoPages = (await getAllBlogs()).map(blog => datoToSitemapEntry(blog))
  console.log({ datoPages })

  return [...makeswiftPages, ...datoPages]
}

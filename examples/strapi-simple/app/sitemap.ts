import { MetadataRoute } from 'next'

import { MakeswiftPage } from '@makeswift/runtime/next'

import { env } from '@/env'
import { client } from '@/lib/makeswift/client'
import { getAllBlogs } from '@/lib/strapi/fetchers'
import { type BlogPostFromQuery } from '@/lib/strapi/format'

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

function strapiToSitemapEntry(blog: BlogPostFromQuery): NextSitemapItem | null {
  if (!blog.slug) {
    return null
  }

  const pageUrl = new URL(`/blog/${blog.slug}`, DOMAIN)
  return {
    url: pageUrl.href,
    lastModified: blog.publishedAt,
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
  const strapiPages = (await getAllBlogs())
    .map(blog => strapiToSitemapEntry(blog))
    .filter(entry => entry !== null)

  return [...makeswiftPages, ...strapiPages]
}

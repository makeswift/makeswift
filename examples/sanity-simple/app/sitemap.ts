import { MetadataRoute } from 'next'

import { MakeswiftPage } from '@makeswift/runtime/next'

import { env } from '@/env'
import { client } from '@/lib/makeswift/client'
import { getAllBlogs } from '@/lib/sanity/fetchers'
import { type BlogPostData } from '@/lib/sanity/format'

type NextSitemapItem = MetadataRoute.Sitemap[number]

const DOMAIN = env.NEXT_PUBLIC_SITE_URL
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

function sanityToSitemapEntry(blog: BlogPostData): NextSitemapItem | null {
  if (!blog.slug?.current) {
    return null
  }

  const pageUrl = new URL(`/blog/${blog.slug.current}`, DOMAIN)
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
  const sanityPages = (await getAllBlogs())
    .map(blog => sanityToSitemapEntry(blog))
    .filter(entry => entry !== null)

  return [...makeswiftPages, ...sanityPages]
}

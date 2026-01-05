import { MetadataRoute } from 'next'

import { MakeswiftPage } from '@makeswift/runtime/next'

import { env } from '@/env'
import { client } from '@/lib/makeswift/client'
import { getAllBlogs } from '@/lib/prismic/fetchers'
import { type BlogPost } from '@/lib/prismic/format'

type NextSitemapItem = MetadataRoute.Sitemap[number]

const SITE_URL = env.NEXT_PUBLIC_SITE_URL
const DEFAULT_PRIORITY = 0.75
const DEFAULT_FREQUENCY = 'hourly'

function pageToSitemapEntry(page: MakeswiftPage): NextSitemapItem {
  const pageUrl = new URL(page.path, SITE_URL)
  return {
    url: pageUrl.href,
    lastModified: page.updatedAt,
    changeFrequency: page.sitemapFrequency ?? DEFAULT_FREQUENCY,
    priority: page.sitemapPriority ?? DEFAULT_PRIORITY,
  }
}

function prismicToSitemapEntry(blog: BlogPost): NextSitemapItem | null {
  if (!blog._meta.uid) {
    return null
  }
  
  const pageUrl = new URL(`/blog/${blog._meta.uid}`, SITE_URL)
  return {
    url: pageUrl.href,
    lastModified: blog._meta.lastPublicationDate,
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
  const prismicPages = (await getAllBlogs())
    .map(blog => prismicToSitemapEntry(blog))
    .filter((entry): entry is NextSitemapItem => entry !== null)

  return [...makeswiftPages, ...prismicPages]
}

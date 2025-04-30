import { notFound } from 'next/navigation'

import { MakeswiftComponent } from '@makeswift/runtime/next'
import { getSiteVersion } from '@makeswift/runtime/next/server'

import { BLOG_POST_EMBEDDED_COMPONENT_ID } from '@/components/Blog/Blog.makeswift'
import { BlogOrder, GetBlogsDocument } from '@/generated/contentful'
import { client } from '@/lib/contentful/client'
import { client as MakeswiftClient } from '@/lib/makeswift/client'

import { SWRProvider } from './swr-provider'

const PAGINATION_LIMIT = 100 // Contentful's max items per page

async function getAllBlogs() {
  let allItems = []
  let hasMore = true
  let skip = 0

  while (hasMore) {
    const { blogCollection } = await client.request(GetBlogsDocument, {
      limit: PAGINATION_LIMIT,
      skip,
      order: [BlogOrder.FeedDateDesc],
    })

    const items = blogCollection?.items ?? []
    allItems.push(...items)

    hasMore = items.length === PAGINATION_LIMIT
    skip += PAGINATION_LIMIT
  }

  return allItems
}

export async function generateStaticParams() {
  const blogs = await getAllBlogs()
  return blogs.map(blog => ({ slug: blog?.slug }))
}

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params

  // Fetch all blogs and validate the slug
  const blogs = await getAllBlogs()
  const validSlugs = new Set(blogs.map(blog => blog?.slug))

  // Check if the slug exists
  if (!slug || !validSlugs.has(slug)) {
    return notFound()
  }

  const componentSnapshot = await MakeswiftClient.getComponentSnapshot(`blog-${slug}`, {
    siteVersion: await getSiteVersion(),
  })

  if (componentSnapshot == null) return notFound()

  // Get the specific blog data for SWR
  const blogData = await client.request(GetBlogsDocument, {
    filter: { slug },
  })

  return (
    <SWRProvider
      fallback={{
        [`blog/${slug}`]: blogData,
      }}
    >
      <MakeswiftComponent
        snapshot={componentSnapshot}
        label="Blog Page"
        type={BLOG_POST_EMBEDDED_COMPONENT_ID}
      />
    </SWRProvider>
  )
}

import { BlogPostOrder, GetBlogsDocument, GetBlogsQuery } from '@/generated/contentful'

import { client } from './client'
import { type BlogPostFromQuery } from './format'

export const PAGINATION_LIMIT = 100 // Contentful's max items per page

export async function getBlogPost(slug: string): Promise<BlogPostFromQuery | null> {
  const { blogPostCollection } = await client.request<GetBlogsQuery>(GetBlogsDocument, {
    filter: { slug },
  })

  if (!blogPostCollection || blogPostCollection.items.length === 0) {
    return null
  }

  return blogPostCollection.items[0] ?? null
}

export async function getPaginatedBlogs(
  limit: number,
  skip: number
): Promise<{
  blogs: BlogPostFromQuery[]
  total: number
  hasMore: boolean
}> {
  const { blogPostCollection } = await client.request<GetBlogsQuery>(GetBlogsDocument, {
    limit,
    skip,
    order: [BlogPostOrder.FeedDateDesc],
  })

  const items = blogPostCollection?.items ?? []
  const blogs = items.filter((item): item is BlogPostFromQuery => Boolean(item))

  const total = blogPostCollection?.total ?? 0
  const hasMore = skip + blogs.length < total

  return {
    blogs,
    total,
    hasMore,
  }
}

export async function getAllBlogs(): Promise<BlogPostFromQuery[]> {
  let allBlogs: BlogPostFromQuery[] = []
  let skip = 0

  while (true) {
    const { blogs, hasMore } = await getPaginatedBlogs(PAGINATION_LIMIT, skip)

    allBlogs.push(...blogs)

    if (!hasMore) {
      break
    }

    skip += PAGINATION_LIMIT
  }

  return allBlogs
}

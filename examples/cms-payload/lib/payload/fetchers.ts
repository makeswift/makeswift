import { GetBlogsDocument, GetBlogsQuery } from '@/generated/payload'

import { client } from './client'
import { type BlogPostData } from './format'

export const PAGINATION_LIMIT = 100 // Payload's max items per page

export async function getBlogPost(slug: string): Promise<BlogPostData | null> {
  const { Posts } = await client.request<GetBlogsQuery>(GetBlogsDocument, {
    where: { slug: { equals: slug } },
  })

  if (!Posts || Posts.docs.length === 0) {
    return null
  }

  return Posts.docs[0] ?? null
}

export async function getPaginatedBlogs(
  limit: number,
  offset: number
): Promise<{
  blogs: BlogPostData[]
  total: number
  hasMore: boolean
}> {
  const { Posts } = await client.request<GetBlogsQuery>(GetBlogsDocument, {
    limit,
    page: offset,
    sort: '-feedDate',
  })

  const blogs = Posts?.docs?.filter((item): item is BlogPostData => Boolean(item)) ?? []

  // For simplicity, we'll estimate total. In a real app, you'd want a separate query for total count
  const total = blogs.length + offset
  const hasMore = blogs.length === limit

  return {
    blogs,
    total,
    hasMore,
  }
}

export async function getAllBlogs(): Promise<BlogPostData[]> {
  let allBlogs: BlogPostData[] = []
  let offset = 0

  while (true) {
    const { blogs, hasMore } = await getPaginatedBlogs(PAGINATION_LIMIT, offset)

    allBlogs.push(...blogs)

    if (!hasMore) {
      break
    }

    offset += PAGINATION_LIMIT
  }

  return allBlogs
}

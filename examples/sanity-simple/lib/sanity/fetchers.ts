import { GetBlogsDocument, GetBlogsQuery } from '@/generated/sanity'

import { client } from './client'
import { type BlogPostData } from './format'

export const PAGINATION_LIMIT = 100 // Sanity's max items per page

export async function getBlogPost(slug: string): Promise<BlogPostData | null> {
  const { allPost } = await client.request<GetBlogsQuery>(GetBlogsDocument, {
    where: { slug: { current: { eq: slug } } },
    limit: 1,
  })

  if (!allPost || allPost.length === 0) {
    return null
  }

  return allPost[0] ?? null
}

export async function getPaginatedBlogs(
  limit: number,
  offset: number
): Promise<{
  blogs: BlogPostData[]
  total: number
  hasMore: boolean
}> {
  const { allPost } = await client.request<GetBlogsQuery>(GetBlogsDocument, {
    limit,
    offset,
    sort: [{ publishedAt: 'DESC' }],
  })

  const blogs = allPost?.filter((item): item is BlogPostData => Boolean(item)) ?? []

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

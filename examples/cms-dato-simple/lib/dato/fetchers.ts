import {
  BlogpostModelOrderBy,
  GetBlogDocument,
  GetBlogQuery,
  GetBlogsDocument,
  GetBlogsQuery,
} from '@/generated/dato'

import { client } from './client'
import { type BlogPostFromQuery } from './format'

export const PAGINATION_LIMIT = 100 // DatoCMS max items per page

export async function getBlogPost(slug: string): Promise<BlogPostFromQuery | null> {
  const { blogpost } = await client.request<GetBlogQuery>(GetBlogDocument, {
    slug,
  })

  return blogpost ?? null
}

export async function getPaginatedBlogs(
  limit: number,
  skip: number
): Promise<{
  blogs: BlogPostFromQuery[]
  total: number
  hasMore: boolean
}> {
  const { allBlogposts } = await client.request<GetBlogsQuery>(GetBlogsDocument, {
    limit,
    skip,
    order: [BlogpostModelOrderBy.FeedDateDesc],
  })

  const blogs = allBlogposts ?? []
  const total = blogs.length + skip + (blogs.length === limit ? 1 : 0)
  const hasMore = blogs.length === limit

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

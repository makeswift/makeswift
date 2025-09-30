import { GetBlogsDocument, GetBlogsQuery } from '@/generated/contentstack'

import { client } from './client'
import { type BlogPostFromQuery } from './format'

export const PAGINATION_LIMIT = 100 // Contentstack's max items per page

export async function getBlogPost(slug: string): Promise<BlogPostFromQuery | null> {
  const { all_blog_post } = await client.request<GetBlogsQuery>(GetBlogsDocument, {
    where: { slug },
  })

  if (!all_blog_post || all_blog_post?.items?.length === 0) {
    return null
  }

  return all_blog_post?.items?.[0] ?? null
}

export async function getPaginatedBlogs(
  limit: number,
  skip: number
): Promise<{
  blogs: BlogPostFromQuery[]
  total: number
  hasMore: boolean
}> {
  const { all_blog_post } = await client.request<GetBlogsQuery>(GetBlogsDocument, {
    limit,
    skip,
  })

  const items = all_blog_post?.items ?? []
  const blogs = items.filter((item): item is BlogPostFromQuery => Boolean(item))

  const total = all_blog_post?.total ?? 0
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

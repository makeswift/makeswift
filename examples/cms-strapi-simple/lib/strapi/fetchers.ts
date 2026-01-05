import { GetBlogPostsDocument, GetBlogPostsQuery } from '@/generated/strapi'

import { client } from './client'
import { type BlogPostFromQuery } from './format'

export const PAGINATION_LIMIT = 100 // Strapi's default pagination limit

export async function getBlogPost(slug: string): Promise<BlogPostFromQuery | null> {
  const { blogPosts } = await client.request(GetBlogPostsDocument)

  if (!blogPosts) {
    return null
  }

  const post = blogPosts.find(post => post?.slug === slug)
  return post ?? null
}

export async function getPaginatedBlogs(
  limit: number,
  skip: number
): Promise<{
  blogs: BlogPostFromQuery[]
  total: number
  hasMore: boolean
}> {
  const { blogPosts } = await client.request<GetBlogPostsQuery>(GetBlogPostsDocument)

  const items = blogPosts ?? []
  const blogs = items.filter((item): item is BlogPostFromQuery => Boolean(item))

  const paginatedBlogs = blogs.slice(skip, skip + limit)
  const total = blogs.length
  const hasMore = skip + paginatedBlogs.length < total

  return {
    blogs: paginatedBlogs,
    total,
    hasMore,
  }
}

export async function getAllBlogs(): Promise<BlogPostFromQuery[]> {
  const { blogPosts } = await client.request<GetBlogPostsQuery>(GetBlogPostsDocument)

  if (!blogPosts) {
    return []
  }

  return blogPosts.filter((item): item is BlogPostFromQuery => Boolean(item))
}

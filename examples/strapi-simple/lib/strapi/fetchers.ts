import { AllBlogsDocument, AllBlogsQuery } from '@/generated/strapi'

import { client } from './client'
import { type BlogPostFromQuery } from './format'

export const PAGINATION_LIMIT = 100 // Strapi's default pagination limit

export async function getBlogPost(slug: string): Promise<BlogPostFromQuery | null> {
  const { articles } = await client.request(AllBlogsDocument)

  if (!articles) {
    return null
  }

  const article = articles.find(article => article?.slug === slug)
  return article ?? null
}

export async function getPaginatedBlogs(
  limit: number,
  skip: number
): Promise<{
  blogs: BlogPostFromQuery[]
  total: number
  hasMore: boolean
}> {
  const { articles } = await client.request<AllBlogsQuery>(AllBlogsDocument)

  const items = articles ?? []
  const blogs = items.filter((item): item is BlogPostFromQuery => Boolean(item))

  // Simple pagination simulation since Strapi query doesn't include pagination params yet
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
  const { articles } = await client.request<AllBlogsQuery>(AllBlogsDocument)

  if (!articles) {
    return []
  }

  return articles.filter((item): item is BlogPostFromQuery => Boolean(item))
}

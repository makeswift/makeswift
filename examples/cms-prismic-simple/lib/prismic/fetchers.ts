import {
  Blogpost,
  BlogpostConnectionEdge,
  GetBlogDocument,
  GetBlogQuery,
  GetBlogsDocument,
  GetBlogsQuery,
  SortBlogposty,
} from '@/generated/prismic'

import { client } from './client'
import { type BlogPostSummary } from './format'

export const PAGINATION_LIMIT = 100 // Prismic's max items per page

export async function getBlogPost(slug: string) {
  const { blogpost } = await client.request(GetBlogDocument, {
    uid: slug,
  })

  if (!blogpost) {
    return null
  }

  return blogpost
}

export async function getPaginatedBlogs(
  limit: number,
  after?: string
): Promise<{
  blogs: BlogPostSummary[]
  total: number
  hasMore: boolean
  endCursor?: string
}> {
  const { allBlogposts } = await client.request<GetBlogsQuery>(GetBlogsDocument, {
    first: limit,
    after,
    sortBy: SortBlogposty.FeedDateDesc,
  })

  const edges = allBlogposts?.edges ?? []
  const blogs = edges
    .filter((edge): edge is NonNullable<typeof edge> => Boolean(edge))
    .map(edge => edge.node)
    .filter((node): node is BlogPostSummary => Boolean(node))

  const total = Number(allBlogposts?.totalCount ?? 0)
  const hasMore = allBlogposts?.pageInfo?.hasNextPage ?? false
  const endCursor = allBlogposts?.pageInfo?.endCursor ?? undefined

  return {
    blogs,
    total,
    hasMore,
    endCursor,
  }
}

export async function getAllBlogs(): Promise<BlogPostSummary[]> {
  let allBlogs: BlogPostSummary[] = []
  let after: string | undefined = undefined

  while (true) {
    const { blogs, hasMore, endCursor } = await getPaginatedBlogs(PAGINATION_LIMIT, after)

    allBlogs.push(...blogs)

    if (!hasMore) {
      break
    }

    after = endCursor
  }

  return allBlogs
}

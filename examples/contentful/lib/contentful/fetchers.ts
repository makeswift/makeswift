import { BlogPostOrder, GetBlogsDocument } from '@/generated/contentful'

import { client } from './client'

const PAGINATION_LIMIT = 100 // Contentful's max items per page

export async function getAllBlogs() {
  let allBlogs = []
  let hasMore = true
  let skip = 0

  while (hasMore) {
    const { blogPostCollection } = await client.request(GetBlogsDocument, {
      limit: PAGINATION_LIMIT,
      skip,
      order: [BlogPostOrder.FeedDateDesc],
    })

    const items = blogPostCollection?.items ?? []
    allBlogs.push(...items)

    hasMore = items.length === PAGINATION_LIMIT
    skip += PAGINATION_LIMIT
  }

  return allBlogs
}

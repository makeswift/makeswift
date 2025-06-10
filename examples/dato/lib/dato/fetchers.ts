import { BlogpostModelOrderBy, GetBlogsDocument } from '@/generated/dato'

import { client } from './client'

const PAGINATION_LIMIT = 100 // Dato's max items per page

export async function getAllBlogs() {
  let allBlogs = []
  let hasMore = true
  let skip = 0

  while (hasMore) {
    const { allBlogposts } = await client.request(GetBlogsDocument, {
      first: PAGINATION_LIMIT,
      skip,
      order: [BlogpostModelOrderBy.FeedDateDesc],
    })

    const items = allBlogposts ?? []
    allBlogs.push(...items)

    hasMore = items.length === PAGINATION_LIMIT
    skip += PAGINATION_LIMIT
  }

  return allBlogs
}

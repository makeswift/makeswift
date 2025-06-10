import { GetBlogsDocument, GetBlogsQuery, SortBlogposty } from '@/generated/prismic'

import { client } from './client'

const PAGINATION_LIMIT = 1000 // Prismic's max items per page

export async function getAllBlogs() {
  let allBlogs = []
  let hasMore = true
  let after: string | undefined = undefined

  while (hasMore) {
    const { allBlogposts }: GetBlogsQuery = await client.request(GetBlogsDocument, {
      first: PAGINATION_LIMIT,
      after,
      sortBy: SortBlogposty.FeedDateDesc,
    })

    const edges = allBlogposts.edges ?? []
    const items = edges.map(edge => edge?.node).filter(Boolean)
    allBlogs.push(...items)

    hasMore = allBlogposts.pageInfo.hasNextPage
    after = allBlogposts.edges?.[0]?.cursor ?? undefined
  }

  return allBlogs
}

import { NextRequest } from 'next/server'

import { PAGINATION_LIMIT, getPaginatedBlogs } from '@/lib/contentstack/fetchers'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const limit = parseInt(searchParams.get('limit') ?? '10', 10)
  const skip = parseInt(searchParams.get('skip') ?? '0', 10)

  if (isNaN(limit) || limit < 1 || limit > PAGINATION_LIMIT) {
    return Response.json(
      { error: `Invalid 'limit' parameter. Must be between 1 and ${PAGINATION_LIMIT}.` },
      { status: 400 }
    )
  }

  if (isNaN(skip) || skip < 0) {
    return Response.json(
      { error: "Invalid 'skip' parameter. Must be 0 or greater." },
      { status: 400 }
    )
  }

  try {
    const { blogs, total, hasMore } = await getPaginatedBlogs(limit, skip)

    return Response.json({
      // omit the body, it can be large and is not needed for the feed
      blogs: blogs.map(blog => ({ ...blog, body: undefined })),
      total,
      hasMore,
    })
  } catch (error) {
    console.error('Error fetching blogs:', error)

    return Response.json({ error: 'Failed to fetch blogs' }, { status: 500 })
  }
}

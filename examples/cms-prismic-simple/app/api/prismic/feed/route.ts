import { NextRequest, NextResponse } from 'next/server'

import { client } from '@/lib/prismic/client'
import { GetBlogsDocument, GetBlogsQuery, SortBlogposty } from '@/generated/prismic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50)
    const skip = parseInt(searchParams.get('skip') || '0')

    // Calculate pagination cursor from skip
    let after: string | undefined = undefined
    if (skip > 0) {
      // For simplicity, we'll fetch all blogs and slice them
      // In production, you'd want to implement proper cursor-based pagination
    }

    const { allBlogposts }: GetBlogsQuery = await client.request(GetBlogsDocument, {
      first: limit + skip, // Get extra to handle skip
      after,
      sortBy: SortBlogposty.FeedDateDesc,
    })

    const edges = allBlogposts.edges ?? []
    const allBlogs = edges.map(edge => edge?.node).filter(Boolean)
    
    // Handle skip by slicing the results
    const blogs = allBlogs.slice(skip, skip + limit)
    const total = allBlogposts.totalCount ?? 0

    return NextResponse.json({
      blogs,
      total,
      hasMore: skip + limit < total,
    })
  } catch (error) {
    console.error('Error fetching blog feed:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog feed' },
      { status: 500 }
    )
  }
} 
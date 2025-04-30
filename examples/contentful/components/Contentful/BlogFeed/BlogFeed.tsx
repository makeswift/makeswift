'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import clsx from 'clsx'
import useSWR from 'swr'

import { BlogOrder, GetBlogsDocument, GetBlogsQueryVariables } from '@/generated/contentful'
import { client } from '@/lib/contentful/client'

type Props = {
  className?: string
}

const DEFAULT_PARAMS: GetBlogsQueryVariables = {
  limit: 3,
  skip: 0,
  order: [BlogOrder.FeedDateDesc],
}

export function BlogFeed({ className }: Props) {
  const [{ limit, skip, order }, setParams] = useState({
    ...DEFAULT_PARAMS,
  })

  const { data, error, isLoading } = useSWR(
    `blog/feed/${limit}/${skip}/${JSON.stringify(order)}`,
    () =>
      client.request(GetBlogsDocument, {
        limit,
        skip,
        order,
      } as any),
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
    }
  )

  const [items, setItems] = useState(data?.blogCollection?.items ?? [])
  const total = data?.blogCollection?.total ?? 0

  useEffect(() => {
    setItems(prev => [
      ...prev.slice(0, skip),
      ...(data?.blogCollection?.items ?? []),
      ...prev.slice((skip || 0) + (limit || 0)),
    ])
  }, [data, limit, skip])

  if (error) {
    console.error('Blog feed error:', error)
    return (
      <div className={clsx(className, 'flex items-center justify-center p-4 sm:p-6 md:p-8')}>
        <div className="text-center">
          <h2 className="text-lg font-bold text-red-600 sm:text-xl">Error loading blog posts</h2>
          <p className="mt-2 text-sm text-gray-600 sm:text-base">Please try again later</p>
        </div>
      </div>
    )
  }

  return (
    <div className={clsx(className, '@container space-y-12')}>
      <div className="@sm:grid-cols-2 @xl:grid-cols-3 grid grid-cols-1 gap-8">
        {items.map(post => (
          <Link
            key={post?._id}
            className="group relative flex flex-col overflow-hidden rounded-lg bg-white shadow-lg transition-all duration-300 hover:shadow-xl"
            href={`/blog/${post?.slug}`}
            aria-label={`Read more about ${post?.title}`}
          >
            <div className="relative aspect-[16/9] w-full overflow-hidden">
              {post?.banner?.url && post.banner.width && post.banner.height && (
                <Image
                  alt={post.banner.description ?? `Hero image for blog post: ${post?.title}`}
                  src={post.banner.url}
                  width={post.banner.width}
                  height={post.banner.height}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              )}
            </div>
            <div className="flex flex-1 flex-col p-6">
              <div className="flex-1 space-y-3">
                <h3 className="line-clamp-2 text-xl font-bold text-gray-900 group-hover:text-blue-600">
                  {post?.title}
                </h3>
                <p className="line-clamp-3 text-gray-600">{post?.description}</p>
              </div>
              <div className="mt-4 flex items-center text-sm text-gray-500">
                {post?.feedDate && (
                  <time dateTime={post.feedDate}>
                    {new Date(post.feedDate).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </time>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {items.length < total && (
        <div className="flex justify-center">
          <button
            disabled={isLoading}
            onClick={() => {
              if (items.length < total) {
                setParams(prev => ({ ...prev, skip: (prev.skip || 0) + (prev.limit || 0) }))
              }
            }}
            className={clsx(
              'inline-flex items-center rounded-lg px-6 py-3 font-medium transition-colors',
              isLoading
                ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            )}
            aria-label="Load more blog posts"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Loading...
              </span>
            ) : (
              'View more posts'
            )}
          </button>
        </div>
      )}
    </div>
  )
}

'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

import clsx from 'clsx'

import { GetBlogsQuery } from '@/generated/dato'
import { useDatoData } from '@/lib/dato/provider'

type Props = {
  className?: string
  itemsPerPage?: number
}

type BlogItem = NonNullable<GetBlogsQuery['allBlogposts']>[number]

export function BlogPostFeed({ className, itemsPerPage = 3 }: Props) {
  const { data: blogs } = useDatoData()
  const [currentPage, setCurrentPage] = useState(1)

  if (!blogs || !Array.isArray(blogs)) {
    return (
      <div className={clsx(className, 'flex items-center justify-center p-4 sm:p-6 md:p-8')}>
        <div className="text-center">
          <h2 className="text-lg font-bold text-red-600 sm:text-xl">Error loading blog posts</h2>
          <p className="mt-2 text-sm text-gray-600 sm:text-base">Please try again later</p>
        </div>
      </div>
    )
  }

  const blogPosts = blogs
    .slice(0, currentPage * itemsPerPage)
    .filter((item): item is BlogItem => item !== null)

  const hasMore = blogPosts.length < blogs.length

  return (
    <div className={clsx(className, '@container space-y-12')}>
      <div className="@sm:grid-cols-2 @xl:grid-cols-3 grid grid-cols-1 gap-8">
        {blogPosts.map(post => (
          <Link
            key={post?.id}
            className="group relative flex flex-col overflow-hidden rounded-lg bg-white shadow-lg transition-all duration-300 hover:shadow-xl"
            href={`/blog/${post?.slug}`}
            aria-label={`Read more about ${post?.title}`}
          >
            <div className="relative aspect-video w-full overflow-hidden">
              {post?.banner?.responsiveImage &&
                post.banner.responsiveImage.src &&
                post.banner.responsiveImage.width &&
                post.banner.responsiveImage.height && (
                  <Image
                    alt={
                      post.banner.responsiveImage.alt ?? `Hero image for blog post: ${post?.title}`
                    }
                    src={post.banner.responsiveImage.src}
                    width={post.banner.responsiveImage.width}
                    height={post.banner.responsiveImage.height}
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

      {hasMore && (
        <div className="flex justify-center">
          <button
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
            aria-label="Load more blog posts"
          >
            View more posts
          </button>
        </div>
      )}
    </div>
  )
}

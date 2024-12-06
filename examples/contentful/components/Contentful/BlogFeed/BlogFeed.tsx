'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Ref, useEffect, useState } from 'react'

import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
import clsx from 'clsx'
import useSWR from 'swr'

import { BlogFeedDocument, BlogOrder } from '@/generated/contentful'
import { client } from '@/lib/contentful/client'

type Props = {
  className?: string
}

export const DEFAULT_PARAMS = {
  limit: 1,
  skip: 0,
  order: ['feedDate_DESC'],
} as {
  limit: number
  skip: number
  order: [BlogOrder]
}

export function BlogFeed({ className }: Props) {
  const [{ limit, skip, order }, setParams] = useState({
    ...DEFAULT_PARAMS,
  })

  const { data, isLoading } = useSWR(
    `blog/feed/${limit}/${skip}/${order} }}`,
    () => client.request(BlogFeedDocument, { limit, skip, order }),
    {
      keepPreviousData: true,
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

  return (
    <div className={clsx(className, 'space-y-12')}>
      <div className="grid grid-cols-12 gap-y-12 md:gap-x-12">
        {items.map(post => (
          <Link
            key={post?._id}
            className="group col-span-12 grid gap-5 sm:flex sm:gap-8 md:col-span-6"
            href={`/blog/${post?.slug}`}
          >
            <div className="relative h-[200px] w-full shrink-0 sm:h-[150px] sm:w-[200px] lg:h-[150px] lg:w-[250px] xl:h-[200px] xl:w-[300px]">
              {post?.banner?.url && post.banner.width && post.banner.height && (
                <Image
                  alt={post.banner.description ?? ''}
                  src={post.banner.url}
                  width={post.banner.width}
                  height={post.banner.height}
                />
              )}
            </div>
            <div className="flex flex-col justify-between gap-4">
              <div className="space-y-3">
                <h3 className="line-clamp-3 text-xl font-bold group-hover:text-blue-100">
                  {post?.title}
                </h3>
                <p className="line-clamp-2 text-lg font-light md:hidden lg:[display:-webkit-box]">
                  {post?.description}
                </p>
              </div>
              <div className="text-gray-500">
                {post?.feedDate &&
                  `${new Date(post.feedDate).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })} • `}
              </div>
            </div>
          </Link>
        ))}
      </div>
      {items.length < total && (
        <button
          disabled={isLoading}
          onClick={() => {
            if (items.length < total) {
              setParams(prev => ({ ...prev, skip: (prev.skip || 0) + (prev.limit || 0) }))
            }
          }}
        >
          View more
        </button>
      )}
    </div>
  )
}

'use client'

import Link from 'next/link'
import { Ref, forwardRef, useEffect, useState } from 'react'
import { Image } from 'react-datocms'

import clsx from 'clsx'
import useSWR from 'swr'

import { BlogFeedDocument, BlogModelFilter, BlogModelOrderBy } from '@/generated/dato'
import { client } from '@/lib/dato/client'

type Props = {
  className?: string
}

export const DEFAULT_PARAMS = {
  limit: 1,
  skip: 0,
  filter: {},
  orderBy: ['feedDate_DESC'],
} as {
  limit: number
  skip: number
  filter: BlogModelFilter
  orderBy: [BlogModelOrderBy]
}

export const BlogFeed = forwardRef(function BlogFeed(
  { className }: Props,
  ref: Ref<HTMLDivElement>
) {
  // if categoryid initialize default with categoryId
  const [{ limit, skip, filter, orderBy }, setParams] = useState({
    ...DEFAULT_PARAMS,
    filter: DEFAULT_PARAMS.filter,
  })

  const { data, isLoading } = useSWR(
    `blog/feed/${limit}/${skip}/${filter}/${orderBy} }}`,
    () => client.request(BlogFeedDocument, { limit, skip, filter, orderBy }),
    {
      keepPreviousData: true,
    }
  )
  const [items, setItems] = useState(data?.allBlogs ?? [])
  const [total, setTotal] = useState(data?._allBlogsMeta.count ?? 0)

  useEffect(() => {
    setItems(prev => [
      ...prev.slice(0, skip),
      ...(data?.allBlogs ?? []),
      ...prev.slice((skip || 0) + (limit || 0)),
    ])
  }, [data, limit, skip])

  useEffect(() => {
    if (!data) return

    if (Object.keys(filter).length === 1) setTotal(data._allBlogsMeta.count)
    else {
      setTotal(data.allBlogs.length)
    }
  }, [data, filter])

  return (
    <div className={clsx(className, 'space-y-12')} ref={ref}>
      <div className="grid grid-cols-12 gap-y-12 md:gap-x-12">
        {items.map(post => (
          <Link
            key={post.id}
            className="group col-span-12 grid gap-5 sm:flex sm:gap-8 md:col-span-6"
            href={`/blog/${post.slug}`}
          >
            <div className="relative h-[200px] w-full shrink-0 sm:h-[150px] sm:w-[200px] lg:h-[150px] lg:w-[250px] xl:h-[200px] xl:w-[300px]">
              {post.banner?.responsiveImage && (
                <Image data={post.banner.responsiveImage} layout="fill" objectFit="cover" />
              )}
            </div>
            <div className="flex flex-col justify-between gap-4">
              <div className="space-y-3">
                <h3 className="line-clamp-3 text-xl font-bold group-hover:text-blue-100">
                  {post.title}
                </h3>
                <p className="line-clamp-2 text-lg font-light md:hidden lg:[display:-webkit-box]">
                  {post.description}
                </p>
              </div>
              <div className="text-gray-500">
                {post.feedDate &&
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
})

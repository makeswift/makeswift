'use client'

import Image from 'next/image'

import { Document } from '@contentful/rich-text-types'
import clsx from 'clsx'
import useSWR from 'swr'

import { RichText } from '@/components/Contentful/RichText/RichText'
import { GetBlogsDocument } from '@/generated/contentful'
import { client } from '@/lib/contentful/client'
import { useSlug } from '@/lib/utils'

type Props = {
  className?: string
  extraSlot?: React.ReactNode
}

export default function Blog({ className, extraSlot }: Props) {
  const slug = useSlug()

  const { data } = useSWR(
    `blog/${slug}`,
    async () => await client.request(GetBlogsDocument, { filter: { slug } }),
    {
      keepPreviousData: true,
    }
  )

  if (!data?.blogCollection?.items[0]?.body) return <div>Data provided is not rich text</div>

  const richTextContent = data.blogCollection.items[0].body.json as Document
  const banner = data.blogCollection.items[0].banner

  return (
    <div className="@container">
      {banner && (
        <div className="relative z-0 h-[400px] w-full">
          <Image
            src={banner.url || ''}
            alt={banner.title || 'Blog post hero image'}
            fill
            className="object-cover"
            sizes="@sm:100vw @md:80vw @lg:1200px"
          />
        </div>
      )}
      <div className={clsx(className, 'relative z-10 mx-auto max-w-prose px-4 @lg:px-0')}>
        <header className="mb-8">
          <h1 className="mb-4 text-2xl font-bold @sm:text-3xl @lg:text-4xl">
            {data?.blogCollection?.items[0]?.title || 'Blog Post'}
          </h1>
          {data?.blogCollection?.items[0]?.feedDate && (
            <time className="text-sm text-gray-600 @sm:text-base">
              {new Date(data.blogCollection.items[0].feedDate).toLocaleDateString()}
            </time>
          )}
        </header>
        <RichText content={richTextContent} />
        <footer className="mt-8 border-t border-gray-200 pt-4">
          <p className="text-sm text-gray-600 @sm:text-base">
            Thank you for reading! For more content, check out our other blog posts.
          </p>
        </footer>
      </div>
      {extraSlot && extraSlot}
    </div>
  )
}

'use client'

import Image from 'next/image'

import { type BlocksContent, BlocksRenderer } from '@strapi/blocks-react-renderer'

export default function BlockRendererClient({ content }: { readonly content: BlocksContent }) {
  if (!content) return null
  return (
    <BlocksRenderer
      content={content}
      blocks={{
        image: ({ image }) => {
          const hasDimensions = image.width != null && image.height != null

          if (hasDimensions) {
            return (
              <Image
                src={image.url}
                width={image.width}
                height={image.height}
                alt={image.alternativeText || ''}
              />
            )
          }

          return (
            <div className="relative aspect-video">
              <Image
                src={image.url}
                fill
                className="object-cover"
                alt={image.alternativeText || ''}
              />
            </div>
          )
        },
      }}
    />
  )
}

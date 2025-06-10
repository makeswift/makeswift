import Image from 'next/image'
import Link from 'next/link'

import { PrismicRichText as PrismicRichTextComponent } from '@prismicio/react'
import { isDevelopment } from 'utils/isDevelopment'

import { Warning } from '@/components/Warning'

import { ResolvedField, isPrismicRichText } from '../../../../lib/prismic/utils'

type Props = {
  className?: string
  field: ResolvedField
}

export function PrismicRichText({ className, field, ...rest }: Props) {
  if ('error' in field) {
    if (isDevelopment()) return <Warning className={className}>{field.error}</Warning>
    return null
  }

  if (!isPrismicRichText(field.data)) {
    if (isDevelopment())
      return <Warning className={className}>Field is not a valid Prismic Rich Text.</Warning>
    return null
  }

  if (!field.data) {
    if (isDevelopment()) return <Warning className={className}>Asset is missing URL.</Warning>
    return null
  }

  return (
    <div className={className}>
      <PrismicRichTextComponent
        field={field.data}
        fallback={<p>No richtext content</p>}
        components={{
          heading1: ({ children }) => (
            <h1 className="mb-3 mt-8 text-3xl font-bold text-[#111827]">{children}</h1>
          ),
          heading2: ({ children }) => (
            <h2 className="mb-3 mt-8 text-2xl font-bold text-[#111827]">{children}</h2>
          ),
          heading3: ({ children }) => (
            <h3 className="mb-3 mt-8 text-xl font-bold text-[#111827]">{children}</h3>
          ),
          heading4: ({ children }) => (
            <h4 className="mb-3 mt-8 text-lg font-bold text-[#111827]">{children}</h4>
          ),
          paragraph: ({ children }) => <p className="prose mt-4 leading-7">{children}</p>,
          oList: ({ children }) => (
            <ol className="prose mt-4 list-decimal pl-6 leading-7">{children}</ol>
          ),
          oListItem: ({ children }) => (
            <li className="mt-2 pl-2 marker:text-gray-500">{children}</li>
          ),
          list: ({ children }) => <ul className="prose ml-2 mt-4 list-disc pl-4">{children}</ul>,
          listItem: ({ children }) => (
            <li className="ml-2 mt-2 marker:text-gray-500">{children}</li>
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-[#111827]">{children}</strong>
          ),
          image: ({ children, node }) => (
            <Image
              className="mt-8"
              src={node.url}
              alt={node.alt ?? ''}
              width={node.dimensions.width}
              height={node.dimensions.width}
            />
          ),
          hyperlink: ({ children, node }) => (
            <Link
              href={node.data.url ?? ''}
              className="a-underline text-highlight-blue group no-underline transition duration-300 hover:text-blue-800"
            >
              {children}
            </Link>
          ),
        }}
      />
    </div>
  )
}

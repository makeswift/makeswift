import { Options, documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { BLOCKS, INLINES } from '@contentful/rich-text-types'
import clsx from 'clsx'

import { Warning } from '@/components/Warning'
import { type ResolvedField, isRichText } from '@/lib/contentful/utils'

type Props = {
  className?: string
  textColor?: 'default' | 'white' | 'gray'
  field: ResolvedField
  alignment?: 'left' | 'center' | 'right'
}

const options: Options = {
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node, children) => <p className="mb-4 leading-relaxed">{children}</p>,
    [BLOCKS.HEADING_1]: (node, children) => <h1 className="mb-4 text-4xl font-bold">{children}</h1>,
    [BLOCKS.HEADING_2]: (node, children) => <h2 className="mb-3 text-3xl font-bold">{children}</h2>,
    [BLOCKS.HEADING_3]: (node, children) => <h3 className="mb-3 text-2xl font-bold">{children}</h3>,
    [BLOCKS.HEADING_4]: (node, children) => <h4 className="mb-3 text-xl font-bold">{children}</h4>,
    [BLOCKS.UL_LIST]: (node, children) => <ul className="mb-4 list-disc pl-6">{children}</ul>,
    [BLOCKS.OL_LIST]: (node, children) => <ol className="mb-4 list-decimal pl-6">{children}</ol>,
    [BLOCKS.LIST_ITEM]: (node, children) => <li className="mb-2">{children}</li>,
    [BLOCKS.QUOTE]: (node, children) => (
      <blockquote className="mb-4 border-l-4 border-gray-300 pl-4 italic">{children}</blockquote>
    ),
    [INLINES.HYPERLINK]: (node, children) => (
      <a
        href={node.data.uri}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline"
      >
        {children}
      </a>
    ),
  },
}

function proseRichTextColor(textColor: Props['textColor']) {
  switch (textColor) {
    case 'white':
      return 'prose-headings:text-white prose-p:text-white'

    case 'gray':
      return 'prose-headings:text-gray-600 prose-p:text-gray-600'

    default:
  }
}

export function ContentfulRichText({ className, textColor, field, alignment = 'left' }: Props) {
  if ('error' in field) {
    return <Warning className={className}>{field.error}</Warning>
  }

  if (!isRichText(field.data)) {
    return <Warning className={className}>Text is not a Document.</Warning>
  }

  return (
    <div
      className={clsx(
        'prose',
        {
          left: 'items-start text-left',
          right: 'items-end text-right',
          center: 'items-center text-center',
        }[alignment],
        className,
        proseRichTextColor(textColor)
      )}
    >
      <div className={className}>{documentToReactComponents(field.data.json, options)}</div>
    </div>
  )
}

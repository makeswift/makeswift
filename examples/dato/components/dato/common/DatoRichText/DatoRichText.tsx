import { StructuredText as StructuredTextComponent, renderNodeRule } from 'react-datocms'
import { isHeading, isParagraph, isList, isListItem, isBlockquote, isLink } from 'datocms-structured-text-utils'
import clsx from 'clsx'

import { Warning } from '@/components/warning'
import { type ResolvedField, isStructuredText } from '@/lib/dato/utils'

type Props = {
  className?: string
  textColor?: 'default' | 'white' | 'gray'
  field: ResolvedField
  alignment?: 'left' | 'center' | 'right'
}

const customNodeRules = [
  renderNodeRule(isParagraph, ({ adapter: { renderNode }, children, key }) => {
    return renderNode('p', { key, className: 'mb-4 leading-relaxed' }, children)
  }),
  renderNodeRule(isHeading, ({ adapter: { renderNode }, node, children, key }) => {
    const HeadingTag = `h${node.level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
    const classes = {
      1: 'mb-4 text-4xl font-bold',
      2: 'mb-3 text-3xl font-bold',
      3: 'mb-3 text-2xl font-bold',
      4: 'mb-3 text-xl font-bold',
      5: 'mb-3 text-lg font-bold',
      6: 'mb-3 text-base font-bold',
    }[node.level]
    
    return renderNode(HeadingTag, { key, className: classes }, children)
  }),
  renderNodeRule(isList, ({ adapter: { renderNode }, node, children, key }) => {
    const ListTag = node.style === 'bulleted' ? 'ul' : 'ol'
    const className = node.style === 'bulleted' ? 'mb-4 list-disc pl-6' : 'mb-4 list-decimal pl-6'
    return renderNode(ListTag, { key, className }, children)
  }),
  renderNodeRule(isListItem, ({ adapter: { renderNode }, children, key }) => {
    return renderNode('li', { key, className: 'mb-2' }, children)
  }),
  renderNodeRule(isBlockquote, ({ adapter: { renderNode }, children, key }) => {
    return renderNode('blockquote', { key, className: 'mb-4 border-l-4 border-gray-300 pl-4 italic' }, children)
  }),
  renderNodeRule(isLink, ({ adapter: { renderNode }, node, children, key }) => {
    return renderNode(
      'a',
      {
        key,
        href: node.url,
        target: '_blank',
        rel: 'noopener noreferrer',
        className: 'text-blue-600 hover:underline',
      },
      children
    )
  }),
]

function proseRichTextColor(textColor: Props['textColor']) {
  switch (textColor) {
    case 'white':
      return 'prose-headings:text-white prose-p:text-white'

    case 'gray':
      return 'prose-headings:text-gray-600 prose-p:text-gray-600'

    default:
  }
}

export function DatoRichText({ className, textColor, field, alignment = 'left' }: Props) {
  if ('error' in field) {
    return <Warning className={className}>{field.error}</Warning>
  }

  if (!isStructuredText(field.data)) {
    return <Warning className={className}>Text is not a structured text document.</Warning>
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
      <StructuredTextComponent data={field.data.value} customNodeRules={customNodeRules} />
    </div>
  )
}

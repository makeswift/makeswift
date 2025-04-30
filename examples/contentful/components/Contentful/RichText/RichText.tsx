import { Options, documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { BLOCKS, Document, INLINES } from '@contentful/rich-text-types'

type Props = {
  content: Document
  className?: string
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

export function RichText({ content, className }: Props) {
  if (!content) return null

  return <div className={className}>{documentToReactComponents(content, options)}</div>
}

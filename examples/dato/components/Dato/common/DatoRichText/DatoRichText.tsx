import Link from 'next/link'
import { Ref, forwardRef } from 'react'
import { StructuredText, renderNodeRule } from 'react-datocms'

// import ReactDOMServer from 'react-dom/server'
import {
  isBlockquote,
  isCode,
  isHeading,
  isLink,
  isList,
  isParagraph,
  isThematicBreak,
} from 'datocms-structured-text-utils'
import parse from 'html-react-parser'

import CodeBlock from '@/components/CodeBlock/CodeBlock'
import { ResolvedField, isRichText } from '@/lib/dato/utils'

import DatoImage from '../DatoImage/DatoImage'
import styles from './richtext.module.css'

type Props = {
  className?: string
  field: ResolvedField
}

const DynamicHeader = ({
  id,
  level,
  children,
}: {
  id?: string
  level: number | string
  children: any
}) => {
  const heading = `h${level}` as keyof JSX.IntrinsicElements
  const content = `<${heading}>${children}</${heading}>`
  return (
    <div
      id={id}
      className="prose-xl prose-headings:mt-10 prose-headings:font-bold prose-headings:first:mt-0"
    >
      {parse(content)}
    </div>
  )
}

const customNodes = [
  renderNodeRule(isParagraph, ({ node, children, key }) => {
    return (
      <p className="mt-9 text-lg leading-8" key={key}>
        {children}
      </p>
    )
  }),
  renderNodeRule(isList, ({ node, children, key }) => {
    return node.style === 'numbered' ? (
      <ol className={`list-decimal pl-12 text-lg ${styles.ordered}`} key={key}>
        {children}
      </ol>
    ) : (
      <ul className={`list-disc pl-4 text-lg ${styles.unordered}`} key={key}>
        {children}
      </ul>
    )
  }),
  renderNodeRule(isLink, ({ node, children, key }) => {
    return (
      <Link href={node.url} className="text-blue-100 hover:underline" key={key}>
        {children}
      </Link>
    )
  }),
  renderNodeRule(isBlockquote, ({ node, children, key }) => {
    return (
      <blockquote
        className={`${styles.bquote} my-12 border-l-4 border-solid border-blue-100 px-10 py-2 italic text-blue-100`}
        key={key}
      >
        {children}
      </blockquote>
    )
  }),
  renderNodeRule(isCode, ({ node, key }) => {
    return <CodeBlock code={node.code} language={node.language} key={key} />
  }),
  renderNodeRule(isHeading, ({ node, children, key }) => {
    return (
      <DynamicHeader level={node.level} key={key}>
        {children}
      </DynamicHeader>
    )
  }),
  renderNodeRule(isThematicBreak, ({ key }) => {
    return <hr className="mt-10 max-w-[80%] border-gray-400" key={key} />
  }),
]

export function DatoRichText({ className, field }: Props) {
  if ('error' in field) {
    return <span className="w-full p-3 text-center">{field.error}</span>
  }

  if (!isRichText(field.data)) {
    return <span className="w-full p-3 text-center">Data is not rich text.</span>
  }

  return (
    <div className={className}>
      <StructuredText
        data={field.data}
        customNodeRules={customNodes}
        renderBlock={({ record }) => {
          switch (record.__typename) {
            case 'ImageBlockRecord':
              return record?.asset?.responsiveImage ? (
                <div className="flex w-full justify-center p-10">
                  <DatoImage field={{ data: record?.asset?.responsiveImage }} />
                </div>
              ) : null

            default:
              return null
          }
        }}
      />
    </div>
  )
}

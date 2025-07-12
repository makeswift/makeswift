import Link from 'next/link'
import { StructuredText, renderNodeRule } from 'react-datocms'

import {
  isBlockquote,
  isCode,
  isHeading,
  isLink,
  isList,
  isParagraph,
  isThematicBreak,
} from 'datocms-structured-text-utils'

import CodeBlock from '@/components/CodeBlock/CodeBlock'
import { Warning } from '@/components/Warning'
import { ResolvedField, isRichText } from '@/lib/dato/utils'

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
  children: React.ReactNode
}) => {
  const HeadingTag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

  const sizeClasses = {
    1: 'text-4xl',
    2: 'text-3xl',
    3: 'text-2xl',
    4: 'text-xl',
    5: 'text-lg',
    6: 'text-base',
  }

  const sizeClass = sizeClasses[Number(level) as keyof typeof sizeClasses] || 'text-xl'

  return (
    <HeadingTag id={id} className={`${sizeClass} mt-10 font-bold first:mt-0`}>
      {children}
    </HeadingTag>
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
      <ol className="list-decimal pl-12 text-lg font-bold" key={key}>
        {children}
      </ol>
    ) : (
      <ul className="ml-2 list-disc pl-4 text-lg" key={key}>
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
        className={`my-12 border-l-4 border-solid border-blue-100 px-10 py-2 text-2xl text-blue-100 italic`}
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
    return <Warning className={className}>{field.error}</Warning>
  }

  if (!isRichText(field.data)) {
    return <Warning className={className}>Data is not rich text.</Warning>
  }

  return (
    <div className={className}>
      <StructuredText data={field.data} customNodeRules={customNodes} />
    </div>
  )
}

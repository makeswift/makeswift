import 'server-only'

import { type ReactNode } from 'react'
import { MarkdownAsync } from 'react-markdown'

// Import all markdown files at build time
export const markdownFiles = import.meta.glob('/*.md', {
  query: '?raw',
  import: 'default',
}) as Record<string, () => Promise<string>>

export async function RscMarkdown({
  className,
  color,
  filename,
  link,
  list,
  richText,
  slot,
  red,
  number = 0,
}: {
  className?: string
  filename?: string
  color?: string
  red?: boolean
  number?: number
  link: { href: string; target?: string }
  list: { href: string; target?: string }[]
  richText: ReactNode
  slot: ReactNode
}) {
  const files = Object.keys(markdownFiles)
  const filePath = filename ?? files[0]

  const markdown =
    filePath && markdownFiles[filePath]
      ? await markdownFiles[filePath]()
      : 'No markdown files found.'

  return (
    <div
      className={className}
      style={{
        backgroundColor: color ?? 'white',
        color: red ? 'red' : 'black',
      }}
    >
      <div>Number: {number}</div>
      <div>Resolved link: {JSON.stringify(link)}</div>
      <div>List of links:</div>
      {list?.map((l) => (
        <div>Resolved link: {JSON.stringify(l)}</div>
      ))}
      <div>Rich text:</div>
      {richText}
      <div>Slot:</div>
      {slot}
      <hr />
      <MarkdownAsync>{markdown}</MarkdownAsync>
    </div>
  )
}

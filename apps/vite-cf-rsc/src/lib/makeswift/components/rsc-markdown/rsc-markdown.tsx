import 'server-only'

import { MarkdownAsync } from 'react-markdown'

// Import all markdown files at build time
const markdownFiles = import.meta.glob('/*.md', {
  query: '?raw',
  import: 'default',
}) as Record<string, () => Promise<string>>

// Export for use in the registration file
export const getMarkdownFileList = () => Object.keys(markdownFiles)

type Props = {
  className?: string
  filename?: string
  color?: string
  red?: boolean
  number?: number
  link: object
}

export async function RscMarkdown({
  className,
  color,
  filename,
  link,
  red,
  number = 0,
}: Props) {
  const files = Object.keys(markdownFiles)
  const filePath = filename ?? files[0]

  let markdown = 'No markdown files found.'
  if (filePath && markdownFiles[filePath]) {
    markdown = await markdownFiles[filePath]()
  }

  return (
    <div
      className={className}
      style={{
        backgroundColor: color ?? 'transparent',
        color: red ? 'red' : 'black',
      }}
    >
      <h1 style={{ fontSize: '40px' }}>Number: {number}</h1>
      Resolve link: {JSON.stringify(link)}
      <MarkdownAsync>{markdown}</MarkdownAsync>
    </div>
  )
}

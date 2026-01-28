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
  link: object
}

export async function RscMarkdown({ className, color, filename, link }: Props) {
  const files = Object.keys(markdownFiles)
  const filePath = filename ?? files[0]

  let markdown = 'No markdown files found.'
  if (filePath && markdownFiles[filePath]) {
    markdown = await markdownFiles[filePath]()
  }

  return (
    <div
      className={className}
      style={{ backgroundColor: color ?? 'transparent' }}
    >
      Resolve link: {JSON.stringify(link)}
      <MarkdownAsync>{markdown}</MarkdownAsync>
    </div>
  )
}

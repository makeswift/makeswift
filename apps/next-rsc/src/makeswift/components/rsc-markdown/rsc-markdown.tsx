import 'server-only'

import { readFile } from 'fs/promises'
import { MarkdownAsync } from 'react-markdown'

type Props = {
  className?: string
  filename?: string
  color?: string
  link: object
}

export async function RscMarkdown({
  className,
  color,
  filename = 'README.md',
  link,
}: Props) {
  const markdown = (await readFile(filename)).toString()

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

import 'server-only'

import { readFile } from 'fs/promises'
import { MarkdownAsync } from 'react-markdown'

type Props = {
  className?: string
  filename?: string
}

export async function RscMarkdown({
  className,
  filename = 'README.md',
}: Props) {
  const markdown = (await readFile(filename)).toString()

  return (
    <div className={className}>
      <MarkdownAsync>{markdown}</MarkdownAsync>
    </div>
  )
}

import { useRef } from 'react'
import { useServerInsertedHTML } from 'next/navigation'

import { type Snippet } from '../../../../client'

import {
  BaseHeadSnippet,
  snippetToElements,
} from '../../../../runtimes/react/components/page/HeadSnippet'

export function HeadSnippet({ snippet }: { snippet: Snippet }) {
  const headSnippetElements = snippetToElements(snippet)
  const insertedServerHTML = useRef(false)

  useServerInsertedHTML(() => {
    if (insertedServerHTML.current) return

    insertedServerHTML.current = true

    return headSnippetElements
  })

  return <BaseHeadSnippet snippet={snippet} />
}

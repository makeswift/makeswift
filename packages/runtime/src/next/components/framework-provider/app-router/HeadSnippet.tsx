import { useRef } from 'react'
import { useServerInsertedHTML } from 'next/navigation'

import { type Snippet } from '../../../../client'

import {
  BaseHeadSnippet,
  snippetToElement,
} from '../../../../runtimes/react/components/page/HeadSnippet'

export function HeadSnippet({ snippet }: { snippet: Snippet }) {
  const headSnippetElement = snippetToElement(snippet)
  const insertedServerHTML = useRef(false)

  useServerInsertedHTML(() => {
    if (insertedServerHTML.current) return

    insertedServerHTML.current = true

    return headSnippetElement
  })

  return <BaseHeadSnippet snippet={snippet} />
}

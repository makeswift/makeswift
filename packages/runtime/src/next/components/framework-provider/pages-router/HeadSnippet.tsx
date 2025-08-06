import { useEffect } from 'react'

import Head from 'next/head'

import { type Snippet } from '../../../../client'

import {
  snippetToElement,
  getSnippetElementsFromDOM,
  cleanUpSnippet,
} from '../../../../runtimes/react/components/page/HeadSnippet'

export function HeadSnippet({ snippet }: { snippet: Snippet }) {
  useEffect(() => {
    return () => {
      const snippetElements = getSnippetElementsFromDOM(snippet)
      if (snippetElements.length > 0) return
      cleanUpSnippet(snippet)
    }
  }, [snippet])

  const headSnippetElement = snippetToElement(snippet)

  return <Head>{headSnippetElement}</Head>
}

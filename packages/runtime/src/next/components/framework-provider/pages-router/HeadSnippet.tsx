import { type ReactElement, useEffect, isValidElement } from 'react'

import Head from 'next/head'
import Script from 'next/script'

import { type Snippet } from '../../../../client'

import {
  snippetToElements,
  getSnippetElementsFromDOM,
  cleanUpSnippet,
} from '../../../../runtimes/react/components/page/HeadSnippet'

const isScriptElement = (element: string | JSX.Element): element is ReactElement<any, 'script'> =>
  isValidElement(element) && element.type === 'script'

export function HeadSnippet({ snippet }: { snippet: Snippet }) {
  useEffect(() => {
    return () => {
      const snippetElements = getSnippetElementsFromDOM(snippet)
      if (snippetElements.length > 0) return
      cleanUpSnippet(snippet)
    }
  }, [snippet])

  const headSnippetElements = snippetToElements(snippet)

  return (
    <>
      {headSnippetElements.map((element, i) =>
        isScriptElement(element) ? (
          <Script key={element.key} {...element.props} strategy="beforeInteractive" />
        ) : (
          <Head key={isValidElement(element) ? element.key : i}>{element}</Head>
        ),
      )}
    </>
  )
}

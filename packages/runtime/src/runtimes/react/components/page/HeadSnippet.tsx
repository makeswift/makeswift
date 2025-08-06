import { Children, createElement, useEffect } from 'react'
import parse from 'html-react-parser'

import { type Snippet } from '../../../../client'

export function BaseHeadSnippet({ snippet }: { snippet: Snippet }) {
  useEffect(() => {
    const snippetElements = getSnippetElementsFromDOM(snippet)
    const isAlreadyInTheDOM = snippetElements.length > 0

    if (isAlreadyInTheDOM) return

    return renderSnippetAndExecuteScripts(snippet, window.document.head)
  }, [snippet])

  return null
}

const SNIPPET_ID_ATRIBUTE_NAME = 'data-makeswift-snippet-id'

const VALID_HEAD_ELEMENT_TYPES = [
  'title',
  'base',
  'link',
  'style',
  'meta',
  'script',
  'noscript',
  'template',
]

export function snippetToElement(snippet: Pick<Snippet, 'id' | 'code'>): (string | JSX.Element)[] {
  return Children.map(parse(snippet.code), element => {
    if (typeof element === 'string') return element

    if (!VALID_HEAD_ELEMENT_TYPES.includes(element.type as string)) return null

    const key = element.key ? `${snippet.id}:${element.key}` : snippet.id

    return createElement(element.type, {
      ...element.props,
      key,
      [SNIPPET_ID_ATRIBUTE_NAME]: snippet.id,
    })
  })
}

export function renderSnippetAndExecuteScripts(
  snippet: Snippet,
  container: HTMLElement,
): () => void {
  const virtualContainer = container.ownerDocument.createElement(container.tagName)

  virtualContainer.innerHTML = snippet.code

  const elements = Array.from(virtualContainer.querySelectorAll('*'))
  const scripts = elements.filter(el => el instanceof HTMLScriptElement)

  scripts.forEach(script => {
    const clone = script.ownerDocument.createElement(script.tagName)

    clone.textContent = script.textContent
    Array.from(script.attributes).forEach(({ name, value }) => {
      clone.setAttribute(name, value)
    })
    clone.setAttribute(SNIPPET_ID_ATRIBUTE_NAME, snippet.id)
    script.parentNode?.replaceChild(clone, script)
  })

  const nodes = Array.from(virtualContainer.childNodes)
  container.append(...nodes)

  return () => {
    nodes.forEach(node => {
      node.parentNode?.removeChild(node)
    })

    cleanUpSnippet(snippet)
  }
}

export function cleanUpSnippet(snippet: Snippet): void {
  if (snippet.cleanup == null) return
  try {
    const cleanUp = new Function(snippet.cleanup)
    cleanUp()
  } catch {
    // Ignore errors from user input.
  }
}

export function getSnippetElementsFromDOM(snippet: Snippet) {
  return document.head.querySelectorAll(`[${SNIPPET_ID_ATRIBUTE_NAME}="${snippet.id}"]`)
}

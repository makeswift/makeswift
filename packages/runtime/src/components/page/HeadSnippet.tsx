import { useEffect } from 'react'
import { Snippet } from '../hooks/usePageSnippets'
// import { useServerInsertedHTML } from 'next/navigation'
// import parse from 'html-react-parser'
// import Head from 'next/head'
import { useIsPagesRouter } from '../../next/hooks/use-is-pages-router'

type Props = {
  snippet: Snippet
}

export function HeadSnippet({ snippet }: Props) {
  const isPagesRouter = useIsPagesRouter()

  useEffect(() => {
    if (isPagesRouter) {
      return () => {
        const snippetElements = getSnippetElementsFromDOM(snippet)
        if (snippetElements.length > 0) return
        cleanUpSnippet(snippet)
      }
    }

    const snippetElements = getSnippetElementsFromDOM(snippet)
    const isAlreadyInTheDOM = snippetElements.length > 0

    if (isAlreadyInTheDOM) return

    return renderSnippetAndExecuteScripts(snippet, document.head)
  }, [isPagesRouter, snippet])

  // const headSnippetElement = snippetToElement(snippet)
  // const insertedServerHTML = useRef(false)

  // useServerInsertedHTML(() => {
  //   if (isPagesRouter || insertedServerHTML.current) return

  //   insertedServerHTML.current = true

  //   return headSnippetElement
  // })

  // DECOUPLE_TODO:
  // if (isPagesRouter) {
  //   return <Head>{headSnippetElement}</Head>
  // }

  return null
}

const SNIPPET_ID_ATRIBUTE_NAME = 'data-makeswift-snippet-id'

// const VALID_HEAD_ELEMENT_TYPES = [
//   'title',
//   'base',
//   'link',
//   'style',
//   'meta',
//   'script',
//   'noscript',
//   'template',
// ]

// function snippetToElement(snippet: Pick<Snippet, 'id' | 'code'>): (string | JSX.Element)[] {
//   return Children.map(parse(snippet.code), element => {
//     if (typeof element === 'string') return element

//     if (!VALID_HEAD_ELEMENT_TYPES.includes(element.type as string)) return null

//     const key = element.key ? `${snippet.id}:${element.key}` : snippet.id

//     return createElement(element.type, {
//       ...element.props,
//       key,
//       [SNIPPET_ID_ATRIBUTE_NAME]: snippet.id,
//     })
//   })
// }

function renderSnippetAndExecuteScripts(snippet: Snippet, container: HTMLElement): () => void {
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

function cleanUpSnippet(snippet: Snippet): void {
  if (snippet.cleanup == null) return
  try {
    const cleanUp = new Function(snippet.cleanup)
    cleanUp()
  } catch {
    // Ignore errors from user input.
  }
}

function getSnippetElementsFromDOM(snippet: Snippet) {
  return document.head.querySelectorAll(`[${SNIPPET_ID_ATRIBUTE_NAME}="${snippet.id}"]`)
}

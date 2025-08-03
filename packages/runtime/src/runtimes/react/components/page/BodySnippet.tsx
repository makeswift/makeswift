import { useEffect } from 'react'

const SCRIPT_TAG = 'script'

type Props = {
  code: string
  cleanup: string | null | undefined
}

export function BodySnippet({ code, cleanup }: Props): null {
  useEffect(() => {
    const container = document.createElement('div')

    container.innerHTML = code

    const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT)
    const scripts: HTMLScriptElement[] = []

    while (walker.nextNode()) {
      if (walker.currentNode instanceof HTMLScriptElement) scripts.push(walker.currentNode)
    }

    scripts.forEach(inlineScript => {
      const executableScript = document.createElement(SCRIPT_TAG)

      executableScript.textContent = inlineScript.textContent
      Array.from(inlineScript.attributes).forEach(({ name, value }) => {
        executableScript.setAttribute(name, value)
      })

      inlineScript.parentNode?.replaceChild(executableScript, inlineScript)
    })

    const nodes = Array.from(container.childNodes)

    document.body.append(...nodes)

    return () => {
      nodes.forEach(node => {
        node.parentNode?.removeChild(node)
      })

      if (cleanup == null) return

      try {
        const cleanUp = new Function(cleanup)
        cleanUp()
      } catch {
        // Ignore errors from user input.
      }
    }
  }, [code, cleanup])

  return null
}

'use client'

import { createContext, ReactNode, useContext, useEffect, useRef, useCallback } from 'react'

type ClientCSSContextValue = {
  updateStyle: (elementKey: string, propName: string, cssString: string) => void
}

const ClientCSSContext = createContext<ClientCSSContextValue>({
  updateStyle: () => {},
})

function toMapKey({elementKey, propName}: {elementKey: string, propName: string}): string {
  return `${elementKey}:${propName}`
}

export function ClientCSSProvider({ children }: { children: ReactNode }) {
  // keyed by `{elementKey}:{propName}`
  const styleElementRefs = useRef<Map<string, HTMLStyleElement | null>>(new Map())

  useEffect(() => {
    const styleElements = document.querySelectorAll<HTMLStyleElement>(
      'style[data-makeswift-rsc-element-key][data-makeswift-rsc-prop-name]',
    )

    for (const styleElement of styleElements) {
      const elementKey = styleElement.getAttribute('data-makeswift-rsc-element-key')
      const propName = styleElement.getAttribute('data-makeswift-rsc-prop-name')
      if (elementKey == null || propName == null) {
        // TODO ?
        console.error('[ClientCSSProvider] TODO address null elementKey or propName')
        continue
      }
      const mapKey = toMapKey({elementKey, propName})
      styleElementRefs.current.set(mapKey, styleElement)
    }


    return () => {
      styleElementRefs.current.clear()
    }
  }, [])

  const updateStyle = useCallback(
    (elementKey: string, propName: string, cssString: string) => {
      const mapKey = toMapKey({ elementKey, propName })
      const styleElement = styleElementRefs.current.get(mapKey)
      if (styleElement == null) {
        // TODO ?
        console.error('[ClientCSSProvider] TODO address null styleElement during updateStyle')
        return
      }
      styleElement.textContent = cssString
    },
    [],
  )

  return <ClientCSSContext.Provider value={{ updateStyle }}>{children}</ClientCSSContext.Provider>
}

export function useClientCSS(): ClientCSSContextValue {
  const context = useContext(ClientCSSContext)
  if (!context) throw new Error('useClientCSS must be used within ClientCSSProvider')
  return context
}

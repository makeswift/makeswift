'use client'

import { createContext, ReactNode, useContext, useEffect, useRef, useCallback } from 'react'

type ClientCSSContextValue = {
  updateStyle: (elementKey: string, propName: string, cssString: string) => void
}

const ClientCSSContext = createContext<ClientCSSContextValue>({
  updateStyle: () => {},
})

function toMapKey({elementKey, joinedPropPath}: {elementKey: string, joinedPropPath: string}): string {
  return `${elementKey}:${joinedPropPath}`
}

export function ClientCSSProvider({ children }: { children: ReactNode }) {
  // keyed by `{elementKey}:{joinedPropPath}`
  const styleElementRefs = useRef<Map<string, HTMLStyleElement | null>>(new Map())

  useEffect(() => {
    const styleElements = document.querySelectorAll<HTMLStyleElement>(
      'style[data-makeswift-rsc-element-key][data-makeswift-rsc-prop-path]',
    )

    for (const styleElement of styleElements) {
      const elementKey = styleElement.getAttribute('data-makeswift-rsc-element-key')
      const joinedPropPath = styleElement.getAttribute('data-makeswift-rsc-prop-path')
      if (elementKey == null || joinedPropPath == null) {
        // TODO
        console.error('[ClientCSSProvider] TODO address null elementKey or prop path')
        continue
      }
      const mapKey = toMapKey({elementKey, joinedPropPath})
      styleElementRefs.current.set(mapKey, styleElement)
    }


    return () => {
      styleElementRefs.current.clear()
    }
  }, [])

  const updateStyle = useCallback(
    (elementKey: string, joinedPropPath: string, cssString: string) => {
      const mapKey = toMapKey({ elementKey, joinedPropPath })
      if (!styleElementRefs.current.has(mapKey)) {
        // Can hit this case if we drag/drop an RSC in after initial page load
        const styleElement = document.querySelector<HTMLStyleElement>(`style[data-makeswift-rsc-element-key="${elementKey}"][data-makeswift-rsc-prop-path="${joinedPropPath}"]`)
        if (styleElement != null) {
          styleElementRefs.current.set(mapKey, styleElement)
        }
      }
      const styleElement = styleElementRefs.current.get(mapKey)
      if (styleElement == null) {
        console.error(`Expected to find a server-rendered <style> for element key: ${elementKey} and prop path: ${joinedPropPath}`)
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

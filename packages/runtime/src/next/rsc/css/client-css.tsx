'use client'

import { createContext, ReactNode, useContext, useEffect, useRef, useCallback } from 'react'

type ClientCSSContextValue = {
  updateStyle: (elementKey: string, propName: string, cssString: string) => void
}

const ClientCSSContext = createContext<ClientCSSContextValue>({
  updateStyle: () => {},
})

export function ClientCSSProvider({ children }: { children: ReactNode }) {
  const styleElementRef = useRef<HTMLStyleElement | null>(null)
  const serverStylesRef = useRef<string>('')
  const dynamicStylesRef = useRef<Map<string, string>>(new Map())

  // Initialize style element and capture server styles
  useEffect(() => {
    const styleElement = document.querySelector(
      'style[data-makeswift-rsc="true"]',
    ) as HTMLStyleElement

    if (!styleElement) {
      throw new Error(
        'Makeswift RSC style element not found. Ensure CSSInjector is rendered on the server.',
      )
    }

    serverStylesRef.current = styleElement.textContent || ''
    styleElementRef.current = styleElement

    return () => {
      styleElementRef.current = null
    }
  }, [])

  const updateStyleElement = useCallback(() => {
    if (!styleElementRef.current) return

    const dynamicCss = Array.from(dynamicStylesRef.current.values()).join('\n')
    const separator = serverStylesRef.current && dynamicCss ? '\n' : ''
    const combinedStyles = serverStylesRef.current + separator + dynamicCss

    styleElementRef.current.textContent = combinedStyles
  }, [])

  const updateStyle = useCallback(
    (elementKey: string, propName: string, cssString: string) => {
      const styleKey = `${elementKey}:${propName}`
      dynamicStylesRef.current.set(styleKey, cssString)
      updateStyleElement()
    },
    [updateStyleElement],
  )

  const contextValue: ClientCSSContextValue = {
    updateStyle,
  }

  return <ClientCSSContext.Provider value={contextValue}>{children}</ClientCSSContext.Provider>
}

// Hook to access client CSS runtime
export function useClientCSS(): ClientCSSContextValue {
  const context = useContext(ClientCSSContext)
  if (!context) {
    throw new Error('useClientCSS must be used within ClientCSSProvider')
  }
  return context
}

// Re-export for backward compatibility
export { ClientCSSProvider as RSCStyleProvider }
export { useClientCSS as useRSCStyleRuntime }

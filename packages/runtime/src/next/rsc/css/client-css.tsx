'use client'

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useCallback,
} from 'react'

// Client-side style management context
type ClientCSSContextValue = {
  updateStyle: (elementKey: string, propPath: string, cssString: string) => void
  clearElementStyles: (elementKey: string) => void
}

const ClientCSSContext = createContext<ClientCSSContextValue>({
  updateStyle: () => {},
  clearElementStyles: () => {},
})

type ClientCSSProviderProps = {
  children: ReactNode
}

// Provider component that manages client-side CSS updates
export function ClientCSSProvider({ children }: ClientCSSProviderProps) {
  const styleElementRef = useRef<HTMLStyleElement | null>(null)
  const serverStylesRef = useRef<string>('')
  const dynamicStylesRef = useRef<Map<string, string>>(new Map())

  // Initialize style element and capture server styles
  useEffect(() => {
    let styleElement = document.querySelector(
      'style[data-makeswift-rsc="true"]',
    ) as HTMLStyleElement

    if (!styleElement) {
      styleElement = document.createElement('style')
      styleElement.setAttribute('data-makeswift-rsc', 'true')
      document.head.appendChild(styleElement)
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

  const updateStyle = useCallback((elementKey: string, propPath: string, cssString: string) => {
    const styleKey = `${elementKey}:${propPath}`
    dynamicStylesRef.current.set(styleKey, cssString)
    updateStyleElement()
  }, [updateStyleElement])

  const clearElementStyles = useCallback((elementKey: string) => {
    const keyPrefix = `${elementKey}:`
    for (const key of dynamicStylesRef.current.keys()) {
      if (key.startsWith(keyPrefix)) {
        dynamicStylesRef.current.delete(key)
      }
    }
    updateStyleElement()
  }, [updateStyleElement])

  const contextValue: ClientCSSContextValue = {
    updateStyle,
    clearElementStyles,
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
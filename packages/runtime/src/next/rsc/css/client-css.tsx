'use client'

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react'

// Client-side style management context
type ClientCSSContextValue = {
  updateStyle: (elementKey: string, propName: string, cssString: string) => void
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
  const [dynamicStyles, setDynamicStyles] = useState<Map<string, string>>(new Map())
  const styleElementRef = useRef<HTMLStyleElement | null>(null)
  const serverStylesRef = useRef<string>('')

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

  // Update style element when dynamic styles change
  useEffect(() => {
    if (!styleElementRef.current) return

    const dynamicCss = Array.from(dynamicStyles.values()).join('\n')
    const separator = serverStylesRef.current && dynamicCss ? '\n' : ''
    const combinedStyles = serverStylesRef.current + separator + dynamicCss

    styleElementRef.current.textContent = combinedStyles
  }, [dynamicStyles])

  const updateStyle = useCallback((elementKey: string, propName: string, cssString: string) => {
    const styleKey = `${elementKey}-${propName}`
    setDynamicStyles(prev => {
      const next = new Map(prev)
      next.set(styleKey, cssString)
      return next
    })
  }, [])

  const clearElementStyles = useCallback((elementKey: string) => {
    setDynamicStyles(prev => {
      const next = new Map()
      for (const [key, value] of prev) {
        if (!key.startsWith(`${elementKey}-`)) {
          next.set(key, value)
        }
      }
      return next
    })
  }, [])

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
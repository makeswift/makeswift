'use client'

import { createContext, ReactNode, useContext, useEffect, useRef, useState, useCallback } from 'react'

type StyleUpdateCallback = (elementKey: string, propName: string, cssString: string) => void

type RSCStyleContextValue = {
  updateStyle: StyleUpdateCallback
  clearElementStyles: (elementKey: string) => void
}

const RSCStyleContext = createContext<RSCStyleContextValue>({
  updateStyle: () => {},
  clearElementStyles: () => {},
})

type RSCStyleProviderProps = {
  children: ReactNode
}

export function RSCStyleProvider({ children }: RSCStyleProviderProps) {
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

    // Capture existing server styles
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

  const contextValue: RSCStyleContextValue = {
    updateStyle,
    clearElementStyles,
  }

  return <RSCStyleContext.Provider value={contextValue}>{children}</RSCStyleContext.Provider>
}

export function useRSCStyleRuntime(): RSCStyleContextValue {
  const context = useContext(RSCStyleContext)
  if (!context) {
    throw new Error('useRSCStyleRuntime must be used within RSCStyleProvider')
  }
  return context
}

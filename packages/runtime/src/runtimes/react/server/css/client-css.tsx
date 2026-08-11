'use client'

import { createContext, ReactNode, useContext, useEffect, useRef, useCallback } from 'react'

import { MAKESWIFT_RSC_STYLE_TAG_ID_PREFIX } from './css-runtime'

type ClientCSSContextValue = {
  updateStyle: (elementKey: string, propName: string, cssString: string) => void
}

const ClientCSSContext = createContext<ClientCSSContextValue | null>(null)

export function ClientCSSProvider({ children }: { children: ReactNode }) {
  const styleElementsRef = useRef<Map<string, HTMLStyleElement>>(new Map())
  const serverStylesRef = useRef<Map<string, string>>(new Map())
  const dynamicStylesRef = useRef<Map<string, Map<string, string>>>(new Map())

  const updateStyleElement = useCallback(
    (elementKey: string, elementStyles: Map<string, string>) => {
      const styleElement = styleElementsRef.current.get(elementKey)
      if (styleElement == null) return

      const serverCss = serverStylesRef.current.get(elementKey) ?? ''
      const dynamicCss = Array.from(elementStyles.values()).join('\n')
      const combinedStyles =
        dynamicCss === serverCss ? serverCss : [serverCss, dynamicCss].filter(Boolean).join('\n')

      if (styleElement.textContent !== combinedStyles) {
        styleElement.textContent = combinedStyles
      }
    },
    [],
  )

  // Initialize style elements map and capture server styles
  useEffect(() => {
    const styleElements = document.querySelectorAll<HTMLStyleElement>(
      `style[data-href^="${MAKESWIFT_RSC_STYLE_TAG_ID_PREFIX}"]`,
    )

    styleElements.forEach(styleElement => {
      const elementKey = styleElement.dataset['href']?.substring(
        MAKESWIFT_RSC_STYLE_TAG_ID_PREFIX.length,
      )

      if (elementKey == null) {
        console.error('Unrecognized style element, ignoring', styleElement)
        return
      }

      styleElementsRef.current.set(elementKey, styleElement)
      serverStylesRef.current.set(elementKey, styleElement.textContent)

      const elementStyles = dynamicStylesRef.current.get(elementKey)
      if (elementStyles != null) {
        updateStyleElement(elementKey, elementStyles)
      }
    })
  }, [updateStyleElement])

  const updateStyle = useCallback(
    (elementKey: string, propName: string, cssString: string) => {
      const elementStyles = dynamicStylesRef.current.get(elementKey) ?? new Map()
      elementStyles.set(propName, cssString)
      dynamicStylesRef.current.set(elementKey, elementStyles)

      updateStyleElement(elementKey, elementStyles)
    },
    [updateStyleElement],
  )

  return <ClientCSSContext.Provider value={{ updateStyle }}>{children}</ClientCSSContext.Provider>
}

export function useClientCSS(): ClientCSSContextValue {
  const context = useContext(ClientCSSContext)
  if (!context) throw new Error('useClientCSS must be used within ClientCSSProvider')
  return context
}

'use client'

import { ReactNode, useCallback, useEffect, useMemo, useRef } from 'react'
import { useRSCStyleRuntime } from './style-runtime'
import { getElement } from '../../../state/react-page'
import { useControlDefs } from '../../../runtimes/react/controls'
import { deepEqual, ElementData, isElementReference, StyleDefinition } from '@makeswift/controls'
import { useDocumentKey, useSelector } from '../../../runtimes/react'
import { createClientStylesheet } from './client-stylesheet'
import { getBreakpoints } from '../../../state/react-page'
import { useRouter } from 'next/navigation'
import { useResourceResolver } from '../../../runtimes/react/hooks/use-resource-resolver'

type RSCElementStyleEnhancerProps = {
  initialElementData: ElementData
  children: ReactNode
}

export function RSCElementStyleEnhancer({
  initialElementData,
  children,
}: RSCElementStyleEnhancerProps) {
  const { updateStyle } = useRSCStyleRuntime()
  const documentKey = useDocumentKey()
  const breakpoints = useSelector(getBreakpoints)
  const router = useRouter()
  const resourceResolver = useResourceResolver()
  const elementKey = initialElementData.key
  const prevPropsRef = useRef(initialElementData.props)

  const element = useSelector(state => {
    if (documentKey == null) return null
    const element = getElement(state, documentKey, elementKey)
    if (element == null || isElementReference(element)) return null
    return element
  })

  const [_legacyDescriptors, definitions] = useControlDefs(initialElementData.type)

  const handleStyleUpdate = useCallback(
    (elementKey: string, propName: string, css: string) => {
      updateStyle(elementKey, propName, css)
    },
    [updateStyle],
  )

  const clientStylesheet = useMemo(() => {
    return createClientStylesheet(breakpoints, elementKey, handleStyleUpdate)
  }, [breakpoints, elementKey, handleStyleUpdate])

  // TODO: Is it better to listen to op update instead of comparing the element props in a useEffect?
  useEffect(() => {
    if (!element) return

    const prevProps = prevPropsRef.current

    // Process all prop changes in one pass
    Object.entries(definitions).forEach(([propName, def]) => {
      const currentValue = element.props[propName]
      const prevValue = prevProps[propName]

      if (def.controlType === StyleDefinition.type) {
        // Handle style prop changes
        if (currentValue !== undefined && !deepEqual(currentValue, prevValue)) {
          const resolvable = def.resolveValue(
            currentValue,
            resourceResolver,
            clientStylesheet.child(propName),
          )
          resolvable.readStable()
        }
      } else {
        if (!deepEqual(currentValue, prevValue)) {
          console.log('[RSC] Non-style prop changed, refreshing page')
          router.refresh()
        }
      }
    })

    prevPropsRef.current = element.props
  }, [element, definitions, resourceResolver, clientStylesheet, router])

  return <>{children}</>
}

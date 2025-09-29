'use client'

import { ReactNode, useCallback, useEffect, useMemo, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { deepEqual, ElementData, isElementReference, StyleDefinition } from '@makeswift/controls'
import { useControlDefs } from '../../../runtimes/react/controls'
import { useDocumentKey, useSelector } from '../../../runtimes/react'
import { useResourceResolver } from '../../../runtimes/react/hooks/use-resource-resolver'
import { getElement, getBreakpoints } from '../../../state/react-page'
import { createClientStylesheet } from './css-runtime'
import { useClientCSS } from './client-css'

type RSCBuilderUpdaterProps = {
  initialElementData: ElementData
  children: ReactNode
}

export function RSCBuilderUpdater({ initialElementData, children }: RSCBuilderUpdaterProps) {
  const { updateStyle } = useClientCSS()
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

  useEffect(() => {
    if (!element) return

    const prevProps = prevPropsRef.current

    Object.entries(definitions).forEach(([propName, def]) => {
      const currentValue = element.props[propName]
      const prevValue = prevProps[propName]

      if (def.controlType === StyleDefinition.type) {
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

  return children
}

'use client'

import { ReactNode, useEffect, useMemo, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { deepEqual, ElementData, isElementReference, StyleDefinition } from '@makeswift/controls'
import { useControlDefs } from '../../runtimes/react/controls'
import { useBreakpoints, useDocumentKey, useSelector } from '../../runtimes/react'
import { useResourceResolver } from '../../runtimes/react/hooks/use-resource-resolver'
import { getElement } from '../../state/react-page'
import { StylesheetEngine } from '../css/css-runtime'
import { useClientCSS } from '../css/client-css'

type RSCBuilderUpdaterProps = {
  initialElementData: ElementData
  children: ReactNode
}

export function RSCBuilderUpdater({ initialElementData, children }: RSCBuilderUpdaterProps) {
  const { updateStyle } = useClientCSS()
  const documentKey = useDocumentKey()
  const breakpoints = useBreakpoints()
  const router = useRouter()
  const resourceResolver = useResourceResolver()
  const elementKey = initialElementData.key
  const prevPropsRef = useRef(initialElementData.props)
  const [, definitions] = useControlDefs(initialElementData.type)

  const element = useSelector(state => {
    if (documentKey == null) return null
    const element = getElement(state, documentKey, elementKey)
    if (element == null || isElementReference(element)) return null
    return element
  })

  const clientStylesheet = useMemo(
    () =>
      new StylesheetEngine(
        breakpoints,
        elementKey,
        undefined,
        (_className, css, elementKey, propName) => {
          if (elementKey && propName) updateStyle(elementKey, propName, css)
        },
      ),
    [breakpoints, elementKey, updateStyle],
  )

  useEffect(() => {
    if (!element) return

    const prevProps = prevPropsRef.current

    if (prevProps === element.props) return

    Object.entries(definitions).forEach(([propName, def]) => {
      const currentValue = element.props[propName]
      const prevValue = prevProps[propName]

      if (def.controlType === StyleDefinition.type) {
        if (currentValue != null && !deepEqual(currentValue, prevValue)) {
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

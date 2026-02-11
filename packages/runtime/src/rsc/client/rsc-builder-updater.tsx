'use client'

import { ReactNode, useCallback, useEffect, useMemo, useRef } from 'react'
import { deepEqual, ElementData, isElementReference, StyleDefinition } from '@makeswift/controls'
import { useControlDefs } from '../../runtimes/react/controls'
import { useBreakpoints, useDocumentKey, useSelector } from '../../runtimes/react'
import { useResourceResolver } from '../../runtimes/react/hooks/use-resource-resolver'
import { useFrameworkContext } from '../../runtimes/react/components/hooks/use-framework-context'
import { getElement } from '../../state/react-page'
import { StylesheetEngine } from '../css/css-runtime'
import { useClientCSS } from '../css/client-css'
import { useUpdateRSCNode } from './rsc-nodes-provider'
import { useDocumentLocale } from '../../runtimes/react/hooks/use-document-context'

type RSCBuilderUpdaterProps = {
  initialElementData: ElementData
  children: ReactNode
}

export function RSCBuilderUpdater({ initialElementData, children }: RSCBuilderUpdaterProps) {
  const { updateStyle } = useClientCSS()
  const documentKey = useDocumentKey()
  const documentLocale = useDocumentLocale()
  const breakpoints = useBreakpoints()
  const { refreshRSCElement } = useFrameworkContext()
  const resourceResolver = useResourceResolver()
  const updateRSCNode = useUpdateRSCNode()
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

  const refreshSingleElement = useCallback(
    async (elementData: ElementData) => {
      if (!refreshRSCElement || !documentKey) return

      try {
        const node = await refreshRSCElement(elementData, {
          key: documentKey,
          locale: documentLocale,
        })
        updateRSCNode(elementKey, node)
      } catch (error) {
        console.error('[RSC] Failed to refresh element', elementKey, error)
      }
    },
    [refreshRSCElement, documentKey, documentLocale, elementKey, updateRSCNode],
  )

  // Handle prop changes: style props update CSS directly, non-style props re-render on server
  useEffect(() => {
    if (!element) return

    const prevProps = prevPropsRef.current

    if (prevProps === element.props) return

    let needsServerRefresh = false

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
          needsServerRefresh = true
        }
      }
    })

    if (needsServerRefresh) {
      console.log('[RSC] Non-style prop changed, refreshing element', elementKey)
      refreshSingleElement(element)
    }

    prevPropsRef.current = element.props
  }, [element, definitions, resourceResolver, clientStylesheet, refreshSingleElement, elementKey])

  // Handle API resource changes: re-render this element when any resource changes
  useEffect(() => {
    const handler = () => {
      if (element) {
        console.log('[RSC] API resource changed, refreshing element', elementKey)
        refreshSingleElement(element)
      }
    }

    window.addEventListener('makeswift:rsc-resource-changed', handler)
    return () => window.removeEventListener('makeswift:rsc-resource-changed', handler)
  }, [element, elementKey, refreshSingleElement])

  return children
}

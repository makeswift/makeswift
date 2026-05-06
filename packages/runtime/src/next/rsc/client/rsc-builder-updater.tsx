'use client'

import { ReactNode, useEffect, useMemo, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { deepEqual, ElementData, isElementReference, StyleDefinition } from '@makeswift/controls'
import { useControlDefs } from '../../../runtimes/react/controls'
import { useBreakpoints, useDocumentKey, useSelector } from '../../../runtimes/react'
import { useResourceResolver } from '../../../runtimes/react/hooks/use-resource-resolver'
import { getElement, getPropControllers } from '../../../state/read-only-state'
import { StylesheetEngine } from '../css/css-runtime'
import { useClientCSS } from '../css/client-css'
import { pollBoxModel } from '../../../runtimes/react/poll-box-model'

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

  /*
    (spike)
    Why is this here? It's part of an effort to replace the old css runtime's box model polling behavior.

    The old implementation dealt with box model callbacks by feeding them through from a Control
    definition into the stylesheet *along the path of resolving props*:
      - Control definition calls `defineStyle`, passing along a box model callback
      - `defineStyle` finishes producing css, then stores the callback (if passed in) in a ref alongside other box model callbacks

    then, with box model callbacks for an element accumulating into a ref, the actual polling could be done as part of a
    useEffect (in use-stylesheet-factory.ts)

    The problem with this flow for RSCs: the "right" place to register box model callbacks can't be "along the path of
    resolving props" because prop resolution happens on the server (and doesn't happen via RSCBuilderUpdater on the client
    until you modify a style value). So we need a way to set up box model callbacks on the client in the absence of prop resolution
  */
  const propControllers = useSelector((state) => {
    if (documentKey == null) return null
    return getPropControllers(state, { documentKey, elementKey})
  })

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

  // TODO other consideration: what about when we "merge" the non-RSC path and RSC path such that client components are also using the new StylesheetFactory? Isn't that more justification to put the box model callback logic in client-css.tsx
  useEffect(() => {
    if (propControllers == null) return
    const cleanupFunctions: Array<() => void> = []
    for (const [propName, controller] of Object.entries(propControllers)) {
      /*
        TODO I know this is "wrong", need an alternative
      */
      if (typeof controller.changeBoxModel !== 'function') {
        continue
      }

      // TODO use helper for building the classname
      const styledElement = document.querySelector(
        `[class*="makeswift-rsc-${elementKey}-${propName}-"]`,
      )

      if (styledElement == null) {
        console.warn(`[RSC] No styled element found for prop ${propName} on element ${elementKey}`)
        continue
      }

      cleanupFunctions.push(
        pollBoxModel({
          element: styledElement,
          onBoxModelChange: boxModel => controller.changeBoxModel(boxModel)
        })
      )
    }
    return () => cleanupFunctions.forEach(fn => fn())
  }, [propControllers, elementKey])

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

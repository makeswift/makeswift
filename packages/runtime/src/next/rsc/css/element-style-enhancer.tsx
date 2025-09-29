'use client'

import { ReactNode, useCallback, useEffect, useMemo } from 'react'
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

  // Bug, element is null sometimes
  const element = useSelector(state => {
    if (documentKey == null) return null

    const element = getElement(state, documentKey, elementKey)

    if (element == null) return null
    if (isElementReference(element)) return null

    return element
  })

  const [_legacyDescriptors, definitions] = useControlDefs(initialElementData.type)

  const handleStyleUpdate = useCallback(
    (elementKey: string, propName: string, css: string) => {
      updateStyle(elementKey, propName, css)
    },
    [updateStyle],
  )

  // This does not work if the RSC doesn't have any style initially.
  const clientStylesheet = useMemo(() => {
    return createClientStylesheet(breakpoints, elementKey, handleStyleUpdate)
  }, [breakpoints, elementKey, handleStyleUpdate])

  // TODO: we should listen to op update instead of comparing the element props in a useEFfect
  useEffect(() => {
    if (element == null) return

    Object.entries(definitions).forEach(([propName, def]) => {
      if (def.controlType === StyleDefinition.type) {
        const data = element.props[propName]
        if (data !== undefined) {
          const resolvable = def.resolveValue(
            data,
            resourceResolver,
            clientStylesheet.child(propName),
          )
          resolvable.readStable()
        }
      } else {
        if (!deepEqual(element.props[propName], initialElementData.props[propName])) {
          router.refresh()
        }
      }
    })
    // Can't put clientStylesheet here, it'll cause infinite rerender
  }, [definitions, element, initialElementData.props, router])

  return <>{children}</>
}

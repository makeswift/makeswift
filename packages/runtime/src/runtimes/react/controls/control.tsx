'use client'

import {
  ControlDefinition,
  type InstanceType,
  type DataType,
  type ResolvedValueType,
} from '@makeswift/controls'
import { ReactNode } from 'react'

import { useResolvedValue } from '../hooks/use-resolved-value'
import { useBreakpoints } from '../hooks/use-breakpoints'
import { useControlledStyles } from '../css-runtime/hooks/use-controlled-styles'

type ControlValueProps = {
  definition: ControlDefinition
  data: DataType<ControlDefinition> | undefined
  children(value: ResolvedValueType<ControlDefinition>): ReactNode
  elementKey: string
  propPathComponents: string[]
  control?: InstanceType<ControlDefinition>
}

export function ControlValue({
  data,
  definition,
  children,
  elementKey,
  propPathComponents,
  control,
}: ControlValueProps): ReactNode {
  const breakpoints = useBreakpoints()

  // Namespaced separately from the "top-level" (see ResolveProps component) to avoid attempted double rendering
  const { getStylesheet, styleElements } = useControlledStyles({ namespace: `${elementKey}-controlValue-nested`})

  const stylesheet = getStylesheet({
    breakpointsData: breakpoints,
    elementKey,
    propPathComponents,
  })


  const value = useResolvedValue(
    data,
    (data, resourceResolver) =>
      definition.resolveValue(data, resourceResolver, stylesheet, control),
    (definition.config as any)?.defaultValue,
    [stylesheet.key()]
  )

  return (
    <>
      {children(value)}
      {styleElements}
    </>
  )
}

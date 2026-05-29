'use client'

import {
  ControlDefinition,
  type InstanceType,
  type DataType,
  type ResolvedValueType,
} from '@makeswift/controls'
import { ReactNode } from 'react'

import { useResolvedValue } from '../hooks/use-resolved-value'
import { useCssId } from '../hooks/use-css-id'
import { useBreakpoints } from '../hooks/use-breakpoints'
import { useStylesheetEngine } from '../css-runtime/css-runtime'

type ControlValueProps = {
  definition: ControlDefinition
  data: DataType<ControlDefinition> | undefined
  children(value: ResolvedValueType<ControlDefinition>): ReactNode
  control?: InstanceType<ControlDefinition>
}

export function ControlValue({
  data,
  definition,
  children,
  control,
}: ControlValueProps): ReactNode {
  const breakpoints = useBreakpoints()
  const id = `cv-${useCssId()}`
  const { getStylesheet, renderDefinedStyles } = useStylesheetEngine()

  const stylesheet = getStylesheet({
    breakpointsData: breakpoints,
    elementKey: id,
    propPathComponents: [],
  })

  const value = useResolvedValue(
    data,
    (data, resourceResolver) =>
      definition.resolveValue(data, resourceResolver, stylesheet, control),
    (definition.config as any)?.defaultValue,
  )

  return (
    <>
      {children(value)}
      {renderDefinedStyles()}
    </>
  )
}

'use client'

import {
  ControlDefinition,
  type InstanceType,
  type DataType,
  type ResolvedValueType,
} from '@makeswift/controls'
import { ReactNode } from 'react'

import { useResolvedValue } from '../hooks/use-resolved-value'
import { useStylesheetFactory } from '../hooks/use-stylesheet-factory'
import { useCssId } from '../hooks/use-css-id'

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
  const stylesheetFactory = useStylesheetFactory()
  const id = `cv-${useCssId()}`

  const value = useResolvedValue(
    data,
    (data, resourceResolver) =>
      definition.resolveValue(data, resourceResolver, stylesheetFactory.get(id), control),
    (definition.config as any)?.defaultValue,
  )

  stylesheetFactory.useDefinedStyles()

  return children(value)
}

import {
  ControlDefinition,
  type InstanceType,
  type DataType,
  type ResolvedValueType,
} from '@makeswift/controls'

import { useResolvedValue } from '../hooks/use-resolved-value'
import { useStylesheetFactory } from '../hooks/use-stylesheet-factory'
import { useCssId } from '../hooks/use-css-id'

type ControlValueProps = {
  definition: ControlDefinition
  data: DataType<ControlDefinition> | undefined
  children(value: ResolvedValueType<ControlDefinition>): JSX.Element
  control?: InstanceType<ControlDefinition>
}

export function ControlValue({
  data,
  definition,
  children,
  control,
}: ControlValueProps): JSX.Element {
  const stylesheetFactory = useStylesheetFactory()
  const id = useCssId()

  const value = useResolvedValue(data, (data, resourceResolver) =>
    definition.resolveValue(data, resourceResolver, stylesheetFactory.get(id), control),
  )

  return children(value)
}

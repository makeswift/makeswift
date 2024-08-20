import { type DataType, type ResolvedValueType } from '@makeswift/controls'

import { ShapeControl, ShapeDefinition } from '../../../controls'

import { ControlValue } from './control'

type ShapeControlValueProps = {
  definition: ShapeDefinition
  data: DataType<ShapeDefinition> | undefined
  children(value: ResolvedValueType<ShapeDefinition>): JSX.Element
  control: ShapeControl
}

export function ShapeControlValue({ definition, data, children, control }: ShapeControlValueProps) {
  return Object.entries(definition.config.type).reduceRight(
    (renderFn, [key, controlDefinition]) =>
      shapeControlValue => (
        <ControlValue
          definition={controlDefinition}
          data={data?.[key]}
          control={control?.child(key)}
        >
          {value => renderFn({ ...shapeControlValue, [key]: value })}
        </ControlValue>
      ),
    children,
  )({} as ResolvedValueType<ShapeDefinition>)
}

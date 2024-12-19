import {
  ControlDataTypeKey,
  ShapeV2Control,
  ShapeV2Definition,
  type DataType,
  type ResolvedValueType,
} from '@makeswift/controls'

import { ControlValue } from './control'

type ShapeControlValueProps = {
  definition: ShapeV2Definition
  data: DataType<ShapeV2Definition> | undefined
  children(value: ResolvedValueType<ShapeV2Definition>): JSX.Element
  control: ShapeV2Control
}

export function ShapeV2ControlValue({
  definition,
  data,
  children,
  control,
}: ShapeControlValueProps) {
  return Object.entries(definition.config.type).reduceRight(
    (renderFn, [key, controlDefinition]) =>
      shapeControlValue => {
        if (data && ControlDataTypeKey in data) {
          return (
            <ControlValue
              definition={controlDefinition}
              data={data?.value?.[key]}
              control={control?.child(key)}
            >
              {value => renderFn({ ...shapeControlValue, [key]: value })}
            </ControlValue>
          )
        }
        return (
          <ControlValue
            definition={controlDefinition}
            data={data?.[key]}
            control={control?.child(key)}
          >
            {value => renderFn({ ...shapeControlValue, [key]: value })}
          </ControlValue>
        )
      },
    children,
  )({} as ResolvedValueType<ShapeV2Definition>)
}

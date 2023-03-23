import { ShapeControl, ShapeControlData, ShapeControlDefinition } from '../../../controls/shape'
import { ControlDefinitionValue, ControlValue } from './control'

export type ShapeControlValue<T extends ShapeControlDefinition> = {
  [K in keyof T['config']['type']]: ControlDefinitionValue<T['config']['type'][K]>
}

type ShapeControlValueProps<T extends ShapeControlDefinition> = {
  definition: T
  data: ShapeControlData<T> | undefined
  children(value: ShapeControlValue<T>): JSX.Element
  control: ShapeControl
}

export function ShapeControlValue<T extends ShapeControlDefinition>({
  definition,
  data,
  children,
  control,
}: ShapeControlValueProps<T>) {
  return Object.entries(definition.config.type).reduceRight(
    (renderFn, [key, controlDefinition]) =>
      shapeControlValue =>
        (
          <ControlValue
            definition={controlDefinition}
            data={data?.[key]}
            control={control?.controls.get(key)}
          >
            {value => renderFn({ ...shapeControlValue, [key]: value })}
          </ControlValue>
        ),
    children,
  )({} as ShapeControlValue<T>)
}

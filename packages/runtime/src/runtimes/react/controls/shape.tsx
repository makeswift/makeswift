import { ShapeControlData, ShapeControlDefinition } from '../../../controls/shape'
import { ControlDefinitionValue, ControlValue } from './control'

export type ShapeControlValue<T extends ShapeControlDefinition> = {
  [K in keyof T['config']['type']]: ControlDefinitionValue<T['config']['type'][K]>
}

type ShapeControlValueProps<T extends ShapeControlDefinition> = {
  definition: T
  data: ShapeControlData<T> | undefined
  children(value: ShapeControlValue<T>): JSX.Element
}

export function ShapeControlValue<T extends ShapeControlDefinition>({
  definition,
  data,
  children,
}: ShapeControlValueProps<T>) {
  return Object.entries(definition.config.type).reduceRight(
    (renderFn, [key, controlDefinition]) =>
      shapeControlValue =>
        (
          <ControlValue definition={controlDefinition} data={data?.[key]}>
            {value => renderFn({ ...shapeControlValue, [key]: value })}
          </ControlValue>
        ),
    children,
  )({} as ShapeControlValue<T>)
}

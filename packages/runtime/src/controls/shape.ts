import { ControlDefinition, ControlDefinitionData } from './control'

export const ShapeControlType = 'makeswift::controls::shape'

type ShapeControlConfig = {
  type: Record<string, ControlDefinition>
  label?: string
}

export type ShapeControlDefinition<C extends ShapeControlConfig = ShapeControlConfig> = {
  type: typeof ShapeControlType
  config: C
}

export function Shape<C extends ShapeControlConfig>(config: C): ShapeControlDefinition<C> {
  return { type: ShapeControlType, config }
}

export type ShapeControlData<T extends ShapeControlDefinition = ShapeControlDefinition> = {
  [K in keyof T['config']['type']]?: ControlDefinitionData<T['config']['type'][K]>
}

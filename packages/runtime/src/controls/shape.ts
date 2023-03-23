import { CopyContext } from '../state/react-page'
import { ControlDefinition, ControlDefinitionData } from './control'

import { copy as controlCopy } from './control'
import { SlotControlDefinition } from './slot'

export const ShapeControlType = 'makeswift::controls::shape'

type ShapeControlConfig = {
  type: Record<string, Exclude<ControlDefinition, SlotControlDefinition>>
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

export function copyShapeData(
  definition: ShapeControlDefinition,
  value: ShapeControlData | undefined,
  context: CopyContext,
): ShapeControlData | undefined {
  if (value == null) return value

  const newValue: ShapeControlData = {}

  for (const [key, itemDefinition] of Object.entries(definition.config.type)) {
    const prop = value[key]

    newValue[key] = controlCopy(itemDefinition, prop, context)
  }

  return newValue
}

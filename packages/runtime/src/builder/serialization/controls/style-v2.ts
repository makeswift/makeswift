import { StyleV2ControlDefinition } from '../../../controls'
import { deserializeControl, serializeControl } from '../control-serialization'
import { deserializeFunction, serializeFunction } from '../function-serialization'
import { Serialize, Deserialize } from './types'

export function serializeStyleV2Control(
  definition: StyleV2ControlDefinition,
): [Serialize<StyleV2ControlDefinition>, Transferable[]] {
  const [type, transferables] = serializeControl(definition.config.type)
  const getStyle = definition.config.getStyle && serializeFunction(definition.config.getStyle)

  if (getStyle) {
    transferables.push(getStyle)
  }

  return [
    {
      ...definition,
      config: {
        ...definition.config,
        type,
        getStyle,
      },
    },
    transferables,
  ] as [Serialize<StyleV2ControlDefinition>, Transferable[]]
}

export function deserializeStyleV2Control(
  definition: Serialize<StyleV2ControlDefinition>,
): Deserialize<Serialize<StyleV2ControlDefinition>> {
  const type = deserializeControl(definition.config.type)
  const getStyle = definition.config.getStyle && deserializeFunction(definition.config.getStyle)

  return {
    ...definition,
    config: {
      ...definition.config,
      getStyle,
      type,
    },
  } as Deserialize<Serialize<StyleV2ControlDefinition>>
}

import { ShapeControlDefinition } from '../../../controls'
import {
  deserializeControl,
  DeserializedControl,
  serializeControl,
  SerializedControl,
} from '../control-serialization'
import { Deserialize, Serialize } from './types'

export function serializeShapeControlDefinition(
  definition: ShapeControlDefinition,
): [Serialize<ShapeControlDefinition>, Transferable[]] {
  const [type, transferables] = Object.entries(definition.config.type).reduce(
    ([type, transferables], [key, value]) => {
      const [serializedType, serializedTransferables] = serializeControl(value)

      type[key] = serializedType
      transferables.push(...serializedTransferables)

      return [type, transferables]
    },
    [{} as Record<string, SerializedControl>, [] as Transferable[]],
  )

  return [{ ...definition, config: { ...definition.config, type } }, transferables] as [
    Serialize<ShapeControlDefinition>,
    Transferable[],
  ]
}

export function deserializeShapeControlDefinition(
  definition: Serialize<ShapeControlDefinition>,
): Deserialize<Serialize<ShapeControlDefinition>> {
  const type = Object.entries(definition.config.type).reduce((type, [key, value]) => {
    const serializedType = deserializeControl(value)

    type[key] = serializedType

    return type
  }, {} as Record<string, DeserializedControl>)

  return {
    ...definition,
    config: { ...definition.config, type },
  } as Deserialize<Serialize<ShapeControlDefinition>>
}

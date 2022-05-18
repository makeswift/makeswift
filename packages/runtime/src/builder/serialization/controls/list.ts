import { ListControlDefinition } from '../../../controls'
import { deserializeControl, serializeControl } from '../control-serialization'
import { deserializeFunction, serializeFunction } from '../function-serialization'
import { Deserialize, Serialize } from './types'

export function serializeListControlDefinition(
  definition: ListControlDefinition,
): [Serialize<ListControlDefinition>, Transferable[]] {
  const [type, transferables] = serializeControl(definition.config.type)
  const getItemLabel =
    definition.config.getItemLabel && serializeFunction(definition.config.getItemLabel)

  if (getItemLabel) transferables.push(getItemLabel)

  return [
    { ...definition, config: { ...definition.config, type, getItemLabel } },
    transferables,
  ] as [Serialize<ListControlDefinition>, Transferable[]]
}

export function deserializeListControlDefinition(
  definition: Serialize<ListControlDefinition>,
): Deserialize<Serialize<ListControlDefinition>> {
  const type = deserializeControl(definition.config.type)
  const getItemLabel =
    definition.config.getItemLabel && deserializeFunction(definition.config.getItemLabel)

  return {
    ...definition,
    config: { ...definition.config, type, getItemLabel },
  } as Deserialize<Serialize<ListControlDefinition>>
}

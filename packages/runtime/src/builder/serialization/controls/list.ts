import { ListControlDefinition } from '../../../controls'
import { deserializeFunction, serializeFunction } from '../function-serialization'
import { Deserialize, Serialize } from './types'

export function serializeListControlDefinition(
  definition: ListControlDefinition,
): [Serialize<ListControlDefinition>, Transferable[]] {
  const getItemLabel =
    definition.config.getItemLabel && serializeFunction(definition.config.getItemLabel)
  const transferables = []

  if (getItemLabel) transferables.push(getItemLabel)

  return [{ ...definition, config: { ...definition.config, getItemLabel } }, transferables]
}

export function deserializeListControlDefinition(
  definition: Serialize<ListControlDefinition>,
): Deserialize<Serialize<ListControlDefinition>> {
  const getItemLabel =
    definition.config.getItemLabel && deserializeFunction(definition.config.getItemLabel)

  return { ...definition, config: { ...definition.config, getItemLabel } }
}

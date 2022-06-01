import { ComboboxControlDefinition } from '../../../controls'
import { deserializeFunction, serializeFunction } from '../function-serialization'
import { Deserialize, Serialize } from './types'

export function serializeComboboxControlDefinition(
  definition: ComboboxControlDefinition,
): [Serialize<ComboboxControlDefinition>, Transferable[]] {
  const transferables = []
  const getOptions = definition.config.getOptions && serializeFunction(definition.config.getOptions)

  if (getOptions) transferables.push(getOptions)

  return [{ ...definition, config: { ...definition.config, getOptions } }, transferables] as [
    Serialize<ComboboxControlDefinition>,
    Transferable[],
  ]
}

export function deserializeComboboxControlDefinition(
  definition: Serialize<ComboboxControlDefinition>,
): Deserialize<Serialize<ComboboxControlDefinition>> {
  const getOptions =
    definition.config.getOptions && deserializeFunction(definition.config.getOptions)

  return {
    ...definition,
    config: { ...definition.config, getOptions },
  } as Deserialize<Serialize<ComboboxControlDefinition>>
}

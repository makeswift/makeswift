import { type CopyContext } from './common'
import { type ResourceResolver } from './resource-resolver'

import { type ParseResult } from './traits'
import { ControlInstance, type Send } from './control-instance'

export abstract class ControlDefinition<
  Config,
  DataType,
  ValueType,
  InstanceType = ControlInstance<unknown>,
> {
  constructor(readonly config: Config) {}

  abstract safeParse(
    data: unknown | undefined,
  ): ParseResult<DataType | undefined>

  abstract fromData(data: DataType | undefined): ValueType | undefined
  abstract toData(value: ValueType): DataType

  abstract copyData(
    data: DataType | undefined,
    context: CopyContext,
  ): DataType | undefined

  abstract resolveValue(
    value: ValueType,
    resolver: ResourceResolver,
  ): Promise<void>

  abstract createInstance(send: Send): InstanceType
  abstract serialize(): [unknown, Transferable[]]

  // introspection
  abstract getSwatchIds(data: DataType | undefined): string[]
}

export function serializeConfig(config: unknown): [unknown, Transferable[]] {
  // FIXME
  return [config, []]
}

// export function serializeListControlDefinition(
//   definition: ListControlDefinition,
// ): [Serialize<ListControlDefinition>, Transferable[]] {
//   const [type, transferables] = serializeControl(definition.config.type)
//   const getItemLabel =
//     definition.config.getItemLabel && serializeFunction(definition.config.getItemLabel)

//   if (getItemLabel) transferables.push(getItemLabel)

//   return [
//     { ...definition, config: { ...definition.config, type, getItemLabel } },
//     transferables,
//   ] as [Serialize<ListControlDefinition>, Transferable[]]
// }

// export function deserializeListControlDefinition(
//   definition: Serialize<ListControlDefinition>,
// ): Deserialize<Serialize<ListControlDefinition>> {
//   const type = deserializeControl(definition.config.type)
//   const getItemLabel =
//     definition.config.getItemLabel && deserializeFunction(definition.config.getItemLabel)

//   return {
//     ...definition,
//     config: { ...definition.config, type, getItemLabel },
//   } as Deserialize<Serialize<ListControlDefinition>>
// }

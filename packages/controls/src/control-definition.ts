import { z } from 'zod'
import { type CopyContext } from './context'
import { type Data } from './common/types'

import {
  type ResourceResolver,
  type ValueSubscription,
} from './resource-resolver'

import { ControlInstance, type SendType } from './control-instance'
import { serializeConfig } from './serialization'
import { summarizeError } from './utils/zod'

export type ParseResult<T> =
  | { success: true; data: T }
  | { success: false; error: string }

export type Schema<T> = z.ZodType<T>

export abstract class ControlDefinition<
  ControlType extends string = string,
  Config = unknown,
  DataType = Data,
  ValueType = unknown,
  ResolvedValueType = ValueType,
  InstanceType = ControlInstance,
> {
  constructor(readonly config: Config) {}

  abstract get controlType(): ControlType

  abstract get schema(): {
    definition: Schema<unknown>
    type: Schema<ControlType>
    data: Schema<DataType | undefined>
    value: Schema<ValueType | undefined>
    resolvedValue: Schema<ResolvedValueType | undefined>
  }

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
  ): ValueSubscription<ResolvedValueType>

  abstract createInstance(send: SendType<InstanceType>): InstanceType
  abstract serialize(): [unknown, Transferable[]]

  // introspection
  abstract getSwatchIds(data: DataType | undefined): string[]
}

type ControlDefinitionTypes<D> =
  D extends ControlDefinition<
    infer ControlType,
    infer Config,
    infer DataType,
    infer ValueType,
    infer ResolvedValueType,
    infer InstanceType
  >
    ? {
        ControlType: ControlType
        Config: Config
        DataType: DataType
        ValueType: ValueType
        ResolvedValueType: ResolvedValueType
        InstanceType: InstanceType
      }
    : never

export type ControlType<D> = ControlDefinitionTypes<D>['ControlType']
export type ConfigType<D> = ControlDefinitionTypes<D>['Config']
export type DataType<D> = ControlDefinitionTypes<D>['DataType']
export type ValueType<D> = ControlDefinitionTypes<D>['ValueType']
export type ResolvedValueType<D> =
  ControlDefinitionTypes<D>['ResolvedValueType']
export type InstanceType<D> = ControlDefinitionTypes<D>['InstanceType']

export function safeParse<Schema extends z.ZodType>(
  schema: Schema,
  data: unknown | undefined,
): ParseResult<z.infer<Schema> | undefined> {
  const result = schema.optional().safeParse(data)
  return result.success
    ? { success: true, data: result.data }
    : { success: false, error: summarizeError(result.error) }
}

export function serialize(
  config: unknown,
  rest: object,
): [unknown, Transferable[]] {
  const [serializedConfig, transferables] = serializeConfig(config)
  return [
    {
      config: serializedConfig,
      ...rest,
    },
    transferables,
  ]
}

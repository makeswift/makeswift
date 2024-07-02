import { z } from 'zod'
import { type CopyContext } from './context'
import { type Data } from './common/types'

import {
  type ResourceResolver,
  type ValueSubscription,
} from './resource-resolver'

import { type Effector } from './effector'

import { ControlInstance, type SendMessage } from './control-instance'
import { serializeObject } from './serialization'
import { summarizeError } from './utils/zod'
import { type IntrospectionTarget } from './introspect'

export type ParseResult<T> =
  | { success: true; data: T }
  | { success: false; error: string }

export type Schema<T> = z.ZodType<T>
export type SerializedRecord<T extends string = string> = {
  type: T
} & Record<string, unknown>

export abstract class ControlDefinition<
  ControlType extends string = string,
  Config = unknown,
  DataType = Data,
  ValueType = Data,
  ResolvedValueType = Data | unknown,
  InstanceType = ControlInstance<any>,
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
    data: DataType | undefined,
    resolver: ResourceResolver,
    effector: Effector,
    control?: InstanceType,
  ): ValueSubscription<ResolvedValueType | undefined>

  abstract createInstance(sendMessage: SendMessage<any>): InstanceType
  abstract serialize(): [SerializedRecord<any>, Transferable[]]

  introspect<R>(
    data: DataType | undefined,
    target: IntrospectionTarget<R>,
  ): R[] {
    return target.introspect(data)
  }
}

export type ControlDefinitionTypes<D> =
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
  rest: SerializedRecord,
): [SerializedRecord, Transferable[]] {
  const [serializedConfig, transferables] = serializeObject(config)
  return [
    {
      config: serializedConfig,
      ...rest,
    },
    transferables,
  ]
}

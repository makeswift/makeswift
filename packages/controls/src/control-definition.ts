import { z } from 'zod'
import {
  MergeContext,
  MergeTranslatableDataContext,
  type CopyContext,
} from './context'
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

export type SchemaType<T> = z.ZodType<T>
export type SerializedRecord<T extends string = string> = {
  type: T
} & Record<string, unknown>

export type Resolvable<T> = ValueSubscription<T> & {
  triggerResolve(currentValue?: T): Promise<unknown>
}

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
    definition: SchemaType<unknown>
    type: SchemaType<ControlType>
    data: SchemaType<DataType>
    value: SchemaType<ValueType>
    resolvedValue: SchemaType<ResolvedValueType>
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
  ): Resolvable<ResolvedValueType | undefined>

  abstract createInstance(sendMessage: SendMessage<any>): InstanceType
  abstract serialize(): [SerializedRecord<any>, Transferable[]]

  introspect<R>(
    data: DataType | undefined,
    target: IntrospectionTarget<R>,
  ): R[] {
    return target.introspect(data)
  }

  merge(
    base: DataType,
    override: DataType = base,
    _context: MergeContext,
  ): DataType {
    return override
  }

  getTranslatableData(_data: DataType): Data {
    return null
  }

  mergeTranslatedData(
    data: DataType,
    _translatedData: Data,
    _context: MergeTranslatableDataContext,
  ): Data {
    return data as Data
  }
}

export type ControlType<D> =
  D extends ControlDefinition<infer ControlType, any, any, any, any, any>
    ? ControlType
    : never

export type ConfigType<D> =
  D extends ControlDefinition<any, infer Config, any, any, any, any>
    ? Config
    : never

export type DataType<D> =
  D extends ControlDefinition<any, any, infer DataType, any, any, any>
    ? DataType
    : never

export type ValueType<D> =
  D extends ControlDefinition<any, any, any, infer ValueType, any, any>
    ? ValueType
    : never

export type ResolvedValueType<D> =
  D extends ControlDefinition<any, any, any, any, infer ResolvedValueType, any>
    ? ResolvedValueType
    : never

export type InstanceType<D> =
  D extends ControlDefinition<any, any, any, any, any, infer InstanceType>
    ? InstanceType
    : never

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

import { z } from 'zod'

import { type ValueSubscription } from '../lib/value-subscription'
import { type ParseResult } from '../lib/zod'

import { type Data } from '../common/types'
import {
  type CopyContext,
  type MergeContext,
  type MergeTranslatableDataContext,
} from '../context'
import { type IntrospectionTarget } from '../introspection'
import { type ResourceResolver } from '../resources/resolver'
import {
  Serializable,
  serializeObject,
  type SerializedRecord,
} from '../serialization'
import { type Stylesheet } from '../stylesheet'

import { ControlInstance, type SendMessage } from './instance'

export type SchemaType<T> = z.ZodType<T>
export type SchemaTypeAny = SchemaType<any> | z.ZodBranded<SchemaType<any>, any>

export type Resolvable<T> = ValueSubscription<T> & {
  triggerResolve(currentValue?: T): Promise<unknown>
}

export abstract class ControlDefinition<
  ControlType extends string = string,
  Config = unknown,
  DataType extends Data = Data,
  ValueType extends Data = Data,
  ResolvedValueType = Data | unknown,
  InstanceType extends ControlInstance<any> = ControlInstance<any>,
> extends Serializable {
  // workaround for TypeScript type inference issues: https://bit.ly/4g2RvOQ
  __associatedTypes(_: {
    ControlType: ControlType
    Config: Config
    DataType: DataType
    ValueType: ValueType
    ResolvedValueType: ResolvedValueType
    InstanceType: InstanceType
  }) {}

  constructor(readonly config: Config) {
    super()
  }

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

  mergeData(
    base: DataType,
    override: DataType | undefined,
    _context: MergeContext,
  ): DataType {
    return override ?? base
  }

  getTranslatableData(_data: DataType | undefined): Data {
    return null
  }

  mergeTranslatedData(
    data: DataType | undefined,
    _translatedData: Data,
    _context: MergeTranslatableDataContext,
  ): Data {
    return data as Data
  }

  abstract resolveValue(
    data: DataType | undefined,
    resolver: ResourceResolver,
    stylesheet: Stylesheet,
    control?: InstanceType,
  ): Resolvable<ResolvedValueType | undefined>

  abstract createInstance(sendMessage: SendMessage<any>): InstanceType

  abstract serialize(): [SerializedRecord, Transferable[]]

  introspect<R>(
    data: DataType | undefined,
    target: IntrospectionTarget<R>,
  ): R[] {
    return target.introspect(data)
  }
}

export function serialize(
  config: unknown,
  rest: { type: string } & Record<string, unknown>,
): [SerializedRecord, Transferable[]] {
  const [serializedConfig, transferables] = serializeObject(config)
  return [
    {
      config: serializedConfig,
      ...rest,
    } as unknown as SerializedRecord,
    transferables,
  ]
}

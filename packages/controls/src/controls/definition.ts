import { z } from 'zod'

import { type ParseResult } from '../lib/zod'

import { type Data } from '../common/types'
import {
  type CopyContext,
  type MergeContext,
  type MergeTranslatableDataContext,
} from '../context'
import { type IntrospectionTarget } from '../introspection'
import {
  Serializable,
  serializeObject,
  type SerializedRecord,
} from '../serialization'

import { ControlInstance, type SendMessage } from './instance'

export type SchemaType<T> = z.ZodType<T>
export type SchemaTypeAny = SchemaType<any> | z.ZodBranded<SchemaType<any>, any>

export type Resolvable<T> = {
  readStableValue(previous?: T): T
  subscribe(onUpdate: () => void): () => void
}

export abstract class ControlDefinition<
  ControlType extends string = string,
  Config = unknown,
  DataType extends Data = Data,
  ValueType extends Data = Data,
  ResolvedValueType = Data | unknown,
  InstanceType extends ControlInstance<any> = ControlInstance<any>,
> extends Serializable {
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

  resolveValue(
    _data: DataType | undefined,
  ): Resolvable<ResolvedValueType | undefined> {
    console.assert(
      false,
      `${this.controlType}: 'resolveValue' is not implemented`,
    )

    return {
      readStableValue: (_previous?: ResolvedValueType) => undefined,
      subscribe: () => () => {},
    }
  }

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

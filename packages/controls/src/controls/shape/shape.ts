import { z } from 'zod'

import { mapValues } from '../../lib/functional'
import { safeParse, type ParseResult } from '../../lib/zod'

import { type Data } from '../../common'
import {
  type CopyContext,
  type MergeTranslatableDataContext,
} from '../../context'
import { type IntrospectionTarget } from '../../introspection'
import {
  SerializationSchema,
  type DeserializedRecord,
  type SerializedRecord,
} from '../../serialization'

import {
  type DataType as DataType_,
  type ResolvedValueType as ResolvedValueType_,
  type ValueType as ValueType_,
} from '../associated-types'
import { ControlDefinition, serialize, type SchemaType } from '../definition'
import { type SendMessage } from '../instance'

import { ShapeControl } from './shape-control'

type ItemDefinition = ControlDefinition<string, unknown, any, any, any>
type KeyDefinitions = Record<string, ItemDefinition>

type Config<Defs extends KeyDefinitions = KeyDefinitions> = {
  readonly type: Defs
}

type DataType<C extends Config> = {
  [K in keyof C['type']]?: DataType_<C['type'][K]>
}

type ValueType<C extends Config> = {
  [K in keyof C['type']]?: ValueType_<C['type'][K]>
}

type ResolvedValueType<C extends Config> = {
  [K in keyof C['type']]: ResolvedValueType_<C['type'][K]>
}

type InstanceType<C extends Config> = ShapeControl<Definition<C>>

class Definition<C extends Config> extends ControlDefinition<
  typeof Definition.type,
  C,
  DataType<C>,
  ValueType<C>,
  ResolvedValueType<C>,
  InstanceType<C>
> {
  static readonly type = 'makeswift::controls::shape' as const

  static deserialize(
    data: DeserializedRecord,
    deserializeCallback: (r: DeserializedRecord) => ControlDefinition,
  ): ShapeDefinition {
    if (data.type !== Definition.type)
      throw new Error(
        `Shape: expected '${Definition.type}', got '${data.type}'`,
      )

    const {
      config: { type, ...config },
    } = z
      .object({
        type: z.literal(Definition.type),
        config: z.object({
          type: z.record(z.string(), SerializationSchema.deserializedRecord),
        }),
      })
      .parse(data)

    const deserializedType = mapValues(type, (itemDef) => {
      return deserializeCallback(itemDef)
    })

    return Shape({
      type: deserializedType,
      ...config,
    })
  }

  get keyDefs() {
    return this.config.type
  }

  get controlType() {
    return Definition.type
  }

  get schema() {
    const type = z.literal(Definition.type)
    const keys = mapValues(this.keyDefs, (def) => def.schema)

    const data = z.object(mapValues(keys, (key) => key.data)) as SchemaType<
      DataType<C>
    >

    const value = z.object(mapValues(keys, (key) => key.value)) as SchemaType<
      ValueType<C>
    >

    const resolvedValue = z.object(
      mapValues(keys, (key) => key.resolvedValue),
    ) as SchemaType<ResolvedValueType<C>>

    const config = z.object({
      type: z.object(mapValues(keys, (key) => key.definition)),
    })

    const definition = z.object({
      type,
      config,
    })

    return { type, data, value, resolvedValue, definition }
  }

  safeParse(data: unknown | undefined): ParseResult<DataType<C> | undefined> {
    return safeParse(this.schema.data, data)
  }

  fromData(data: DataType<C> | undefined): ValueType<C> | undefined {
    if (data == null) return undefined
    return mapValues(data, (value, key) =>
      this.keyDefs[key as string]?.fromData(value),
    )
  }

  toData(value: ValueType<C>): DataType<C> {
    return mapValues(value, (value, key) =>
      this.keyDefs[key as string]?.toData(value),
    )
  }

  copyData(
    data: DataType<C> | undefined,
    context: CopyContext,
  ): DataType<C> | undefined {
    if (data == null) return undefined
    return mapValues(data, (value, key) =>
      this.keyDefs[key as string].copyData(value, context),
    )
  }

  getTranslatableData(data: DataType<C>): Data {
    if (data == null) return null
    return mapValues(data, (value, key) => {
      return this.keyDefs[key as string]?.getTranslatableData(value)
    })
  }

  mergeTranslatedData(
    data: DataType<C>,
    translatedData: Record<string, DataType<C>>,
    context: MergeTranslatableDataContext,
  ): Data {
    if (translatedData == null) return data
    return mapValues(data, (value, key) =>
      this.keyDefs[key as string]?.mergeTranslatedData(
        value,
        translatedData[key as string],
        context,
      ),
    )
  }

  createInstance(sendMessage: SendMessage): InstanceType<C> {
    return new ShapeControl(this, sendMessage)
  }

  serialize(): [SerializedRecord, Transferable[]] {
    return serialize(this.config, {
      type: Definition.type,
    })
  }

  introspect<R>(data: DataType<C> | undefined, target: IntrospectionTarget<R>) {
    return Object.entries(data ?? {}).flatMap(([key, value]) =>
      this.keyDefs[key as string]?.introspect(value, target),
    )
  }
}

export class ShapeDefinition<C extends Config = Config> extends Definition<C> {}

export function Shape<Defs extends KeyDefinitions>(
  config: Config<Defs>,
): ShapeDefinition<Config<Defs>> {
  return new ShapeDefinition<Config<Defs>>(config)
}

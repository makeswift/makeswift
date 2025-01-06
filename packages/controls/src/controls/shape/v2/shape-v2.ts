import { z } from 'zod'

import { mapValues } from '../../../lib/functional'
import { StableValue } from '../../../lib/stable-value'
import { safeParse, type ParseResult } from '../../../lib/zod'

import { ControlDataTypeKey, type Data } from '../../../common'
import {
  type CopyContext,
  type MergeTranslatableDataContext,
} from '../../../context'
import { type IntrospectionTarget } from '../../../introspection'
import { type ResourceResolver } from '../../../resources/resolver'
import {
  SerializationSchema,
  type DeserializedRecord,
  type SerializedRecord,
} from '../../../serialization'
import { type Stylesheet } from '../../../stylesheet'
import {
  type DataType as DataType_,
  type ResolvedValueType as ResolvedValueType_,
  type ValueType as ValueType_,
} from '../../associated-types'
import {
  ControlDefinition,
  serialize,
  type Resolvable,
  type SchemaType,
} from '../../definition'
import { type SendMessage } from '../../instance'

import { ShapeDefinition } from '../v1/shape'

import { ShapeV2Control } from './shape-v2-control'

type ItemDefinition = ControlDefinition<string, unknown, any, any, any>
type KeyDefinitions = Record<string, ItemDefinition>

export type Config<Defs extends KeyDefinitions = KeyDefinitions> = {
  label?: string
  layout?: typeof Definition.Layout.Inline | typeof Definition.Layout.Popover
  readonly type: Defs
}

export type ShapeV2DataTypeV0<C extends Config> = DataType_<ShapeDefinition<C>>

export type ShapeV2DataTypeV1<C extends Config> = {
  [ControlDataTypeKey]: typeof Definition.v1DataType
  value: {
    [K in keyof C['type']]: DataType_<C['type'][K]>
  }
}

type DataType<C extends Config> = ShapeV2DataTypeV0<C> | ShapeV2DataTypeV1<C>

type ValueType<C extends Config> = {
  [K in keyof C['type']]: ValueType_<C['type'][K]>
}

type ResolvedValueType<C extends Config> = {
  [K in keyof C['type']]: ResolvedValueType_<C['type'][K]>
}
type InstanceType<C extends Config> = ShapeV2Control<Definition<C>>

class Definition<C extends Config> extends ControlDefinition<
  typeof Definition.type,
  C,
  DataType<C>,
  ValueType<C>,
  ResolvedValueType<C>,
  InstanceType<C>
> {
  static readonly type = 'makeswift::controls::shape-v2' as const
  static readonly v1DataType = 'shape-v2::v1' as const
  private static readonly dataSignature = {
    v1: { [ControlDataTypeKey]: this.v1DataType },
  } as const

  static readonly Layout = {
    Inline: `${this.type}::layout::inline`,
    Popover: `${this.type}::layout::popover`,
  } as const

  static deserialize(
    data: DeserializedRecord,
    deserializeCallback: (r: DeserializedRecord) => ControlDefinition,
  ): ShapeV2Definition {
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
          label: z.string().optional(),
          layout: z
            .union([
              z.literal(Definition.Layout.Inline),
              z.literal(Definition.Layout.Popover),
            ])
            .optional(),
          type: z.record(z.string(), SerializationSchema.deserializedRecord),
        }),
      })
      .parse(data)

    const deserializedType = mapValues(type, (itemDef) => {
      return deserializeCallback(itemDef)
    })

    return ShapeV2({
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
    const version = z.literal(1)
    const type = z.literal(Definition.type)

    const keys = mapValues(this.keyDefs, (def) => def.schema)

    const v0Data = z.object(mapValues(keys, (key) => key.data)) as SchemaType<
      ShapeV2DataTypeV0<C>
    >
    const v1Data = z.object({
      [ControlDataTypeKey]: z.literal(Definition.v1DataType),
      value: v0Data,
    }) as SchemaType<ShapeV2DataTypeV1<C>>

    const data = z.union([v0Data, v1Data])

    const value = z.object(mapValues(keys, (key) => key.value)) as SchemaType<
      ValueType<C>
    >

    const resolvedValue = z.object(
      mapValues(keys, (key) => key.resolvedValue),
    ) as SchemaType<ResolvedValueType<C>>

    const config = z.object({
      label: z.string().optional(),
      layout: z.union([
        z.literal(Definition.Layout.Inline),
        z.literal(Definition.Layout.Popover),
      ]),
      type: z.object(mapValues(keys, (key) => key.definition)),
    })

    const definition = z.object({
      type,
      config,
    })

    return { type, data, value, resolvedValue, definition, version }
  }

  safeParse(data: unknown | undefined): ParseResult<DataType<C> | undefined> {
    return safeParse(this.schema.data, data)
  }

  fromData(data: DataType<C> | undefined): ValueType<C> | undefined {
    if (data == null) return undefined

    const propsData = Definition.propsData(data)

    return mapValues(this.keyDefs, (def, key) =>
      def.fromData(propsData[key]),
    ) as ValueType<C>
  }

  toData(value: ValueType<C>): DataType<C> {
    return Definition.propsToData(
      mapValues(this.keyDefs, (def, key) => def.toData(value[key])),
    )
  }

  copyData(
    data: DataType<C> | undefined,
    context: CopyContext,
  ): DataType<C> | undefined {
    if (data == null) return undefined

    const propsData = Definition.propsData(data)

    return Definition.propsToData(
      mapValues(this.keyDefs, (def, key) =>
        def.copyData(propsData[key], context),
      ),
    )
  }

  getTranslatableData(data: DataType<C>): Data {
    if (data == null) return null

    const propsData = Definition.propsData(data)

    return mapValues(this.keyDefs, (def, key) =>
      def.getTranslatableData(propsData[key]),
    )
  }

  mergeTranslatedData(
    data: DataType<C>,
    translatedData: Record<string, DataType<C>>,
    context: MergeTranslatableDataContext,
  ): Data {
    if (translatedData == null) return data

    const propsData = Definition.propsData(data)

    return mapValues(this.keyDefs, (def, key) =>
      def.mergeTranslatedData(propsData[key], translatedData[key], context),
    )
  }

  resolveValue(
    data: DataType<C> | undefined,
    resolver: ResourceResolver,
    stylesheet: Stylesheet,
    control?: InstanceType<C>,
  ): Resolvable<ResolvedValueType<C> | undefined> {
    const propsData = data != null ? Definition.propsData(data) : data

    const keyValues = mapValues(this.keyDefs, (def, key) =>
      def.resolveValue(
        propsData?.[key],
        resolver,
        stylesheet.child(key),
        control?.child(key),
      ),
    )

    const stableValue = StableValue({
      name: Definition.type,
      read: () =>
        mapValues(keyValues, (v) => v.readStable()) as ResolvedValueType<C>,
      deps: Object.values(keyValues),
    })

    return {
      ...stableValue,
      triggerResolve: async (currentValue?: ResolvedValueType<C>) => {
        await Promise.all(
          Object.entries(keyValues).map(([key, v]) =>
            v?.triggerResolve(currentValue?.[key]),
          ),
        )
      },
    }
  }

  createInstance(sendMessage: SendMessage): InstanceType<C> {
    return new ShapeV2Control(this, sendMessage)
  }

  serialize(): [SerializedRecord, Transferable[]] {
    return serialize(this.config, {
      type: Definition.type,
    })
  }

  introspect<R>(data: DataType<C> | undefined, target: IntrospectionTarget<R>) {
    if (data == null) return []

    const propsData = Definition.propsData(data)

    return Object.entries(this.keyDefs).flatMap(
      ([key, def]) => def.introspect(propsData[key], target) ?? [],
    )
  }

  static propsToData<C extends Config>(
    propsData: ShapeV2DataTypeV0<C>,
  ): DataType<C> {
    return {
      ...Definition.dataSignature.v1,
      value: propsData,
    }
  }

  static propsData<C extends Config>(data: DataType<C>): ShapeV2DataTypeV0<C> {
    if (Definition.isVersionedData(data)) {
      return data.value
    }

    return data
  }

  static propDataPath<C extends Config>(
    data: DataType<C>,
    key: string,
  ): string[] {
    return Definition.isVersionedData(data) ? ['value', key] : [key]
  }

  private static isVersionedData<C extends Config>(
    data: DataType<C>,
  ): data is ShapeV2DataTypeV1<C> {
    return (
      data != null &&
      ControlDataTypeKey in data &&
      data[ControlDataTypeKey] === Definition.v1DataType
    )
  }
}

export class ShapeV2Definition<
  C extends Config = Config,
> extends Definition<C> {}

export function ShapeV2<D extends KeyDefinitions>(
  config: Config<D>,
): ShapeV2Definition<Config<D>> {
  return new ShapeV2Definition<Config<D>>(
    config?.layout == null
      ? { layout: Definition.Layout.Inline, ...config }
      : config,
  )
}

ShapeV2.Layout = Definition.Layout

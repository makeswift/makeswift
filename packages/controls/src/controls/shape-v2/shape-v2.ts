import { z } from 'zod'

import { mapValues } from '../../lib/functional'
import { safeParse, type ParseResult } from '../../lib/zod'

import { ControlDataTypeKey, type Data } from '../../common'
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

import { ShapeV2Control } from './shape-v2-control'

type ItemDefinition = ControlDefinition<string, unknown, any, any, any>
type KeyDefinitions = Record<string, ItemDefinition>

export type Config<Defs extends KeyDefinitions = KeyDefinitions> = {
  label?: string
  layout?: typeof Definition.Layout.Inline | typeof Definition.Layout.Popover
  readonly type: Defs
}

export const v1DataType = 'shape-v2::v1' as const

type ShapeDataType<C extends Config> = {
  [K in keyof C['type']]?: DataType_<C['type'][K]>
}

type V0DataType<C extends Config> = {
  [ControlDataTypeKey]: typeof v1DataType
  value: {
    [K in keyof C['type']]?: DataType_<C['type'][K]>
  }
}

type DataType<C extends Config> = ShapeDataType<C> | V0DataType<C>

type ValueType<C extends Config> = {
  [K in keyof C['type']]?: ValueType_<C['type'][K]>
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
  private static readonly v1DataType = v1DataType
  private static readonly dataSignature = {
    v0: { [ControlDataTypeKey]: this.v1DataType },
  } as const
  static readonly type = 'makeswift::controls::shape-v2' as const

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
    const version = z.literal(0)
    const type = z.literal(Definition.type)

    const keys = mapValues(this.keyDefs, (def) => def.schema)

    const v0Data = z.object(mapValues(keys, (key) => key.data)) as SchemaType<
      ShapeDataType<C>
    >
    const v1Data = z.object({
      [ControlDataTypeKey]: z.literal(Definition.v1DataType),
      value: v0Data,
    }) as SchemaType<V0DataType<C>>

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

    if (
      ControlDataTypeKey in data &&
      data[ControlDataTypeKey] === Definition.v1DataType
    ) {
      return mapValues(this.keyDefs, (def, key) =>
        def.fromData((data as V0DataType<C>).value[key]),
      )
    }

    return mapValues(this.keyDefs, (def, key) =>
      def.fromData((data as ShapeDataType<C>)[key]),
    )
  }

  toData(value: ValueType<C>): DataType<C> {
    return {
      ...Definition.dataSignature.v0,
      value: mapValues(this.keyDefs, (def, key) => def.toData(value[key])),
    }
  }

  copyData(
    data: DataType<C> | undefined,
    context: CopyContext,
  ): DataType<C> | undefined {
    if (data == null) return undefined

    if (
      ControlDataTypeKey in data &&
      data[ControlDataTypeKey] === Definition.v1DataType
    ) {
      return mapValues(this.keyDefs, (def, key) =>
        def.copyData((data as V0DataType<C>).value[key], context),
      )
    }

    return mapValues(this.keyDefs, (def, key) =>
      def.copyData((data as ShapeDataType<C>)[key], context),
    )
  }

  getTranslatableData(data: DataType<C>): Data {
    if (data == null) return null

    if (
      ControlDataTypeKey in data &&
      data[ControlDataTypeKey] === Definition.v1DataType
    ) {
      return mapValues(this.keyDefs, (def, key) =>
        def.getTranslatableData((data as V0DataType<C>).value[key]),
      )
    }

    return mapValues(this.keyDefs, (def, key) =>
      def.getTranslatableData((data as ShapeDataType<C>)[key]),
    )
  }

  mergeTranslatedData(
    data: DataType<C>,
    translatedData: Record<string, DataType<C>>,
    context: MergeTranslatableDataContext,
  ): Data {
    if (translatedData == null) return data

    if (
      ControlDataTypeKey in data &&
      data[ControlDataTypeKey] === Definition.v1DataType
    ) {
      return mapValues(this.keyDefs, (def, key) =>
        def.mergeTranslatedData(
          (data as V0DataType<C>).value[key],
          translatedData[key],
          context,
        ),
      )
    }

    return mapValues(this.keyDefs, (def, key) =>
      def.mergeTranslatedData(
        (data as ShapeDataType<C>)[key],
        translatedData[key],
        context,
      ),
    )
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

    if (
      ControlDataTypeKey in data &&
      data[ControlDataTypeKey] === Definition.v1DataType
    ) {
      return Object.entries(this.keyDefs).flatMap(
        ([key, def]) =>
          def.introspect((data as V0DataType<C>).value[key], target) ?? [],
      )
    }

    return Object.entries(this.keyDefs).flatMap(
      ([key, def]) =>
        def.introspect((data as ShapeDataType<C>)[key], target) ?? [],
    )
  }
}

// type UserConfig<
//   D extends KeyDefinitions,
//   L extends Config['layout'],
// > = Config<D> & {
//   layout?: L
// }

// type NormedConfig<
//   D extends KeyDefinitions,
//   L extends Config['layout'] = Config['layout'],
// > = undefined extends L
//   ? Config<D>
//   : Pick<Config<D>, 'label' | 'type'> & {
//       layout: L
//     }

export class ShapeV2Definition<
  C extends Config = Config,
> extends Definition<C> {}

export function ShapeV2<D extends KeyDefinitions, L extends Config['layout']>(
  config: Config<D>,
): ShapeV2Definition<Config<D>> {
  return new ShapeV2Definition<Config<D>>(
    (config?.layout == null
      ? { layout: Definition.Layout.Inline, ...config }
      : config) as Config<D>,
  )
}
// export function ShapeV2<D extends KeyDefinitions, L extends Config['layout']>(
//   config: UserConfig<D, L>,
// ): ShapeV2Definition<NormedConfig<D, L>> {
//   return new ShapeV2Definition<NormedConfig<D, L>>(
//     (config?.layout == null
//       ? { layout: Definition.Layout.Inline, ...config }
//       : config) as NormedConfig<D, L>,
//   )
// }

ShapeV2.Layout = Definition.Layout

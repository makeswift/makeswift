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
import { ShapeDefinition } from '../shape/v1'
import { ShapeV2Definition } from '../shape/v2'

import { GroupControl } from './group-control'

type ItemDefinition = ControlDefinition<string, unknown, any, any, any>
type KeyDefinitions = Record<string, ItemDefinition>

export type Config<Defs extends KeyDefinitions = KeyDefinitions> = {
  readonly label?: string
  readonly preferredLayout?:
    | typeof Definition.Layout.Inline
    | typeof Definition.Layout.Popover
  readonly props: Defs
}

type ShapeData<C extends Config> = DataType_<
  ShapeDefinition<{ type: C['props'] }>
>

type PropsData<C extends Config> = {
  [K in keyof C['props']]?: DataType_<C['props'][K]>
}

type VersionedData<C extends Config> = {
  [ControlDataTypeKey]:
    | typeof Definition.v1DataType
    | typeof ShapeV2Definition.v1DataType
  value: PropsData<C>
}

type DataType<C extends Config> = ShapeData<C> | VersionedData<C>

type ValueType<C extends Config> = {
  [K in keyof C['props']]?: ValueType_<C['props'][K]>
}

type ResolvedValueType<C extends Config> = {
  [K in keyof C['props']]: ResolvedValueType_<C['props'][K]>
}
type InstanceType<C extends Config> = GroupControl<Definition<C>>

class Definition<C extends Config> extends ControlDefinition<
  typeof Definition.type,
  C,
  DataType<C>,
  ValueType<C>,
  ResolvedValueType<C>,
  InstanceType<C>
> {
  static readonly type = 'makeswift::controls::group' as const
  static readonly v1DataType = 'group::v1' as const

  static readonly Layout = {
    Inline: `${this.type}::layout::inline`,
    Popover: `${this.type}::layout::popover`,
  } as const

  static deserialize(
    data: DeserializedRecord,
    deserializeCallback: (r: DeserializedRecord) => ControlDefinition,
  ): GroupDefinition {
    if (data.type !== Definition.type)
      throw new Error(
        `Group: expected '${Definition.type}', got '${data.type}'`,
      )

    const {
      config: { props, ...config },
    } = z
      .object({
        type: z.literal(Definition.type),
        config: z.object({
          label: z.string().optional(),
          preferredLayout: z
            .union([
              z.literal(Definition.Layout.Inline),
              z.literal(Definition.Layout.Popover),
            ])
            .optional(),
          props: z.record(z.string(), SerializationSchema.deserializedRecord),
        }),
      })
      .parse(data)

    const deserializedProps = mapValues(props, (itemDef) => {
      return deserializeCallback(itemDef)
    })

    return Group({
      props: deserializedProps,
      ...config,
    })
  }

  constructor(
    config: C,
    readonly dataType:
      | typeof Definition.v1DataType
      | typeof ShapeV2Definition.v1DataType,
  ) {
    super(config)
  }

  private get dataSignature() {
    return { [ControlDataTypeKey]: this.dataType }
  }

  get propDefs() {
    return this.config.props
  }

  get controlType() {
    return Definition.type
  }

  get schema() {
    const version = z.literal(1)
    const type = z.literal(Definition.type)

    const keys = mapValues(this.propDefs, (def) => def.schema)

    const propsData = z.object(
      mapValues(keys, (key) => key.data),
    ) as SchemaType<PropsData<C>>

    const versionedData = z.object({
      [ControlDataTypeKey]: z.union([
        z.literal(Definition.v1DataType),
        z.literal(ShapeV2Definition.v1DataType),
      ]),
      value: propsData,
    }) as SchemaType<VersionedData<C>>

    const data = z.union([propsData, versionedData])

    const value = z.object(mapValues(keys, (key) => key.value)) as SchemaType<
      ValueType<C>
    >

    const resolvedValue = z.object(
      mapValues(keys, (key) => key.resolvedValue),
    ) as SchemaType<ResolvedValueType<C>>

    const config = z.object({
      label: z.string().optional(),
      preferredLayout: z.union([
        z.literal(Definition.Layout.Inline),
        z.literal(Definition.Layout.Popover),
      ]),
      props: z.object(mapValues(keys, (key) => key.definition)),
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

    return mapValues(this.propDefs, (def, key) => def.fromData(propsData[key]))
  }

  propsToData(propsData: PropsData<C>): DataType<C> {
    return {
      ...this.dataSignature,
      value: propsData,
    }
  }

  toData(value: ValueType<C>): DataType<C> {
    return this.propsToData(
      mapValues(this.propDefs, (def, key) => def.toData(value[key])),
    )
  }

  copyData(
    data: DataType<C> | undefined,
    context: CopyContext,
  ): DataType<C> | undefined {
    if (data == null) return undefined

    const propsData = Definition.propsData(data)

    return this.propsToData(
      mapValues(this.propDefs, (def, key) =>
        def.copyData(propsData[key], context),
      ),
    )
  }

  getTranslatableData(data: DataType<C>): Data {
    if (data == null) return null

    const propsData = Definition.propsData(data)

    return mapValues(this.propDefs, (def, key) =>
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

    return mapValues(this.propDefs, (def, key) =>
      def.mergeTranslatedData(propsData[key], translatedData[key], context),
    )
  }

  createInstance(sendMessage: SendMessage): InstanceType<C> {
    return new GroupControl(this, sendMessage)
  }

  serialize(): [SerializedRecord, Transferable[]] {
    return serialize(this.config, {
      type: Definition.type,
    })
  }

  introspect<R>(data: DataType<C> | undefined, target: IntrospectionTarget<R>) {
    if (data == null) return []

    const propsData = Definition.propsData(data)

    return Object.entries(this.propDefs).flatMap(
      ([key, def]) => def.introspect(propsData[key], target) ?? [],
    )
  }

  static propsData<C extends Config>(data: DataType<C>): PropsData<C> {
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
  ): data is VersionedData<C> {
    return (
      data != null &&
      ControlDataTypeKey in data &&
      (data[ControlDataTypeKey] === Definition.v1DataType ||
        data[ControlDataTypeKey] === ShapeV2Definition.v1DataType)
    )
  }
}

export class GroupDefinition<C extends Config = Config> extends Definition<C> {}

export function Group<D extends KeyDefinitions>(
  config: Config<D>,
): GroupDefinition<Config<D>> {
  return new GroupDefinition<Config<D>>(
    config?.preferredLayout == null
      ? { preferredLayout: Definition.Layout.Inline, ...config }
      : config,
    Definition.v1DataType,
  )
}

Group.Layout = Definition.Layout

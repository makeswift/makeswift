import { z } from 'zod'

import { safeParse, type ParseResult } from '../../lib/zod'

import { ControlDataTypeKey } from '../../common'
import {
  type DeserializedRecord,
  type SerializedRecord,
} from '../../serialization'

import {
  ControlDefinition,
  serialize,
  type Resolvable,
  type SchemaType,
} from '../definition'
import { DefaultControlInstance, type SendMessage } from '../instance'

type Config = z.infer<typeof Definition.schema.relaxed.config>

type SchemaByDefaultValue<D extends Config['defaultValue']> =
  undefined extends D
    ? typeof Definition.schema.relaxed
    : typeof Definition.schema.strict

type Schema<C extends Config> = SchemaByDefaultValue<C['defaultValue']>
type DataType<C extends Config> = z.infer<Schema<C>['data']>
type ValueType<C extends Config> = z.infer<Schema<C>['value']>
type ResolvedValueType<C extends Config> = z.infer<Schema<C>['resolvedValue']>

type ReturnedSchemaType<C extends Config> = {
  definition: typeof Definition.schema.relaxed.definition
  type: typeof Definition.schema.relaxed.type
  data: SchemaType<DataType<C>>
  value: SchemaType<ValueType<C>>
  resolvedValue: SchemaType<ResolvedValueType<C>>
}

class Definition<C extends Config> extends ControlDefinition<
  typeof Definition.type,
  C,
  DataType<C>,
  ValueType<C>,
  ResolvedValueType<C>
> {
  private static readonly v1DataType = 'font::v1' as const
  private static readonly dataSignature = {
    v1: { [ControlDataTypeKey]: this.v1DataType },
  } as const
  static readonly type = 'makeswift::controls::font' as const

  static get schema() {
    const version = z.literal(1)
    const type = z.literal(this.type)

    const value = z.object({
      fontFamily: z.string(),
      fontStyle: z.string(),
      fontWeight: z.number(),
    })

    const versionedData = z.object({
      [ControlDataTypeKey]: z.literal(this.v1DataType),
      value,
    })

    const schemas = <V, D>(value: SchemaType<V>, data: SchemaType<D>) => {
      const config = z.object({
        label: z.string().optional(),
        defaultValue: value,
      })

      const definition = z.object({
        type,
        config,
        version,
      })

      return {
        type,
        value,
        resolvedValue: value,
        data,
        versionedData,
        config,
        version,
        definition,
      }
    }

    return {
      version,
      relaxed: schemas(value.optional(), versionedData.optional()),
      strict: schemas(value, versionedData),
    }
  }

  static deserialize(data: DeserializedRecord): FontDefinition {
    if (data.type !== Definition.type) {
      throw new Error(
        `Font: expected type ${Definition.type}, got ${data.type}`,
      )
    }

    const { config, version } = Definition.schema.relaxed.definition.parse(data)
    return new FontDefinition(config, version)
  }

  constructor(
    config: C,
    readonly version: z.infer<typeof Definition.schema.version>,
  ) {
    super(config)
  }

  get controlType() {
    return Definition.type
  }

  get schema(): ReturnedSchemaType<C> {
    return Definition.schema.relaxed
  }

  get dataSchema() {
    return (
      (this.config.defaultValue === undefined
        ? Definition.schema.relaxed
        : Definition.schema.strict) as Schema<C>
    ).data
  }

  safeParse(data: unknown | undefined): ParseResult<DataType<C> | undefined> {
    return safeParse(this.schema.data, data)
  }

  fromData(data: DataType<C> | undefined): ValueType<C> | undefined {
    return this.schema.data.optional().parse(data)?.value
  }

  toData(value: ValueType<C>): DataType<C> {
    if (value == null) return undefined

    return {
      ...Definition.dataSignature.v1,
      value,
    }
  }

  copyData(data: DataType<C> | undefined): DataType<C> | undefined {
    if (data == null) return data

    return {
      ...data,
      value: {
        ...data.value,
      },
    }
  }

  resolveValue(
    data: DataType<C> | undefined,
  ): Resolvable<ResolvedValueType<C> | undefined> {
    return {
      readStableValue: () => this.fromData(data),
      subscribe: () => () => {},
    }
  }

  createInstance(sendMessage: SendMessage) {
    return new DefaultControlInstance(sendMessage)
  }

  serialize(): [SerializedRecord, Transferable[]] {
    return serialize(this.config, {
      type: Definition.type,
      version: this.version,
    })
  }
}

export class FontDefinition<C extends Config = Config> extends Definition<C> {}

type UserConfig<D extends Config['defaultValue']> = Config & {
  defaultValue?: D
}

type NormedConfig<D extends Config['defaultValue']> = z.infer<
  SchemaByDefaultValue<D>['config']
>

export function Font<C extends Config['defaultValue']>(
  config?: UserConfig<C>,
): FontDefinition<NormedConfig<C>> {
  return new FontDefinition((config ?? {}) as NormedConfig<C>, 1)
}

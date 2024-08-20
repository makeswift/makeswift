import { match } from 'ts-pattern'
import { z } from 'zod'

import { safeParse, type ParseResult } from '../../lib/zod'

import { ControlDataTypeKey, Schema } from '../../common'
import { type CopyContext } from '../../context'
import {
  type DeserializedRecord,
  type SerializedRecord,
} from '../../serialization'

import { ControlDefinition, serialize, type SchemaType } from '../definition'
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
  private static readonly v1DataType = 'color::v1' as const
  private static readonly dataSignature = {
    v1: { [ControlDataTypeKey]: this.v1DataType },
  } as const

  static readonly type = 'makeswift::controls::color' as const

  static get schema() {
    const type = z.literal(this.type)
    const version = z.literal(1).optional()
    const value = Schema.colorData
    const resolvedSwatchValue = Schema.resolvedColorData

    const schemas = <R>(resolvedValue: SchemaType<R>) => {
      const data = value.merge(
        z.object({
          [ControlDataTypeKey]: z.literal(this.v1DataType).optional(),
        }),
      )

      const config = z.object({
        label: z.string().optional(),
        labelOrientation: z
          .union([z.literal('horizontal'), z.literal('vertical')])
          .optional(),
        defaultValue: resolvedValue,
        hideAlpha: z.boolean().optional(),
      })

      const definition = z.object({
        type,
        config,
        version,
      })

      return {
        type,
        value,
        resolvedSwatchValue,
        resolvedValue,
        data,
        config,
        version,
        definition,
      }
    }

    return {
      version,
      relaxed: schemas(z.string().optional()),
      strict: schemas(z.string()),
    }
  }

  static deserialize(data: DeserializedRecord): ColorDefinition {
    if (data.type !== Definition.type)
      throw new Error(
        `Color deserialization: expected '${Definition.type}', got '${data.type}'`,
      )

    const { config, version } = Definition.schema.relaxed.definition.parse(data)
    return new ColorDefinition(config, version)
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
    return safeParse(this.dataSchema, data)
  }

  fromData(data: DataType<C> | undefined): ValueType<C> | undefined {
    const inputSchema = this.dataSchema.optional()
    return match(data satisfies z.infer<typeof inputSchema>)
      .with(Definition.dataSignature.v1, ({ swatchId, alpha }) => ({
        swatchId,
        alpha,
      }))
      .otherwise((value) => value)
  }

  toData(value: ValueType<C>): DataType<C> {
    return match(this.version)
      .with(1, () => ({
        ...Definition.dataSignature.v1,
        ...value,
      }))
      .with(undefined, () => value)
      .exhaustive()
  }

  copyData(
    data: DataType<C> | undefined,
    { replacementContext }: CopyContext,
  ): DataType<C> | undefined {
    if (data == null) return data

    const replaceSwatchId = (swatchId: string) =>
      replacementContext.swatchIds.get(swatchId) ?? swatchId

    const inputSchema = this.dataSchema.optional()
    return match(data satisfies z.infer<typeof inputSchema>)
      .with(Definition.dataSignature.v1, (val) => ({
        ...val,
        swatchId: replaceSwatchId(val.swatchId),
      }))
      .otherwise((val) => ({
        ...val,
        swatchId: replaceSwatchId(val.swatchId),
      }))
  }

  createInstance(sendMessage: SendMessage<any>) {
    return new DefaultControlInstance(sendMessage)
  }

  serialize(): [SerializedRecord, Transferable[]] {
    return serialize(this.config, {
      type: Definition.type,
      version: this.version,
    })
  }
}

export class ColorDefinition<C extends Config = Config> extends Definition<C> {}

type UserConfig<D extends Config['defaultValue']> = Config & {
  defaultValue?: D
}

type NormedConfig<D extends Config['defaultValue']> = z.infer<
  SchemaByDefaultValue<D>['config']
>

export function Color<D extends Config['defaultValue']>(
  config?: UserConfig<D>,
): ColorDefinition<NormedConfig<D>> {
  return new ColorDefinition<NormedConfig<D>>(config ?? {}, 1)
}

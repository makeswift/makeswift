import { match } from 'ts-pattern'
import { z, ZodLiteral } from 'zod'

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

type Config = z.infer<
  | typeof Definition.schema.withVariants.relaxed.config
  | typeof Definition.schema.withVariants.strict.config
  | typeof Definition.schema.withoutVariants.relaxed.config
  | typeof Definition.schema.withoutVariants.strict.config
>

type SchemaByVariantAndDefaultValue<
  V extends Config['variant'],
  D extends Config['defaultValue'],
> = V extends false
  ? undefined extends D
    ? typeof Definition.schema.withoutVariants.relaxed
    : typeof Definition.schema.withoutVariants.strict
  : undefined extends D
    ? typeof Definition.schema.withVariants.relaxed
    : typeof Definition.schema.withVariants.strict

type Schema<C extends Config> = SchemaByVariantAndDefaultValue<
  C['variant'],
  C['defaultValue']
>
type DataType<C extends Config> = z.infer<Schema<C>['data']>
type ValueType<C extends Config> = z.infer<Schema<C>['value']>
type ResolvedValueType<C extends Config> = z.infer<Schema<C>['resolvedValue']>
type DefinitionType<C extends Config> = z.infer<Schema<C>['definition']>
type TypeType<C extends Config> = z.infer<Schema<C>['type']>

type ReturnedSchemaType<C extends Config> = {
  definition: SchemaType<DefinitionType<C>>
  type: SchemaType<TypeType<C>>
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

    const withVariants = z.object({
      fontFamily: z.string(),
      fontStyle: z.union([z.literal('normal'), z.literal('italic')]),
      fontWeight: z.union([
        z.literal(100),
        z.literal(200),
        z.literal(300),
        z.literal(400),
        z.literal(500),
        z.literal(600),
        z.literal(700),
        z.literal(800),
        z.literal(900),
      ]),
    })

    const withoutVariants = z.object({
      fontFamily: z.string(),
    })

    const versionedDataWithVariants = z.object({
      [ControlDataTypeKey]: z.literal(this.v1DataType),
      value: withVariants,
    })

    const versionedDataWithoutVariants = z.object({
      [ControlDataTypeKey]: z.literal(this.v1DataType),
      value: withoutVariants,
    })

    const schemas = <V, D, A extends ZodLiteral<boolean>>(
      value: SchemaType<V>,
      data: SchemaType<D>,
      variant: A,
    ) => {
      const config = z.object({
        label: z.string().optional(),
        defaultValue: value,
        variant,
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
        config,
        version,
        definition,
      }
    }

    return {
      version,
      withoutVariants: {
        relaxed: schemas(
          withoutVariants.optional(),
          versionedDataWithoutVariants.optional(),
          z.literal<false>(false),
        ),
        strict: schemas(
          withoutVariants,
          versionedDataWithoutVariants,
          z.literal<false>(false),
        ),
      },
      withVariants: {
        relaxed: schemas(
          withVariants.optional(),
          versionedDataWithVariants.optional(),
          z.literal<true>(true),
        ),
        strict: schemas(
          withVariants,
          versionedDataWithVariants,
          z.literal<true>(true),
        ),
      },
    }
  }

  static deserialize(data: DeserializedRecord): FontDefinition {
    if (data.type !== Definition.type) {
      throw new Error(
        `Font: expected type ${Definition.type}, got ${data.type}`,
      )
    }

    const { config, version } = z
      .union([
        Definition.schema.withVariants.relaxed.definition,
        Definition.schema.withoutVariants.relaxed.definition,
      ])
      .parse(data)
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
    const { withVariants, withoutVariants, ...baseSchema } = Definition.schema

    const refinedSchema = this.refinedSchema

    const schema = {
      ...baseSchema,
      type: refinedSchema.type,
      definition: refinedSchema.definition,
      value: refinedSchema.value,
      data: refinedSchema.data,
      resolvedValue: refinedSchema.resolvedValue,
    }

    return schema as ReturnedSchemaType<C>
  }

  get refinedSchema() {
    return this.config.variant === false
      ? this.config.defaultValue === undefined
        ? Definition.schema.withoutVariants.relaxed
        : Definition.schema.withoutVariants.strict
      : this.config.defaultValue === undefined
        ? Definition.schema.withVariants.relaxed
        : Definition.schema.withVariants.strict
  }

  get dataSchema(): Schema<C>['data'] {
    return this.refinedSchema.data
  }

  safeParse(data: unknown | undefined): ParseResult<DataType<C> | undefined> {
    return safeParse(this.dataSchema, data)
  }

  fromData(data: DataType<C> | undefined): ValueType<C> | undefined {
    const inputSchema = this.dataSchema.optional()
    return match(data satisfies z.infer<typeof inputSchema>)
      .with(Definition.dataSignature.v1, ({ value }) => value)
      .otherwise(() => undefined)
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
      name: Definition.type,
      readStable: () => this.fromData(data) ?? this.config.defaultValue,
      subscribe: () => () => {},
      triggerResolve: async () => {},
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

type DefaultValueByVariant<V extends Config['variant']> = z.infer<
  false extends V
    ? typeof Definition.schema.withoutVariants.strict.config
    : typeof Definition.schema.withVariants.strict.config
>['defaultValue']

type UserConfigRequiredDefault<V extends Config['variant']> = {
  label?: string
  variant?: V
  defaultValue: DefaultValueByVariant<V>
}

type UserConfigOptionalDefault<V extends Config['variant']> = {
  label?: string
  variant?: V
  defaultValue?: DefaultValueByVariant<V> | undefined
}

type NormedConfig<
  V extends Config['variant'],
  D extends Config['defaultValue'],
> = z.infer<SchemaByVariantAndDefaultValue<V, D>['config']>

export function Font<V extends Config['variant'] = true>(
  config: UserConfigRequiredDefault<V>,
): FontDefinition<NormedConfig<V, DefaultValueByVariant<V>>>

export function Font<V extends Config['variant'] = true>(
  config?: UserConfigOptionalDefault<V>,
): FontDefinition<NormedConfig<V, DefaultValueByVariant<V> | undefined>>

export function Font<V extends Config['variant']>(
  config?: UserConfigRequiredDefault<V> | UserConfigOptionalDefault<V>,
): FontDefinition<NormedConfig<V, DefaultValueByVariant<V> | undefined>> {
  return new FontDefinition(
    (config ? { variant: true, ...config } : { variant: true }) as NormedConfig<
      V,
      DefaultValueByVariant<V> | undefined
    >,
    1,
  )
}

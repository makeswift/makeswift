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

type Config = z.infer<
  | typeof Definition.schema.withVariants.relaxed.config
  | typeof Definition.schema.withoutVariants.relaxed.config
>

type A = typeof Definition.schema.withVariants.relaxed
type B = typeof Definition.schema.withVariants.strict
type C = typeof Definition.schema.withoutVariants.relaxed
type D = typeof Definition.schema.withoutVariants.strict

type SchemaByVariantAndDefaultValue<
  V extends Config['variant'],
  D extends Config['defaultValue'],
> = false extends V
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

type ReturnedSchemaType<C extends Config> = {
  definition:
    | typeof Definition.schema.withoutVariants.relaxed.definition
    | typeof Definition.schema.withVariants.relaxed.definition
  type:
    | typeof Definition.schema.withoutVariants.relaxed.type
    | typeof Definition.schema.withVariants.relaxed.type
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
      fontStyle: z.string(),
      fontWeight: z.number(),
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

    const withVariant = z.literal<boolean>(true)
    const withoutVariant = z.literal<boolean>(false)

    const schemas = <V, D>(
      value: SchemaType<V>,
      data: SchemaType<D>,
      hasVariant: z.ZodLiteral<boolean>,
    ) => {
      const config = z.object({
        label: z.string().optional(),
        defaultValue: value,
        variant: hasVariant,
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
          withoutVariant,
        ),
        strict: schemas(
          withoutVariants,
          versionedDataWithoutVariants,
          withoutVariant,
        ),
      },
      withVariants: {
        relaxed: schemas(
          withVariants.optional(),
          versionedDataWithVariants.optional(),
          withVariant,
        ),
        strict: schemas(withVariants, versionedDataWithVariants, withVariant),
      },
    }
  }

  static deserialize(data: DeserializedRecord): FontDefinition {
    if (data.type !== Definition.type) {
      throw new Error(
        `Font: expected type ${Definition.type}, got ${data.type}`,
      )
    }

    const { config, version } =
      Definition.schema.withVariants.relaxed.definition.parse(data)
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

    return {
      ...baseSchema,
      type: withVariants.relaxed.type,
      definition: withVariants.relaxed.definition,
      value: z.union([
        withoutVariants.relaxed.value,
        withVariants.relaxed.value,
      ]),
      data: z.union([withoutVariants.relaxed.data, withVariants.relaxed.data]),
      resolvedValue: z.union([
        withoutVariants.relaxed.resolvedValue,
        withVariants.relaxed.resolvedValue,
      ]),
    }
  }

  get dataSchema() {
    return (
      this.config.variant === false
        ? ((this.config.defaultValue === undefined
            ? Definition.schema.withoutVariants.relaxed
            : Definition.schema.withoutVariants.strict) as Schema<C>)
        : ((this.config.defaultValue === undefined
            ? Definition.schema.withVariants.relaxed
            : Definition.schema.withVariants.strict) as Schema<C>)
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

// todo(josh): i am struggling to understand why there are two configs here.
type UserConfig<
  V extends Config['variant'],
  D extends Config['defaultValue'],
> = Config & {
  variant?: V
  defaultValue?: D
}

type NormedConfig<
  V extends Config['variant'],
  D extends Config['defaultValue'],
> = z.infer<SchemaByVariantAndDefaultValue<V, D>['config']>

export function Font<
  V extends Config['variant'],
  D extends Config['defaultValue'],
>(config?: UserConfig<V, D>): FontDefinition<NormedConfig<V, D>> {
  return new FontDefinition((config ?? {}) as NormedConfig<V, D>, 1)
}

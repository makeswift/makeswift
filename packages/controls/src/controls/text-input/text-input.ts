import { match, P } from 'ts-pattern'
import { z } from 'zod'

import { safeParse, type ParseResult } from '../../lib/zod'

import { ControlDataTypeKey, type Data } from '../../common'
import {
  type CopyContext,
  type MergeTranslatableDataContext,
} from '../../context'
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
  private static readonly v1DataType = 'text-input::v1' as const
  private static readonly dataSignature = {
    v1: { [ControlDataTypeKey]: this.v1DataType },
  } as const

  static readonly type = 'makeswift::controls::text-input' as const

  static get schema() {
    const version = z.literal(1).optional()
    const versionedData = z.object({
      [ControlDataTypeKey]: z.literal(this.v1DataType),
      value: z.string(),
    })

    const schemas = <V, D>(value: SchemaType<V>, data: SchemaType<D>) => {
      const type = z.literal(this.type)

      const config = z.object({
        label: z.string().optional(),
        description: z.string().optional(),
        defaultValue: value,
        selectAll: z.boolean().optional(),
      })

      const definition = z.object({
        type,
        config,
        version,
      })

      return {
        type,
        data,
        value,
        resolvedValue: value,
        config,
        definition,
        versionedData,
        version,
      }
    }

    return {
      version,
      relaxed: schemas(
        z.string().optional(),
        z.union([z.string(), versionedData, z.undefined()]),
      ),
      strict: schemas(z.string(), z.union([z.string(), versionedData])),
    }
  }

  static deserialize(data: DeserializedRecord): TextInputDefinition {
    if (data.type !== Definition.type) {
      throw new Error(
        `TextInput: expected type ${Definition.type}, got ${data.type}`,
      )
    }

    const { version, config } = Definition.schema.relaxed.definition.parse(data)
    return new TextInputDefinition(config, version)
  }

  constructor(
    config: C,
    readonly version: z.infer<typeof Definition.schema.relaxed.version>,
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
      .with(Definition.dataSignature.v1, ({ value }) => value)
      .otherwise((val) => val)
  }

  toData(value: ValueType<C>): DataType<C> {
    return match({ version: this.version, value })
      .with({ version: 1, value: P.string }, ({ value }) => ({
        ...Definition.dataSignature.v1,
        value,
      }))
      .with({ version: 1, value: undefined }, () => undefined)
      .with({ version: undefined }, ({ value }) => value)
      .otherwise(() => value)
  }

  copyData(
    data: DataType<C> | undefined,
    _context: CopyContext,
  ): DataType<C> | undefined {
    return data
  }

  getTranslatableData(data: DataType<C>): Data {
    return data
  }

  mergeTranslatedData(
    data: DataType<C>,
    translatedData: Data,
    _context: MergeTranslatableDataContext,
  ): Data {
    if (translatedData == null) return data
    return translatedData
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

export class TextInputDefinition<
  C extends Config = Config,
> extends Definition<C> {}

type UserConfig<D extends Config['defaultValue']> = Config & {
  defaultValue?: D
}

type NormedConfig<D extends Config['defaultValue']> = z.infer<
  SchemaByDefaultValue<D>['config']
>

export function TextInput<D extends Config['defaultValue']>(
  config?: UserConfig<D>,
): TextInputDefinition<NormedConfig<D>> {
  return new TextInputDefinition((config ?? {}) as NormedConfig<D>, 1)
}

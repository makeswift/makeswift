import { P, match } from 'ts-pattern'
import { z } from 'zod'

import { ControlDataTypeKey, type Data } from '../common'
import { type CopyContext, type MergeTranslatableDataContext } from '../context'
import { type ResourceResolver } from '../resource-resolver'
import { type Effector } from '../effector'

import {
  DefaultControlInstance,
  ControlInstance,
  type SendMessage,
} from '../control-instance'

import {
  ControlDefinition,
  safeParse,
  serialize,
  type ParseResult,
  type SerializedRecord,
  type Resolvable,
} from '../control-definition'

type Config = z.infer<typeof Definition.schema.relaxed.config>

type SchemaType<C extends Config> = undefined extends C['defaultValue']
  ? typeof Definition.schema.relaxed
  : typeof Definition.schema.strict

type DataType<C extends Config> = z.infer<SchemaType<C>['data']>
type ValueType<C extends Config> = z.infer<SchemaType<C>['value']>
type ResolvedValueType<C extends Config> = z.infer<
  SchemaType<C>['resolvedValue']
>

class Definition<C extends Config = Config> extends ControlDefinition<
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

  constructor(
    readonly config: C,
    readonly version: z.infer<typeof Definition.schema.relaxed.version>,
  ) {
    super(config)
  }

  static get schema() {
    const version = z.literal(1).optional()

    const schemas = <V, U>(strictValue: z.ZodType<U>, value: z.ZodType<V>) => {
      const type = z.literal(this.type)
      const versionedData = z.object({
        [ControlDataTypeKey]: z.literal(this.v1DataType),
        value: strictValue,
      })

      const data = z.union(
        value.isOptional()
          ? [strictValue, versionedData, z.undefined()]
          : [strictValue, versionedData],
      )

      const config = z.object({
        label: z.string().optional(),
        defaultValue: z.string().optional(),
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
      relaxed: schemas(z.string(), z.string().optional()),
      strict: schemas(z.string(), z.string()),
    }
  }

  static deserialize(data: SerializedRecord): Definition {
    if (data.type !== Definition.type) {
      throw new Error(
        `TextInput: expected type ${Definition.type}, got ${data.type}`,
      )
    }

    const { version, config } = Definition.schema.relaxed.definition.parse(data)
    return new Definition(config, version)
  }

  get controlType() {
    return Definition.type
  }

  get schema() {
    return (
      this.config.defaultValue === undefined
        ? Definition.schema.relaxed
        : Definition.schema.strict
    ) as SchemaType<C>
  }

  safeParse(data: unknown | undefined): ParseResult<DataType<C> | undefined> {
    return safeParse(this.schema.data, data)
  }

  fromData(data: DataType<C> | undefined): ValueType<C> | undefined {
    const inputSchema = this.schema.data.optional()
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

  resolveValue(
    value: DataType<C> | undefined,
    _resolver: ResourceResolver,
    _effector: Effector,
  ): Resolvable<ResolvedValueType<C> | undefined> {
    return {
      readStableValue: (_previous?: ResolvedValueType<C>) => {
        return this.fromData(value) ?? this.config.defaultValue
      },
      subscribe: () => () => {},
      triggerResolve: async () => {},
    }
  }

  createInstance(sendMessage: SendMessage<any>): ControlInstance<any> {
    return new DefaultControlInstance(sendMessage)
  }

  serialize(): [SerializedRecord, Transferable[]] {
    return serialize(this.config, {
      type: Definition.type,
      version: this.version,
    })
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
}

export const TextInput = <C extends Config>(config?: C) =>
  new (class TextInput extends Definition<C> {})(config ?? ({} as C), 1)

export { Definition as TextInputDefinition }

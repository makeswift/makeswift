import { match } from 'ts-pattern'
import { z } from 'zod'

import { ControlDataTypeKey } from '../common'
import { type CopyContext } from '../context'

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
  private static readonly v1DataType = 'checkbox::v1' as const
  private static readonly dataSignature = {
    v1: { [ControlDataTypeKey]: this.v1DataType },
  } as const

  static readonly type = 'makeswift::controls::checkbox' as const

  static get schema() {
    const version = z.literal(1).optional()
    const versionedData = z.object({
      [ControlDataTypeKey]: z.literal(this.v1DataType),
      value: z.boolean(),
    })

    const schemas = <V, D>(value: z.ZodType<V>, data: z.ZodType<D>) => {
      const type = z.literal(this.type)

      const config = z.object({
        label: z.string().optional(),
        defaultValue: value,
      })

      const definition = z.object({
        type: z.literal(this.type),
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
      relaxed: schemas(
        z.boolean().optional(),
        z.union([z.boolean(), versionedData, z.undefined()]),
      ),
      strict: schemas(z.boolean(), z.union([z.boolean(), versionedData])),
    }
  }

  static deserialize(data: SerializedRecord): Definition {
    if (data.type !== Definition.type)
      throw new Error(
        `Checkbox: expected '${Definition.type}', got '${data.type}'`,
      )

    const { config, version } = Definition.schema.relaxed.definition.parse(data)
    return new Definition(config, version)
  }

  constructor(
    readonly config: C,
    readonly version: z.infer<typeof Definition.schema.version>,
  ) {
    super(config)
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
      .otherwise((value) => value)
  }

  toData(value: ValueType<C>): DataType<C> {
    return match(this.version)
      .with(1, () =>
        value === undefined
          ? undefined
          : {
              ...Definition.dataSignature.v1,
              value,
            },
      )
      .with(undefined, () => value)
      .exhaustive()
  }

  copyData(
    data: DataType<C> | undefined,
    _context: CopyContext,
  ): DataType<C> | undefined {
    return data
  }

  resolveValue(
    data: DataType<C> | undefined,
    _resolver: ResourceResolver,
    _effector: Effector,
  ): Resolvable<ResolvedValueType<C> | undefined> {
    return {
      readStableValue: (_previous?: ResolvedValueType<C>) =>
        this.fromData(data) ?? this.config.defaultValue,
      subscribe: () => () => {},
      triggerResolve: async () => {},
    }
  }

  createInstance(sendMessage: SendMessage<any>): ControlInstance {
    return new DefaultControlInstance(sendMessage)
  }

  serialize(): [SerializedRecord, Transferable[]] {
    return serialize(this.config, {
      type: Definition.type,
      version: this.version,
    })
  }
}

export const Checkbox = <C extends Config>(config?: C) =>
  new (class Checkbox extends Definition<C> {})(config ?? ({} as C), 1)

export { Definition as CheckboxDefinition }

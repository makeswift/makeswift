import { match } from 'ts-pattern'
import { z } from 'zod'

import { ControlDataTypeKey } from '../common'
import { type CopyContext } from '../context'

import {
  type ResourceResolver,
  type ValueSubscription,
} from '../resource-resolver'

import {
  DefaultControlInstance,
  ControlInstance,
  type SendType,
} from '../control-instance'

import {
  ControlDefinition,
  safeParse,
  serialize,
  type ParseResult,
} from '../control-definition'

type Config = z.infer<typeof Definition.schema.relaxed.config>

type DataSchemaType<C extends Config> = undefined extends C['defaultValue']
  ? typeof Definition.schema.relaxed
  : typeof Definition.schema.strict

type DataType<C extends Config> = z.infer<DataSchemaType<C>['data']>
type ValueType<C extends Config> = z.infer<DataSchemaType<C>['value']>

class Definition<C extends Config = Config> extends ControlDefinition<
  typeof Definition.type,
  C,
  DataType<C>,
  ValueType<C>
> {
  private static readonly v1DataType = 'checkbox::v1' as const
  private static readonly dataSignature = {
    v1: { [ControlDataTypeKey]: this.v1DataType },
  } as const

  static readonly type = 'makeswift::controls::checkbox' as const

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
          : [value, versionedData],
      )

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
      relaxed: schemas(z.boolean(), z.boolean().optional()),
      strict: schemas(z.boolean(), z.boolean()),
    }
  }

  static deserialize(data: unknown): Definition {
    const { config, version } = this.schema.relaxed.definition.parse(data)
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
    ) as DataSchemaType<C>
  }

  safeParse(data: unknown | undefined): ParseResult<DataType<C> | undefined> {
    return safeParse(this.schema.data, data)
  }

  fromData(data: DataType<C> | undefined): ValueType<C> | undefined {
    const inputSchema = this.schema.data.optional()
    return (
      match(data satisfies z.infer<typeof inputSchema>)
        .with(Definition.dataSignature.v1, ({ value }) => value)
        .otherwise((value) => value) ?? this.config.defaultValue
    )
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
    value: ValueType<C>,
    _resolver: ResourceResolver,
  ): ValueSubscription<ValueType<C>> {
    return {
      readValue: () =>
        value === undefined ? this.config.defaultValue : this.fromData(value),
      subscribe: () => () => {},
    }
  }

  createInstance(send: SendType<ControlInstance>): ControlInstance {
    return new DefaultControlInstance(send)
  }

  serialize(): [unknown, Transferable[]] {
    return serialize(this.config, {
      type: Definition.type,
      version: this.version,
    })
  }

  getSwatchIds(_data: DataType<C> | undefined): string[] {
    return []
  }
}

export const Checkbox = <C extends Config>(config?: C) =>
  new (class Checkbox extends Definition<C> {})(config ?? ({} as C), 1)

export { Definition as CheckboxDefinition }

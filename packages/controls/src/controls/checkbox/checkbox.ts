import { match, P } from 'ts-pattern'
import { z } from 'zod'

import { safeParse, type ParseResult } from '../../lib/zod'

import { ControlDataTypeKey } from '../../common'
import { type CopyContext } from '../../context'
import { type DeserializedRecord } from '../../serialization'

import {
  ControlDefinition,
  type Resolvable,
  type SchemaType,
} from '../definition'
import { DefaultControlInstance, type SendMessage } from '../instance'
import { ControlDefinitionVisitor } from '../visitor'

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

    const schemas = <V, D>(value: SchemaType<V>, data: SchemaType<D>) => {
      const type = z.literal(this.type)

      const config = z.object({
        label: z.string().optional(),
        description: z.string().optional(),
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
      relaxed: schemas(
        z.boolean().optional(),
        z.union([z.boolean(), versionedData, z.undefined()]),
      ),
      strict: schemas(z.boolean(), z.union([z.boolean(), versionedData])),
    }
  }

  static deserialize(data: DeserializedRecord): CheckboxDefinition {
    if (data.type !== Definition.type)
      throw new Error(
        `Checkbox: expected '${Definition.type}', got '${data.type}'`,
      )

    const { config, version } = Definition.schema.relaxed.definition.parse(data)
    return new CheckboxDefinition(config, version)
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
      .with(Definition.dataSignature.v1, ({ value }) => value)
      .otherwise((value) => value)
  }

  toData(value: ValueType<C>): DataType<C> {
    return match({ version: this.version, value })
      .with({ version: 1, value: P.boolean }, ({ value }) => ({
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
    data: DataType<C> | undefined,
  ): Resolvable<ResolvedValueType<C> | undefined> {
    return {
      name: Definition.type,
      readStable: () => this.fromData(data) ?? this.config.defaultValue,
      subscribe: () => () => {},
      triggerResolve: async () => {},
    }
  }

  createInstance(sendMessage: SendMessage<any>) {
    return new DefaultControlInstance(sendMessage)
  }

  accept<R>(visitor: ControlDefinitionVisitor<R>, ...args: unknown[]): R {
    return visitor.visitCheckbox(this, ...args)
  }
}

export class CheckboxDefinition<
  C extends Config = Config,
> extends Definition<C> {}

type UserConfig<D extends Config['defaultValue']> = Config & {
  defaultValue?: D
}

type NormedConfig<D extends Config['defaultValue']> = z.infer<
  SchemaByDefaultValue<D>['config']
>

export function Checkbox<D extends Config['defaultValue']>(
  config?: UserConfig<D>,
): CheckboxDefinition<NormedConfig<D>> {
  return new CheckboxDefinition((config ?? {}) as NormedConfig<D>, 1)
}

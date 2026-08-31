import { match, P } from 'ts-pattern'
import { z } from 'zod'

import { safeParse, type ParseResult } from '../../lib/zod'

import { AcceptedTextDataTypes, ControlDataTypeKey } from '../../common'
import { TextDataTypes } from '../../common/data-types'
import { type CopyContext } from '../../context'
import { type DeserializedRecord } from '../../serialization'

import { ContextValueSchema, type AnyContextValue } from '../context-value'
import {
  ControlDefinition,
  type Resolvable,
  type SchemaType,
} from '../definition'
import { DefaultControlInstance, type ControlInstanceArgs } from '../instance'
import { ControlDefinitionVisitor } from '../visitor'

type DefinitionSchema<P extends AnyContextValue = AnyContextValue> = ReturnType<
  typeof Definition.schema<P>
>

type Config<P extends AnyContextValue = AnyContextValue> = z.infer<
  DefinitionSchema<P>['relaxed']['config']
>

type SchemaByDefaultValue<
  D extends Config['defaultValue'],
  P extends AnyContextValue = AnyContextValue,
> = undefined extends D
  ? DefinitionSchema<P>['relaxed']
  : DefinitionSchema<P>['strict']

type Schema<C extends Config> = SchemaByDefaultValue<C['defaultValue']>
type DataType<C extends Config> = z.infer<Schema<C>['data']>
type ValueType<C extends Config> = z.infer<Schema<C>['value']>
type ResolvedValueType<C extends Config> = z.infer<Schema<C>['resolvedValue']>

type ReturnedSchemaType<C extends Config> = {
  definition: DefinitionSchema['relaxed']['definition']
  type: DefinitionSchema['relaxed']['type']
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
  private static readonly v1DataType = TextDataTypes.code
  private static readonly dataSignature = {
    v1: { [ControlDataTypeKey]: this.v1DataType },
  } as const

  static readonly type = 'makeswift::controls::code' as const

  static schema<P extends AnyContextValue = AnyContextValue>() {
    const provides = ContextValueSchema.provides as SchemaType<P>

    const version = z.literal(1)
    const versionedData = z.object({
      [ControlDataTypeKey]: z.enum(AcceptedTextDataTypes),
      value: z.string(),
    })

    const resolvedInner = z.object({
      value: z.string(),
    })

    const schemas = <V, D, R>(
      value: SchemaType<V>,
      data: SchemaType<D>,
      resolvedValue: SchemaType<R>,
    ) => {
      const type = z.literal(this.type)

      const config = z.object({
        label: z.string().optional(),
        description: z.string().optional(),
        defaultValue: value,
        provides: provides.optional(),
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
        resolvedValue,
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
        resolvedInner.optional(),
      ),
      strict: schemas(
        z.string(),
        z.union([z.string(), versionedData]),
        resolvedInner,
      ),
    }
  }

  static deserialize(data: DeserializedRecord): CodeDefinition {
    if (data.type !== Definition.type) {
      throw new Error(
        `Code: expected type ${Definition.type}, got ${data.type}`,
      )
    }

    const { version, config } =
      Definition.schema().relaxed.definition.parse(data)
    return new CodeDefinition(config, version)
  }

  constructor(
    config: C,
    readonly version: z.infer<DefinitionSchema['relaxed']['version']>,
  ) {
    super(config)
  }

  get controlType() {
    return Definition.type
  }

  get schema(): ReturnedSchemaType<C> {
    return Definition.schema().relaxed
  }

  get dataSchema() {
    return (
      (this.config.defaultValue === undefined
        ? Definition.schema().relaxed
        : Definition.schema().strict) as Schema<C>
    ).data
  }

  safeParse(data: unknown | undefined): ParseResult<DataType<C> | undefined> {
    return safeParse(this.dataSchema, data)
  }

  fromData(data: DataType<C> | undefined): ValueType<C> | undefined {
    const inputSchema = this.dataSchema.optional()
    return match(data satisfies z.infer<typeof inputSchema>)
      .with(
        { [ControlDataTypeKey]: P.union(...AcceptedTextDataTypes) },
        ({ value }) => value,
      )
      .otherwise((val) => val)
  }

  toData(value: ValueType<C>): DataType<C> {
    if (value === undefined) return undefined as DataType<C>
    return {
      ...Definition.dataSignature.v1,
      value,
    } as DataType<C>
  }

  copyData(
    data: DataType<C> | undefined,
    _context: CopyContext,
  ): DataType<C> | undefined {
    return data
  }

  resolveValueFromData(
    data: DataType<C> | undefined,
  ): ResolvedValueType<C> | undefined {
    const value = this.fromData(data) ?? this.config.defaultValue
    return value === undefined ? undefined : ({ value } as ResolvedValueType<C>)
  }

  resolveValue(
    data: DataType<C> | undefined,
  ): Resolvable<ResolvedValueType<C> | undefined> {
    const resolved = this.resolveValueFromData(data)
    return {
      name: Definition.type,
      readStable: () => resolved,
      subscribe: () => () => {},
      triggerResolve: async () => {},
    }
  }

  createInstance(args: ControlInstanceArgs) {
    return new DefaultControlInstance(args)
  }

  accept<R>(visitor: ControlDefinitionVisitor<R>, ...args: unknown[]): R {
    return visitor.visitCode(this, ...args)
  }
}

export class CodeDefinition<C extends Config = Config> extends Definition<C> {}

type UserConfig<
  D extends Config['defaultValue'],
  P extends AnyContextValue,
> = Config<P> & {
  defaultValue?: D
}

type NormedConfig<
  D extends Config['defaultValue'],
  P extends AnyContextValue,
> = z.infer<SchemaByDefaultValue<D, P>['config']>

export function Code<
  D extends Config['defaultValue'],
  P extends AnyContextValue = never,
>(config?: UserConfig<D, P>): CodeDefinition<NormedConfig<D, P>> {
  return new CodeDefinition((config ?? {}) as NormedConfig<D, P>, 1)
}

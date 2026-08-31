import { match, P } from 'ts-pattern'
import { z } from 'zod'

import { safeParse, type ParseResult } from '../../lib/zod'

import { AcceptedNumberDataTypes, ControlDataTypeKey } from '../../common'
import { NumberDataTypes } from '../../common/data-types'
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

/**Except for its name, control type, and the showInput config prop, this control is identical to Number.
 * Consider consolidating their implementation in the future. */

class Definition<C extends Config> extends ControlDefinition<
  typeof Definition.type,
  C,
  DataType<C>,
  ValueType<C>,
  ResolvedValueType<C>
> {
  private static readonly v1DataType = NumberDataTypes.number
  private static readonly dataSignature = {
    v1: { [ControlDataTypeKey]: this.v1DataType },
  } as const

  static readonly type = 'makeswift::controls::slider' as const

  static schema<P extends AnyContextValue = AnyContextValue>() {
    const provides = ContextValueSchema.provides as SchemaType<P>

    const version = z.literal(1).optional()

    const versionedData = z.object({
      [ControlDataTypeKey]: z.enum(AcceptedNumberDataTypes),
      value: z.number(),
    })

    const schemas = <V, D>(value: SchemaType<V>, data: SchemaType<D>) => {
      const type = z.literal(this.type)

      const config = z.object({
        label: z.string().optional(),
        description: z.string().optional(),
        defaultValue: value,
        min: z.number().optional(),
        max: z.number().optional(),
        step: z.number().optional(),
        showInput: z.boolean().optional(),
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
        z.number().optional(),
        z.union([z.number(), versionedData, z.undefined()]),
      ),
      strict: schemas(z.number(), z.union([z.number(), versionedData])),
    }
  }

  static deserialize(data: DeserializedRecord): SliderDefinition {
    if (data.type !== Definition.type) {
      throw new Error(
        `Slider: expected type ${Definition.type}, got ${data.type}`,
      )
    }

    const { version, config } =
      Definition.schema().relaxed.definition.parse(data)
    return new SliderDefinition(config, version)
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
        { [ControlDataTypeKey]: P.union(...AcceptedNumberDataTypes) },
        ({ value }) => value,
      )
      .otherwise((val) => val)
  }

  toData(value: ValueType<C>): DataType<C> {
    return match({ version: this.version, value })
      .with({ version: 1, value: P.number }, ({ value }) => ({
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

  resolveValueFromData(
    data: DataType<C> | undefined,
  ): ResolvedValueType<C> | undefined {
    return this.fromData(data) ?? this.config.defaultValue
  }

  resolveValue(
    data: DataType<C> | undefined,
  ): Resolvable<ResolvedValueType<C> | undefined> {
    return {
      name: Definition.type,
      readStable: () => this.resolveValueFromData(data),
      subscribe: () => () => {},
      triggerResolve: async () => {},
    }
  }

  createInstance(args: ControlInstanceArgs) {
    return new DefaultControlInstance(args)
  }

  accept<R>(visitor: ControlDefinitionVisitor<R>, ...args: unknown[]): R {
    return visitor.visitSlider(this, ...args)
  }
}

export class SliderDefinition<
  C extends Config = Config,
> extends Definition<C> {}

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

export function Slider<
  D extends Config['defaultValue'],
  P extends AnyContextValue = never,
>(config?: UserConfig<D, P>): SliderDefinition<NormedConfig<D, P>> {
  return new SliderDefinition((config ?? {}) as NormedConfig<D, P>, 1)
}

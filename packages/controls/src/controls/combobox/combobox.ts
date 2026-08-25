import { z } from 'zod'

import { safeParse, type ParseResult } from '../../lib/zod'

import { Schema, type Data } from '../../common'
import { type CopyContext } from '../../context'
import { type DeserializedRecord } from '../../serialization'

import {
  ContextValueSchema,
  type AnyContextValue,
  type ContextParam,
  type ContextValueDependencies,
  type DependsOnConfig,
  type ProvidesConfig,
} from '../context-value'
import {
  ControlDefinition,
  type Resolvable,
  type SchemaType,
} from '../definition'
import { DefaultControlInstance, type ControlInstanceArgs } from '../instance'
import { ControlDefinitionVisitor } from '../visitor'

type Option<T extends Data> = { id: string; value: T; label: string }
type GetOptionsType<T extends Data, D extends ContextValueDependencies> = (
  query: string,
  ...context: ContextParam<D>
) => Option<T>[] | Promise<Option<T>[]>

type Config<
  T extends Data = Data,
  D extends ContextValueDependencies = {},
  P extends AnyContextValue = AnyContextValue,
> = ProvidesConfig<P> &
  DependsOnConfig<D> & {
    label?: string
    description?: string
    getOptions: GetOptionsType<T, D>
  }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyConfig = Config<any, any, any>

type ItemType<C extends AnyConfig> =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  C extends Config<infer Item, any, any> ? Item : never
type DataType<C extends AnyConfig> = Option<ItemType<C>>
type ValueType<C extends AnyConfig> = DataType<C>
type ResolvedValueType<C extends AnyConfig> =
  | Option<ItemType<C>>['value']
  | undefined

class Definition<C extends AnyConfig> extends ControlDefinition<
  typeof Definition.type,
  C,
  DataType<C>,
  ValueType<C>,
  ResolvedValueType<C>
> {
  static readonly type = 'makeswift::controls::combobox' as const

  static schema<T extends Data>(item: SchemaType<T>) {
    const type = z.literal(Definition.type)

    const data = z.object({
      id: z.string(),
      value: item,
      label: z.string(),
    }) as SchemaType<Option<T>>

    const value = data
    const resolvedValue = item.optional()

    const options = z.array(data)

    const config = z.object({
      getOptions: z
        .function()
        .args(z.string(), ContextValueSchema.contextValues)
        .returns(z.union([options, z.promise(options)])),
      provides: ContextValueSchema.provides.optional(),
      dependsOn: ContextValueSchema.dependsOn.optional(),
      label: z.string().optional(),
      description: z.string().optional(),
    })

    const definition = z.object({
      type,
      config,
    })

    return {
      type,
      data,
      value,
      resolvedValue,
      config,
      definition,
    }
  }

  static deserialize(data: DeserializedRecord): ComboboxDefinition {
    if (data.type !== Definition.type) {
      throw new Error(
        `Combobox: expected type ${Definition.type}, got ${data.type}`,
      )
    }

    const { config } = Definition.schema(Schema.data).definition.parse(data)

    return Combobox(config as Config)
  }

  get controlType() {
    return Definition.type
  }

  get schema() {
    return Definition.schema(Schema.data as SchemaType<ItemType<C>>)
  }

  safeParse(data: unknown | undefined): ParseResult<DataType<C> | undefined> {
    return safeParse(this.schema.data, data)
  }

  fromData(data: DataType<C> | undefined): ValueType<C> | undefined {
    return data
  }

  toData(value: ValueType<C>): DataType<C> {
    return value
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
    return this.fromData(data)?.value
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
    return visitor.visitCombobox(this, ...args)
  }
}

export class ComboboxDefinition<
  C extends AnyConfig = Config,
> extends Definition<C> {}

type NormedConfig<
  T extends Data,
  D extends ContextValueDependencies,
  P extends AnyContextValue,
  GetOptions extends GetOptionsType<T, D>,
> = Config<T, D, P> & {
  getOptions: GetOptions
}

export function Combobox<
  T extends Data,
  D extends ContextValueDependencies = {},
  P extends AnyContextValue = never,
  GetOptions extends GetOptionsType<T, D> = GetOptionsType<T, D>,
>(
  config: Config<T, D, P> & { getOptions: GetOptions },
): ComboboxDefinition<NormedConfig<T, D, P, GetOptions>> {
  return new ComboboxDefinition(config)
}

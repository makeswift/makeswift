import { z } from 'zod'

import { map } from '../../lib/functional'
import { safeParse, unionOfLiterals, type ParseResult } from '../../lib/zod'

import { type CopyContext } from '../../context'
import {
  type DeserializedRecord,
  type SerializedRecord,
} from '../../serialization'

import { ControlDefinition, serialize, type SchemaType } from '../definition'
import { DefaultControlInstance, type SendMessage } from '../instance'

type Option<T extends string> = { readonly value: T; readonly label: string }
type OptionList<T extends string> = readonly [Option<T>, ...Option<T>[]]

type Config<T extends string = string> = {
  readonly options: OptionList<T>
  readonly defaultValue?: T
  readonly label?: string
  readonly labelOrientation?: 'horizontal' | 'vertical'
}

type ItemType<C extends Config> = C extends Config<infer Item> ? Item : never
type DataType<C extends Config> = undefined extends C['defaultValue']
  ? ItemType<C> | undefined
  : ItemType<C>

type ValueType<C extends Config> = DataType<C>
type ResolvedValueType<C extends Config> = ValueType<C>

class Definition<C extends Config> extends ControlDefinition<
  typeof Definition.type,
  C,
  DataType<C>,
  ValueType<C>,
  ResolvedValueType<C>
> {
  static readonly type = 'makeswift::controls::select' as const

  static schema<T, D, V>(
    item: SchemaType<T>,
    data: SchemaType<D>,
    defaultValue: SchemaType<V>,
  ) {
    const type = z.literal(Definition.type)

    const value = data
    const resolvedValue = value

    const config = z.object({
      options: z.array(z.object({ value: item, label: z.string() })).nonempty(),
      defaultValue,
      label: z.string().optional(),
      labelOrientation: z
        .union([z.literal('horizontal'), z.literal('vertical')])
        .optional(),
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

  static deserialize(data: DeserializedRecord): SelectDefinition {
    if (data.type !== Definition.type) {
      throw new Error(
        `Select: expected type ${Definition.type}, got ${data.type}`,
      )
    }

    const { config: configSchema } = Definition.schema(
      z.string(),
      z.string().optional(),
      z.string().optional(),
    )

    const def = z.object({
      type: z.literal(Definition.type),
      config: configSchema,
    })

    const { config } = def.parse(data)

    return new SelectDefinition(config as Config)
  }

  get controlType() {
    return Definition.type
  }

  get schema() {
    return Definition.schema(
      this.itemSchema,
      this.dataSchema.optional() as SchemaType<DataType<C>>,
      this.itemSchema.optional(),
    )
  }

  get itemSchema(): SchemaType<ItemType<C>> {
    return unionOfLiterals(
      map(this.config.options, ({ value }) => value as ItemType<C>),
    )
  }

  get dataSchema(): SchemaType<DataType<C>> {
    const item = this.itemSchema
    return (
      this.config.defaultValue === undefined ? item.optional() : item
    ) as SchemaType<DataType<C>>
  }

  safeParse(data: unknown | undefined): ParseResult<DataType<C> | undefined> {
    return safeParse(this.dataSchema, data)
  }

  fromData(data: DataType<C> | undefined): ValueType<C> | undefined {
    return this.dataSchema.optional().parse(data)
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

  createInstance(sendMessage: SendMessage) {
    return new DefaultControlInstance(sendMessage)
  }

  serialize(): [SerializedRecord, Transferable[]] {
    return serialize(this.config, {
      type: Definition.type,
    })
  }
}

export class SelectDefinition<
  C extends Config = Config,
> extends Definition<C> {}

type UserConfig<
  T extends string,
  D extends Config<T>['defaultValue'],
> = Config<T> & {
  defaultValue?: D
}

type NormedConfig<
  T extends string,
  D extends Config<T>['defaultValue'],
> = Config<T> &
  (undefined extends D
    ? {
        readonly defaultValue?: T
      }
    : { readonly defaultValue: T })

export function Select<
  const T extends string,
  D extends Config<T>['defaultValue'],
>(
  config: UserConfig<T, D> & { readonly options: OptionList<T> },
): SelectDefinition<NormedConfig<T, D>> {
  return new SelectDefinition(config as NormedConfig<T, D>)
}

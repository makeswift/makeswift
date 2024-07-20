import { z } from 'zod'
import { CopyContext } from '../context'

import { ResourceResolver, ValueSubscription } from '../resource-resolver'

import { Effector } from '../effector'

import {
  DefaultControlInstance,
  ControlInstance,
  SendMessage,
} from '../control-instance'

import {
  ControlDefinition,
  safeParse,
  serialize,
  type ParseResult,
  type SerializedRecord,
  type SchemaType,
} from '../control-definition'

import { map } from '../utils/functional'
import { unionOfLiterals } from '../utils/zod'

type Option<T extends string> = { value: T; label: string }
type OptionList<T extends string> = [Option<T>, ...Option<T>[]]

type Config<Item extends string = string> = {
  options: OptionList<Item>
  defaultValue?: Item
  label?: string
  labelOrientation?: 'horizontal' | 'vertical'
}

type ItemType<C extends Config> = C extends Config<infer Item> ? Item : never
type DataType<C extends Config> = undefined extends C['defaultValue']
  ? ItemType<C> | undefined
  : ItemType<C>

type ValueType<C extends Config> = DataType<C>
type ResolvedValueType<C extends Config> = ValueType<C>

class Definition<
  Item extends string = string,
  C extends Config<Item> = Config<Item>,
> extends ControlDefinition<
  typeof Definition.type,
  C,
  DataType<C>,
  ValueType<C>,
  ResolvedValueType<C>
> {
  static readonly type = 'makeswift::controls::select' as const

  static schema<T, D>(item: z.ZodType<T>, data: z.ZodType<D>) {
    const type = z.literal(Definition.type)

    const value = data
    const resolvedValue = value

    const config = z.object({
      options: z.array(z.object({ value: item, label: z.string() })).nonempty(),
      defaultValue: item.optional(),
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

  constructor(readonly config: C) {
    super(config)
  }

  static deserialize(data: SerializedRecord): Definition {
    if (data.type !== Definition.type) {
      throw new Error(
        `Select: expected type ${Definition.type}, got ${data.type}`,
      )
    }

    const { config: configSchema } = Definition.schema(
      z.string(),
      z.string().optional(),
    )
    const def = z.object({
      type: z.literal(Definition.type),
      config: configSchema,
    })

    const { config } = def.parse(data)

    return new Definition(config)
  }

  get controlType() {
    return Definition.type
  }

  get schema() {
    const item = unionOfLiterals(
      map(this.config.options, ({ value }) => value as ItemType<C>),
    )

    return Definition.schema(
      item as SchemaType<ItemType<C>>,
      (this.config.defaultValue === undefined
        ? item.optional()
        : item) as SchemaType<DataType<C>>,
    )
  }

  safeParse(data: unknown | undefined): ParseResult<DataType<C> | undefined> {
    return safeParse(this.schema.data, data)
  }

  fromData(data: DataType<C> | undefined): ValueType<C> | undefined {
    return this.schema.data.optional().parse(data)
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

  resolveValue(
    data: DataType<C> | undefined,
    _resolver: ResourceResolver,
    _effector: Effector,
  ): ValueSubscription<ResolvedValueType<C> | undefined> {
    return {
      readStableValue: (_previous?: ResolvedValueType<C>) => {
        return (
          this.fromData(data) ??
          (this.config.defaultValue as ResolvedValueType<C>)
        )
      },
      subscribe: () => () => {},
    }
  }

  createInstance(sendMessage: SendMessage<any>): ControlInstance<any> {
    return new DefaultControlInstance(sendMessage)
  }

  serialize(): [SerializedRecord, Transferable[]] {
    return serialize(this.config, {
      type: Definition.type,
    })
  }
}

type DerivedConfig<T extends string, C extends Config<T>> = Config<T> & {
  defaultValue: C['defaultValue']
}

export const Select = <const T extends string, C extends Config<T>>(
  config: C & { options: OptionList<T> },
) =>
  new (class Select extends Definition<T, DerivedConfig<T, C>> {})({
    ...config,
    defaultValue: config.defaultValue,
  })

export { Definition as SelectDefinition }

import { z } from 'zod'
import { CopyContext } from '../context'

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
  type SchemaType,
  type ParseResult,
  type SerializedRecord,
  type Resolvable,
} from '../control-definition'

import { type Data, Schema } from '../common'
import { deepEqual } from '../utils/functional'

type Option<T extends Data> = { id: string; value: T; label: string }

type Config<T extends Data = Data> = {
  label?: string
  getOptions(query: string): Option<T>[] | Promise<Option<T>[]>
}

type ItemType<C extends Config> = C extends Config<infer Item> ? Item : never
type DataType<C extends Config> = Option<ItemType<C>>
type ValueType<C extends Config> = DataType<C>
type ResolvedValueType<C extends Config> =
  | Option<ItemType<C>>['value']
  | undefined

class Definition<
  Item extends Data = Data,
  C extends Config<Item> = Config<Item>,
> extends ControlDefinition<
  typeof Definition.type,
  C,
  DataType<C>,
  ValueType<C>,
  ResolvedValueType<C>
> {
  static readonly type = 'makeswift::controls::combobox' as const

  static schema<T extends Data>(item: z.ZodType<T>) {
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
        .args(z.string())
        .returns(z.union([options, z.promise(options)])),
      label: z.string().optional(),
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
        `Combobox: expected type ${Definition.type}, got ${data.type}`,
      )
    }

    const { config } = Definition.schema(Schema.data).definition.parse(data)

    return new Definition(config)
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
  ): Resolvable<ResolvedValueType<C> | undefined> {
    return {
      readStableValue: (previous?: ResolvedValueType<C>) => {
        const r = this.fromData(data)?.value
        return deepEqual(r, previous) ? previous : r
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
    })
  }
}

type DerivedConfig<T extends Data, C extends Config<T>> = Config<T> & {
  getOptions: C['getOptions']
}

export const Combobox = <T extends Data, C extends Config<T>>(
  config: C & { getOptions(query: string): Option<T>[] | Promise<Option<T>[]> },
) =>
  new (class Combobox extends Definition<T, DerivedConfig<T, C>> {})({
    ...config,
    getOptions: config.getOptions,
  })

export { Definition as ComboboxDefinition }

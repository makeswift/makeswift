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
  type Schema,
  type ParseResult,
  type SerializedRecord,
} from '../control-definition'
import { Data, dataSchema } from '../common'

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

  static get schema() {
    const type = z.literal(Definition.type)

    const data = z
      .object({
        id: z.string(),
        value: dataSchema,
        label: z.string(),
      })
      .transform(({ id, value, label }) => ({
        value,
        label,
        id,
      }))

    const value = data
    const resolvedValue = dataSchema

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

    const config = Definition.schema.config.parse(data)

    return new Definition(config)
  }

  get controlType() {
    return Definition.type
  }

  get schema() {
    // FIXME: @arvin casts for schemas
    const data = Definition.schema.data.optional() as Schema<
      DataType<C> | undefined
    >

    const value = Definition.schema.value as unknown as Schema<ValueType<C>>

    const resolvedValue = Definition.schema.resolvedValue as unknown as Schema<
      ResolvedValueType<C>
    >

    return {
      ...Definition.schema,
      data,
      value,
      resolvedValue,
    }
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
        return this.fromData(data)?.value
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

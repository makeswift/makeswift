import { z } from 'zod'

import { safeParse, type ParseResult } from '../../lib/zod'

import { Schema, type Data } from '../../common'
import { type CopyContext } from '../../context'
import {
  type DeserializedRecord,
  type SerializedRecord,
} from '../../serialization'

import {
  ControlDefinition,
  serialize,
  type Resolvable,
  type SchemaType,
} from '../definition'
import { DefaultControlInstance, type SendMessage } from '../instance'

type Option<T extends Data> = { id: string; value: T; label: string }
type GetOptionsType<T extends Data> = (
  query: string,
) => Option<T>[] | Promise<Option<T>[]>

type Config<T extends Data = Data> = {
  label?: string
  getOptions: GetOptionsType<T>
}

type ItemType<C extends Config> = C extends Config<infer Item> ? Item : never
type DataType<C extends Config> = Option<ItemType<C>>
type ValueType<C extends Config> = DataType<C>
type ResolvedValueType<C extends Config> =
  | Option<ItemType<C>>['value']
  | undefined

class Definition<C extends Config> extends ControlDefinition<
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

  static deserialize(data: DeserializedRecord): ComboboxDefinition {
    if (data.type !== Definition.type) {
      throw new Error(
        `Combobox: expected type ${Definition.type}, got ${data.type}`,
      )
    }

    const { config } = Definition.schema(Schema.data).definition.parse(data)

    return Combobox(config)
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

  resolveValue(
    data: DataType<C> | undefined,
  ): Resolvable<ResolvedValueType<C> | undefined> {
    return {
      readStableValue: (_previous?: ResolvedValueType<C>) => {
        return this.fromData(data)?.value
      },
      subscribe: () => () => {},
    }
  }

  createInstance(sendMessage: SendMessage<any>) {
    return new DefaultControlInstance(sendMessage)
  }

  serialize(): [SerializedRecord, Transferable[]] {
    return serialize(this.config, {
      type: Definition.type,
    })
  }
}

export class ComboboxDefinition<
  C extends Config = Config,
> extends Definition<C> {}

type NormedConfig<
  T extends Data,
  GetOptions extends GetOptionsType<T>,
> = Config<T> & {
  getOptions: GetOptions
}

export function Combobox<T extends Data, GetOptions extends GetOptionsType<T>>(
  config: Config<T> & { getOptions: GetOptions },
): ComboboxDefinition<NormedConfig<T, GetOptions>> {
  return new ComboboxDefinition(config)
}

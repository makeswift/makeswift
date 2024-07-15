import { z } from 'zod'
import { CopyContext } from '../context'

import { ResourceResolver, ValueSubscription } from '../resource-resolver'

import {
  DefaultControlInstance,
  ControlInstance,
  SendMessage,
} from '../control-instance'

import {
  ControlDefinition,
  safeParse,
  serialize,
  ParseResult,
  SerializedRecord,
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

type DataType<C extends Config> = C['options'][number]['value']
type ValueType<C extends Config> = C['options'][number]['value']
type ResolvedValueType<C extends Config> = C['options'][number]['value']

class Definition<C extends Config = Config> extends ControlDefinition<
  typeof Definition.type,
  C,
  DataType<C>,
  ValueType<C>,
  ResolvedValueType<C>
> {
  static readonly type = 'makeswift::controls::select' as const

  static schema<T, U>(
    item: z.ZodType<T>,
    values: z.ZodType<U>,
    relaxed: boolean = true,
  ) {
    const type = z.literal(Definition.type)

    const data = relaxed ? values.optional() : values
    const value = values
    const resolvedValue = relaxed ? values.optional() : values

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
      z.array(z.string()).nonempty(),
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
    const values = unionOfLiterals(
      map(this.config.options, ({ value }) => value),
    )
    return Definition.schema(
      z.literal(this.config.options[0].value),
      values,
      this.config.defaultValue === undefined,
    )
  }

  safeParse(data: unknown | undefined): ParseResult<DataType<C> | undefined> {
    return safeParse(this.schema.data, data)
  }

  fromData(data: DataType<C> | undefined): ValueType<C> | undefined {
    return this.schema.data.optional().parse(data) ?? this.config.defaultValue
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
    value: ValueType<C> | undefined,
    _resolver: ResourceResolver,
  ): ValueSubscription<ResolvedValueType<C> | undefined> {
    return {
      readStableValue: (_previous?: ResolvedValueType<C>) => {
        return value ?? this.config.defaultValue
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

export const Select = <T extends string, C extends Config<T>>(
  config: C & { options: OptionList<T> },
) => new (class Select extends Definition<C> {})(config)

export { Definition as SelectDefinition }

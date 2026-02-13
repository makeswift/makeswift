import { match } from 'ts-pattern'
import { z } from 'zod'

import { safeParse, type ParseResult } from '../../lib/zod'

import { ControlDataTypeKey } from '../../common'
import { type CopyContext } from '../../context'
import { type DeserializedRecord } from '../../serialization'

import { ControlDefinition, type Resolvable } from '../definition'
import { DefaultControlInstance, type SendMessage } from '../instance'
import { ControlDefinitionVisitor } from '../visitor'

// Selected range (the two handles)
const rangeValue = z.object({
  start: z.number(),
  end: z.number(),
})

type RangeValue = z.infer<typeof rangeValue>

type Config = z.infer<typeof Definition.schema.config>

class Definition<C extends Config> extends ControlDefinition<
  typeof Definition.type,
  C,
  DataType,
  ValueType,
  ResolvedValueType
> {
  private static readonly v1SingleDataType = 'slider::v1::single' as const
  private static readonly v1RangeDataType = 'slider::v1::range' as const
  private static readonly dataSignature = {
    v1Single: { [ControlDataTypeKey]: this.v1SingleDataType },
    v1Range: { [ControlDataTypeKey]: this.v1RangeDataType },
  } as const

  static readonly type = 'makeswift::controls::slider' as const

  static get schema() {
    const type = z.literal(this.type)
    const version = z.literal(1).optional()

    // Versioned data for single value
    const v1SingleData = z.object({
      [ControlDataTypeKey]: z.literal(this.v1SingleDataType),
      value: z.number(),
    })

    // Versioned data for range value
    const v1RangeData = z.object({
      [ControlDataTypeKey]: z.literal(this.v1RangeDataType),
      value: rangeValue,
    })

    const config = z.object({
      label: z.string().optional(),
      description: z.string().optional(),
      defaultValue: z.union([z.number(), rangeValue]).optional(),
      min: z.number().optional(),
      max: z.number().optional(),
      step: z.number().optional(),
      range: z.boolean().optional(),
    })

    const definition = z.object({
      type,
      config,
      version,
    })

    const value = z.union([z.number(), rangeValue]).optional()
    const data = z.union([
      z.number(),
      rangeValue,
      v1SingleData,
      v1RangeData,
      z.undefined(),
    ])

    return {
      type,
      config,
      definition,
      value,
      resolvedValue: value,
      data,
      version,
      v1SingleData,
      v1RangeData,
    }
  }

  static deserialize(data: DeserializedRecord): SliderDefinition {
    if (data.type !== Definition.type) {
      throw new Error(
        `Slider: expected type ${Definition.type}, got ${data.type}`,
      )
    }

    const { version, config } = Definition.schema.definition.parse(data)
    return new SliderDefinition(config, version)
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

  get schema() {
    return {
      type: Definition.schema.type,
      definition: Definition.schema.definition,
      data: Definition.schema.data,
      value: Definition.schema.value,
      resolvedValue: Definition.schema.resolvedValue,
    }
  }

  get dataSchema() {
    const isRange = this.config.range === true

    if (isRange) {
      // Range mode: only accept range values
      return z.union([rangeValue, Definition.schema.v1RangeData, z.undefined()])
    }
    // Single value mode: only accept numbers
    return z.union([z.number(), Definition.schema.v1SingleData, z.undefined()])
  }

  safeParse(data: unknown | undefined): ParseResult<DataType | undefined> {
    return safeParse(this.dataSchema, data)
  }

  fromData(data: DataType | undefined): ValueType | undefined {
    return match(data)
      .with(Definition.dataSignature.v1Single, ({ value }) => value)
      .with(Definition.dataSignature.v1Range, ({ value }) => value)
      .otherwise((unversioned) => {
        if (unversioned === undefined) return undefined
        const isRange = this.config.range === true
        if (isRange) {
          const parsed = rangeValue.safeParse(unversioned)
          return parsed.success ? (parsed.data as ValueType) : undefined
        }
        return typeof unversioned === 'number' ? unversioned : undefined
      }) as ValueType | undefined
  }

  toData(value: ValueType): DataType {
    if (value === undefined) {
      return undefined as DataType
    }

    const isRange = this.config.range === true

    return match(this.version)
      .with(1, () =>
        isRange
          ? {
              ...Definition.dataSignature.v1Range,
              value: value as RangeValue,
            }
          : {
              ...Definition.dataSignature.v1Single,
              value: value as number,
            },
      )
      .with(undefined, () => value)
      .exhaustive() as DataType
  }

  copyData(
    data: DataType | undefined,
    _context: CopyContext,
  ): DataType | undefined {
    return data
  }

  resolveValue(
    data: DataType | undefined,
  ): Resolvable<ResolvedValueType | undefined> {
    return {
      name: Definition.type,
      readStable: () =>
        (this.fromData(data) ?? this.config.defaultValue) as
          | ResolvedValueType
          | undefined,
      subscribe: () => () => {},
      triggerResolve: async () => {},
    }
  }

  createInstance(sendMessage: SendMessage<any>) {
    return new DefaultControlInstance(sendMessage)
  }

  accept<R>(visitor: ControlDefinitionVisitor<R>, ...args: unknown[]): R {
    return visitor.visitSlider(this, ...args)
  }
}

type DataType = z.infer<typeof Definition.schema.data>
type ValueType = z.infer<typeof Definition.schema.value>
type ResolvedValueType = z.infer<typeof Definition.schema.resolvedValue>

export class SliderDefinition<
  C extends Config = Config,
> extends Definition<C> {}

type SingleConfig = {
  label?: string
  description?: string
  defaultValue?: number
  min?: number
  max?: number
  step?: number
  range?: false
}

type RangeConfig = {
  label?: string
  description?: string
  defaultValue?: RangeValue
  min?: number
  max?: number
  step?: number
  range: true
}

export function Slider(config?: SingleConfig): SliderDefinition<SingleConfig>
export function Slider(config: RangeConfig): SliderDefinition<RangeConfig>
export function Slider(
  config?: SingleConfig | RangeConfig,
): SliderDefinition<Config> {
  return new SliderDefinition((config ?? {}) as Config, 1)
}

export type { RangeValue as SliderRangeValue }

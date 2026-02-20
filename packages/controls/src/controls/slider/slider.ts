import { match } from 'ts-pattern'
import { z } from 'zod'

import { safeParse, type ParseResult } from '../../lib/zod'

import { ControlDataTypeKey } from '../../common'
import { type CopyContext } from '../../context'
import { type DeserializedRecord } from '../../serialization'

import { ControlDefinition, type Resolvable } from '../definition'
import { DefaultControlInstance, type SendMessage } from '../instance'
import { ControlDefinitionVisitor } from '../visitor'

type Config = z.infer<typeof Definition.schema.config>

class Definition<C extends Config> extends ControlDefinition<
  typeof Definition.type,
  C,
  DataType,
  ValueType,
  ResolvedValueType
> {
  private static readonly v1DataType = 'slider::v1' as const
  private static readonly dataSignature = {
    v1: { [ControlDataTypeKey]: this.v1DataType },
  } as const

  static readonly type = 'makeswift::controls::slider' as const

  static get schema() {
    const type = z.literal(this.type)
    const version = z.literal(1).optional()

    const v1Data = z.object({
      [ControlDataTypeKey]: z.literal(this.v1DataType),
      value: z.number(),
    })

    const config = z.object({
      label: z.string().optional(),
      description: z.string().optional(),
      defaultValue: z.number().optional(),
      min: z.number().optional(),
      max: z.number().optional(),
      step: z.number().optional(),
      showNumber: z.boolean().optional(),
    })

    const definition = z.object({
      type,
      config,
      version,
    })

    const value = z.number().optional()
    const data = z.union([z.number(), v1Data, z.undefined()])

    return {
      type,
      config,
      definition,
      value,
      resolvedValue: value,
      data,
      version,
      v1Data,
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
    return z.union([z.number(), Definition.schema.v1Data, z.undefined()])
  }

  safeParse(data: unknown | undefined): ParseResult<DataType | undefined> {
    return safeParse(this.dataSchema, data)
  }

  fromData(data: DataType | undefined): ValueType | undefined {
    return match(data)
      .with(Definition.dataSignature.v1, ({ value }) => value)
      .otherwise((unversioned) => {
        if (unversioned === undefined) return undefined
        return typeof unversioned === 'number' ? unversioned : undefined
      }) as ValueType | undefined
  }

  toData(value: ValueType): DataType {
    if (value === undefined) {
      return undefined as DataType
    }

    return match(this.version)
      .with(1, () => ({
        ...Definition.dataSignature.v1,
        value: value as number,
      }))
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

type SliderConfig = {
  label?: string
  description?: string
  defaultValue?: number
  min?: number
  max?: number
  step?: number
  showNumber?: boolean
}

export function Slider(config?: SliderConfig): SliderDefinition<SliderConfig> {
  return new SliderDefinition((config ?? {}) as Config, 1)
}

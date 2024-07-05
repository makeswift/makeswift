import { match } from 'ts-pattern'
import { z } from 'zod'

import {
  ControlDataTypeKey,
  type ValueType as _ValueType,
  type CopyContext,
} from '../common'
import { type ResourceResolver } from '../resource-resolver'
import { controlTraitsRegistry } from '../registry'

import {
  type VersionedControlDefinition,
  type ControlTraits,
  type ParseResult,
  type ValueSubscription,
} from '../traits'

import {
  DefaultControlInstance,
  ControlInstance,
  type Send,
} from '../control-instance'

import { ControlDefinition, serializeConfig } from '../control-definition'
import { WithAssociatedTypes } from '../utils/associated-types'

export const Checkbox = controlTraitsRegistry.add(
  (() => {
    const type = 'makeswift::controls::checkbox' as const
    const v1DataType = 'checkbox::v1' as const
    const version = 1 as const

    const dataSignature = {
      v1: { [ControlDataTypeKey]: v1DataType },
    } as const

    const dataSchema = z.union([
      z.boolean(),
      z.object({
        [ControlDataTypeKey]: z.literal(v1DataType),
        value: z.boolean(),
      }),
    ])

    const configSchema = z.object({
      label: z.string().optional(),
      defaultValue: z.boolean().optional(),
    })

    type ControlData = z.infer<typeof dataSchema>
    type Config = z.infer<typeof configSchema>

    type ControlDefinition<C extends Config = Config> =
      VersionedControlDefinition<
        typeof type,
        C,
        undefined extends C['defaultValue'] ? boolean | undefined : boolean,
        typeof version
      >

    const ctor = <C extends Config>(config?: C): ControlDefinition<C> => ({
      type,
      config: config ?? ({} as C),
      version,
    })

    ctor.controlType = type
    ctor.dataSignature = dataSignature

    ctor.safeParse = (
      data: unknown | undefined,
    ): ParseResult<ControlData | undefined> => {
      const result = dataSchema.optional().safeParse(data)
      return result.success
        ? { success: true, data: result.data }
        : { success: false, error: result.error.flatten().formErrors[0] }
    }

    ctor.fromData = (
      data: ControlData | undefined,
      definition: ControlDefinition,
    ) => {
      return match(data)
        .with(dataSignature.v1, ({ value }) => value)
        .otherwise((value) => value ?? definition?.config?.defaultValue)
    }

    ctor.toData = (
      value: boolean,
      definition: ControlDefinition,
    ): ControlData => {
      return match('version' in definition ? definition.version : undefined)
        .with(version, () => ({
          ...dataSignature.v1,
          value,
        }))
        .with(undefined, () => value)
        .exhaustive()
    }

    ctor.resolveValue = (
      value: _ValueType<ControlDefinition>,
      _resolver: ResourceResolver,
      definition: ControlDefinition,
    ): Promise<boolean | undefined> => {
      return Promise.resolve(ctor.fromData(value, definition))
    }

    ctor.subscribeValue = (
      value: _ValueType<ControlDefinition>,
      definition: ControlDefinition,
      _resolver: ResourceResolver,
    ): ValueSubscription<boolean | undefined> => {
      return {
        readValue() {
          if (value === undefined) return definition.config.defaultValue
          return ctor.fromData(value, definition)
        },
        subscribe() {
          return () => {}
        },
      }
    }

    ctor.createInstance = (send: Send) => new DefaultControlInstance(send)

    ctor.getSwatchIds = (_data: ControlData | undefined): string[] => []

    return ctor as typeof ctor &
      ControlTraits<typeof type, ControlData, ControlDefinition>
  })(),
)

type DataType = z.infer<typeof Definition.schema.data>
type Config = z.infer<typeof Definition.schema.config>

type ValueType<C extends Config> = undefined extends C['defaultValue']
  ? boolean | undefined
  : boolean

class Definition<C extends Config = Config> extends ControlDefinition<
  C,
  DataType,
  ValueType<C>
> {
  private static readonly v1DataType = 'checkbox::v1' as const
  private static readonly dataSignature = {
    v1: { [ControlDataTypeKey]: this.v1DataType },
  } as const

  static readonly type = 'makeswift::controls::checkbox' as const

  static get schema() {
    const value = z.boolean().optional()
    const data = z.union([
      value,
      z.object({
        [ControlDataTypeKey]: z.literal(this.v1DataType),
        value,
      }),
    ])

    const config = z.object({
      label: z.string().optional(),
      defaultValue: z.boolean().optional(),
    })

    const version = z.literal(1).optional()
    const definition = z.object({
      type: z.literal(this.type),
      config,
      version,
    })

    return { value, data, config, version, definition }
  }

  static deserialize(data: unknown): Definition {
    const { config, version } = this.schema.definition.parse(data)
    return new Definition(config, version)
  }

  constructor(
    readonly config: C,
    readonly version: z.infer<typeof Definition.schema.version> = 1,
  ) {
    super(config)
  }

  safeParse(data: unknown | undefined): ParseResult<DataType | undefined> {
    const result = Definition.schema.data.optional().safeParse(data)
    return result.success
      ? { success: true, data: result.data }
      : { success: false, error: result.error.flatten().formErrors[0] }
  }

  fromData(data: DataType | undefined): ValueType<C> | undefined {
    return match(data)
      .with(Definition.dataSignature.v1, ({ value }) => value)
      .otherwise((value) => value ?? this.config.defaultValue)
  }

  toData(value: ValueType<C>): DataType {
    return match(this.version)
      .with(1, () => ({
        ...Definition.dataSignature.v1,
        value,
      }))
      .with(undefined, () => value)
      .exhaustive()
  }

  copyData(
    data: DataType | undefined,
    _context: CopyContext,
  ): DataType | undefined {
    return data
  }

  resolveValue(
    _value: ValueType<C>,
    _resolver: ResourceResolver,
  ): Promise<void> {
    return Promise.resolve()
  }

  createInstance(send: Send): ControlInstance<unknown> {
    return new DefaultControlInstance(send)
  }

  serialize(): [unknown, Transferable[]] {
    const [config, transferables] = serializeConfig(this.config)
    return [
      {
        type: Definition.type,
        config,
        version: this.version,
      },
      transferables,
    ]
  }

  getSwatchIds(_data: DataType | undefined): string[] {
    return []
  }
}

export const CheckboxV2 = (() => {
  const ctor = <C extends Config>(config?: C): Definition<C> =>
    new Definition(config ?? ({} as C))

  ctor.controlType = Definition.type
  return ctor as typeof ctor &
    WithAssociatedTypes<{
      Definition: Definition
    }>
})()

import { match } from 'ts-pattern'
import { z } from 'zod'

import { ControlDataTypeKey, type Data, type ValueType } from '../common'
import { ResourceResolver } from '../resource-resolver'
import { controlTraitsRegistry } from '../registry'

import {
  type VersionedControlDefinition,
  type ControlTraits,
  type ParseResult,
} from '../traits'

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
        .otherwise((value) => value ?? definition.config.defaultValue)
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

    ctor.getSwatchIds = (_data: ControlData | undefined): string[] => []
    ctor.resolveValue = (
      value: ValueType<ControlDefinition>,
      _resolver: ResourceResolver,
    ): Promise<Data> => Promise.resolve(value)

    return ctor as typeof ctor &
      ControlTraits<typeof type, ControlData, ControlDefinition>
  })(),
)

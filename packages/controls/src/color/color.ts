import { match } from 'ts-pattern'
import { z } from 'zod'
import parseColor from 'color'

import {
  ControlDataTypeKey,
  colorDataSchema,
  type ColorData,
  type CopyContext,
  type ValueType,
  type Data,
} from '../common'
import { controlTraitsRegistry } from '../registry'
import { ResourceResolver } from '../resource-resolver'

import {
  type VersionedControlDefinition,
  type ControlTraits,
  type ParseResult,
} from '../traits'

export const Color = controlTraitsRegistry.add(
  (() => {
    const type = 'makeswift::controls::color' as const
    const v1DataType = 'color::v1' as const
    const version = 1 as const

    const dataSignature = {
      v1: { [ControlDataTypeKey]: v1DataType },
    } as const

    const dataSchema = z.union([
      colorDataSchema,
      colorDataSchema.and(
        z.object({
          [ControlDataTypeKey]: z.literal(v1DataType),
        }),
      ),
    ])

    const configSchema = z.object({
      label: z.string().optional(),
      labelOrientation: z
        .union([z.literal('horizontal'), z.literal('vertical')])
        .optional(),
      defaultValue: z.string().optional(),
      hideAlpha: z.boolean().optional(),
    })

    type ControlData = z.infer<typeof dataSchema>
    type Config = z.infer<typeof configSchema>

    type ControlDefinition<C extends Config = Config> =
      VersionedControlDefinition<typeof type, C, ColorData, typeof version>

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
      _definition: ControlDefinition,
    ) => {
      return match(data)
        .with(dataSignature.v1, ({ swatchId, alpha }) => ({ swatchId, alpha }))
        .otherwise((value) => value ?? null)
    }

    ctor.toData = (
      value: ColorData,
      definition: ControlDefinition,
    ): ControlData => {
      return match('version' in definition ? definition.version : undefined)
        .with(version, () => ({
          ...dataSignature.v1,
          ...value,
        }))
        .with(undefined, () => value)
        .exhaustive()
    }

    ctor.copyData = (
      data: ControlData | undefined,
      { replacementContext }: CopyContext,
    ): ControlData | undefined => {
      if (data == null) return data

      const replaceSwatchId = (swatchId: string) =>
        replacementContext.swatchIds.get(swatchId) ?? swatchId

      return match(data)
        .with(dataSignature.v1, (val) => ({
          ...val,
          swatchId: replaceSwatchId(val.swatchId),
        }))
        .otherwise((val) => ({
          ...val,
          swatchId: replaceSwatchId(val.swatchId),
        }))
    }

    ctor.getSwatchIds = (data: ControlData | undefined): string[] =>
      data?.swatchId == null ? [] : [data.swatchId]

    ctor.resolveValue = async (
      value: ValueType<ControlDefinition>,
      definition: ControlDefinition,
      resolver: ResourceResolver,
    ): Promise<Data> => {
      const { defaultValue } = definition.config
      const parsedDefaulValue =
        defaultValue === undefined
          ? undefined
          : safeParseColor(defaultValue).rgb().string()

      if (value == null) return parsedDefaulValue

      const { swatchId, alpha } = value
      const swatch = await resolver.fetchSwatch(swatchId)

      if (swatch == null) {
        return parsedDefaulValue
      }

      return parseColor({
        h: swatch.hue,
        s: swatch.saturation,
        l: swatch.lightness,
      })
        .alpha(alpha)
        .rgb()
        .string()
    }

    return ctor as typeof ctor &
      ControlTraits<typeof type, ControlData, ControlDefinition>
  })(),
)

function safeParseColor(value: string) {
  try {
    return parseColor(value)
  } catch {
    return parseColor()
  }
}

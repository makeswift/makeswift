import { match } from 'ts-pattern'
import { colorDataSchema } from '../data'
import {
  ControlDataTypeKey,
  CopyContext,
  ResolveOptions,
  Types,
  Schema,
} from '../prop-controllers'
import { z } from 'zod'
import {
  ContextResource,
  replaceResourceIfNeeded,
  shouldRemoveResource,
} from '@makeswift/controls'

const shadowDataSchema = z.object({
  color: colorDataSchema.nullable().optional(),
  blurRadius: z.number().optional(),
  spreadRadius: z.number().optional(),
  offsetX: z.number().optional(),
  offsetY: z.number().optional(),
  inset: z.boolean().optional(),
})

export type ShadowData = z.infer<typeof shadowDataSchema>

const shadowsDataSchema = z.array(
  z.object({
    id: z.string(),
    payload: shadowDataSchema,
  }),
)

export type ShadowsData = z.infer<typeof shadowsDataSchema>

const responsiveShadowsDataSchema = Schema.responsiveValue(shadowsDataSchema)

type ResponsiveShadowsData = z.infer<typeof responsiveShadowsDataSchema>

const shadowsPropControllerDataV0Schema = responsiveShadowsDataSchema

type ShadowsPropControllerDataV0 = z.infer<
  typeof shadowsPropControllerDataV0Schema
>

const ShadowsPropControllerDataV1Type = 'prop-controllers::shadows::v1'

const shadowsPropControllerDataV1Schema = z.object({
  [ControlDataTypeKey]: z.literal(ShadowsPropControllerDataV1Type),
  value: responsiveShadowsDataSchema,
})

export const shadowsPropControllerDataSchema = z.union([
  shadowsPropControllerDataV0Schema,
  shadowsPropControllerDataV1Schema,
])

export type ShadowsPropControllerData = z.infer<
  typeof shadowsPropControllerDataSchema
>

export const ShadowsPropControllerFormat = {
  ClassName: 'makeswift::prop-controllers::shadows::format::class-name',
  ResponsiveValue:
    'makeswift::prop-controllers::shadows::format::responsive-value',
} as const

export type ShadowsPropControllerFormat =
  (typeof ShadowsPropControllerFormat)[keyof typeof ShadowsPropControllerFormat]

type ShadowsOptions = { format?: ShadowsPropControllerFormat }

type ShadowsDescriptorV0<
  _T = ShadowsPropControllerDataV0,
  U extends ShadowsOptions = ShadowsOptions,
> = {
  type: typeof Types.Shadows
  options: U
}

type ShadowsDescriptorV1<
  _T = ShadowsPropControllerData,
  U extends ShadowsOptions = ShadowsOptions,
> = {
  type: typeof Types.Shadows
  version: 1
  options: U
}

export type ShadowsDescriptor<
  _T = ShadowsPropControllerData,
  U extends ShadowsOptions = ShadowsOptions,
> = ShadowsDescriptorV0<_T, U> | ShadowsDescriptorV1<_T, U>

export type ResolveShadowsPropControllerValue<T extends ShadowsDescriptor> =
  T extends ShadowsDescriptor
    ? undefined extends ResolveOptions<T['options']>['format']
      ? ResponsiveShadowsData | undefined
      : ResolveOptions<
            T['options']
          >['format'] extends typeof ShadowsPropControllerFormat.ClassName
        ? string
        : ResolveOptions<
              T['options']
            >['format'] extends typeof ShadowsPropControllerFormat.ResponsiveValue
          ? ResponsiveShadowsData | undefined
          : never
    : never

/**
 * @deprecated Imports from `@makeswift/prop-controllers` are deprecated. Use
 * `@makeswift/runtime/controls` instead.
 */
export function Shadows<T extends ShadowsOptions>(
  options: T & ShadowsOptions = {} as T,
): ShadowsDescriptor<ShadowsPropControllerData, T> {
  return { type: Types.Shadows, version: 1, options }
}

Shadows.Format = ShadowsPropControllerFormat

export function getShadowsPropControllerDataResponsiveShadowsData(
  data: ShadowsPropControllerData | null | undefined,
): ResponsiveShadowsData | null | undefined {
  return match(data)
    .with(
      { [ControlDataTypeKey]: ShadowsPropControllerDataV1Type },
      (v1) => v1.value,
    )
    .otherwise((v0) => v0)
}

export function createShadowsPropControllerDataFromResponsiveShadowsData(
  definition: ShadowsDescriptor,
  responsiveShadowsData: ResponsiveShadowsData,
): ShadowsPropControllerData {
  return match(definition)
    .with(
      { version: 1 },
      () =>
        ({
          [ControlDataTypeKey]: ShadowsPropControllerDataV1Type,
          value: responsiveShadowsData,
        }) as const,
    )
    .otherwise(() => responsiveShadowsData)
}

export function getShadowsPropControllerDataSwatchIds(
  data: ShadowsPropControllerData | null | undefined,
): string[] {
  return (
    getShadowsPropControllerDataResponsiveShadowsData(data)
      ?.flatMap((override) => override.value)
      .map((item) => item.payload.color?.swatchId)
      .filter(
        (swatchId): swatchId is NonNullable<typeof swatchId> =>
          swatchId != null,
      ) ?? []
  )
}

function copyResponsiveShadowsData(
  data: ResponsiveShadowsData,
  context: CopyContext,
): ResponsiveShadowsData {
  return data.map((override) => ({
    ...override,
    value: override.value.map((item) => {
      const { color } = item.payload

      if (color == null) return item

      if (
        shouldRemoveResource(ContextResource.Swatch, color.swatchId, context)
      ) {
        return { ...item, payload: { ...item.payload, color: undefined } }
      }

      return {
        ...item,
        payload: {
          ...item.payload,
          color: {
            ...color,
            swatchId: replaceResourceIfNeeded(
              ContextResource.Swatch,
              color.swatchId,
              context,
            ),
          },
        },
      }
    }),
  }))
}

export function copyShadowsPropControllerData(
  data: ShadowsPropControllerData | undefined,
  context: CopyContext,
): ShadowsPropControllerData | undefined {
  return match(data)
    .with(undefined, () => undefined)
    .with(
      { [ControlDataTypeKey]: ShadowsPropControllerDataV1Type },
      (v1) =>
        ({
          [ControlDataTypeKey]: ShadowsPropControllerDataV1Type,
          value: copyResponsiveShadowsData(v1.value, context),
        }) as const,
    )
    .otherwise((v0) => copyResponsiveShadowsData(v0, context))
}

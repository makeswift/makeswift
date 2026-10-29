import { match } from 'ts-pattern'
import {
  copyColorDataV2,
  ResourceSchema,
  toColorDataV1,
  toColorDataV2,
  type ColorDataV2,
} from '@makeswift/controls'
import {
  colorDataSchema,
  getColorDataV2SwatchIds,
  type ColorData,
} from '../data'
import {
  ControlDataTypeKey,
  CopyContext,
  ResolveOptions,
  Types,
  Schema,
} from '../prop-controllers'
import { z } from 'zod'

const shadowDataSchema = <C extends z.ZodTypeAny>(color: C) =>
  z.object({
    color: color.nullable().optional(),
    blurRadius: z.number().optional(),
    spreadRadius: z.number().optional(),
    offsetX: z.number().optional(),
    offsetY: z.number().optional(),
    inset: z.boolean().optional(),
  })

const shadowsDataSchema = <C extends z.ZodTypeAny>(color: C) =>
  z.array(
    z.object({
      id: z.string(),
      payload: shadowDataSchema(color),
    }),
  )

const responsiveShadowsDataSchema = <C extends z.ZodTypeAny>(color: C) =>
  Schema.responsiveValue(shadowsDataSchema(color))

type ResponsiveShadows<Color> = z.infer<
  ReturnType<typeof responsiveShadowsDataSchema<z.ZodType<Color>>>
>

type ResponsiveShadowsData = ResponsiveShadows<ColorDataV2>

type ResponsiveShadowsDataV1 = ResponsiveShadows<ColorData>

export type ShadowsData = ResponsiveShadowsData[number]['value']

export type ShadowData = ShadowsData[number]['payload']

const shadowsPropControllerDataV0Schema =
  responsiveShadowsDataSchema(colorDataSchema)

type ShadowsPropControllerDataV0 = z.infer<
  typeof shadowsPropControllerDataV0Schema
>

const ShadowsPropControllerDataV1Type = 'prop-controllers::shadows::v1'

const shadowsPropControllerDataV1Schema = z.object({
  [ControlDataTypeKey]: z.literal(ShadowsPropControllerDataV1Type),
  value: responsiveShadowsDataSchema(colorDataSchema),
})

/** v2 colors are either a swatch or an inline color */
const ShadowsPropControllerDataV2Type = 'prop-controllers::shadows::v2'

const shadowsPropControllerDataV2Schema = z.object({
  [ControlDataTypeKey]: z.literal(ShadowsPropControllerDataV2Type),
  value: responsiveShadowsDataSchema(ResourceSchema.colorDataV2),
})

export const shadowsPropControllerDataSchema = z.union([
  shadowsPropControllerDataV0Schema,
  shadowsPropControllerDataV1Schema,
  shadowsPropControllerDataV2Schema,
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

type ShadowsDescriptorV2<
  _T = ShadowsPropControllerData,
  U extends ShadowsOptions = ShadowsOptions,
> = {
  type: typeof Types.Shadows
  version: 2
  options: U
}

export type ShadowsDescriptor<
  _T = ShadowsPropControllerData,
  U extends ShadowsOptions = ShadowsOptions,
> =
  | ShadowsDescriptorV0<_T, U>
  | ShadowsDescriptorV1<_T, U>
  | ShadowsDescriptorV2<_T, U>

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
  return { type: Types.Shadows, version: 2, options }
}

Shadows.Format = ShadowsPropControllerFormat

function mapShadowColors<From, To>(
  data: ResponsiveShadows<From>,
  callback: (color: From) => To | undefined,
): ResponsiveShadows<To>
// zod's types can't be narrowed while `Color` is a type parameter
function mapShadowColors(
  data: ResponsiveShadows<unknown>,
  callback: (color: unknown) => unknown,
): ResponsiveShadows<unknown> {
  return data.map((override) => ({
    ...override,
    value: override.value.map((item) => ({
      ...item,
      payload: {
        ...item.payload,
        color: item.payload.color && callback(item.payload.color),
      },
    })),
  }))
}

const toResponsiveShadowsDataV2 = (
  data: ResponsiveShadowsDataV1,
): ResponsiveShadowsData =>
  mapShadowColors(data, (color) => toColorDataV2(color))

const toResponsiveShadowsDataV1 = (
  data: ResponsiveShadowsData,
): ResponsiveShadowsDataV1 =>
  mapShadowColors(data, (color) => toColorDataV1(color))

export function getShadowsPropControllerDataResponsiveShadowsData(
  data: ShadowsPropControllerData | null | undefined,
): ResponsiveShadowsData | null | undefined {
  return match(data)
    .with(
      { [ControlDataTypeKey]: ShadowsPropControllerDataV2Type },
      (v2) => v2.value,
    )
    .with({ [ControlDataTypeKey]: ShadowsPropControllerDataV1Type }, (v1) =>
      toResponsiveShadowsDataV2(v1.value),
    )
    .otherwise((v0) => v0 && toResponsiveShadowsDataV2(v0))
}

export function createShadowsPropControllerDataFromResponsiveShadowsData(
  definition: ShadowsDescriptor,
  responsiveShadowsData: ResponsiveShadowsData,
): ShadowsPropControllerData {
  return match(definition)
    .with(
      { version: 2 },
      () =>
        ({
          [ControlDataTypeKey]: ShadowsPropControllerDataV2Type,
          value: responsiveShadowsData,
        }) as const,
    )
    .with(
      { version: 1 },
      () =>
        ({
          [ControlDataTypeKey]: ShadowsPropControllerDataV1Type,
          value: toResponsiveShadowsDataV1(responsiveShadowsData),
        }) as const,
    )
    .otherwise(() => toResponsiveShadowsDataV1(responsiveShadowsData))
}

export function getShadowsPropControllerDataSwatchIds(
  data: ShadowsPropControllerData | null | undefined,
): string[] {
  return (
    getShadowsPropControllerDataResponsiveShadowsData(data)
      ?.flatMap((override) => override.value)
      .flatMap((item) => getColorDataV2SwatchIds(item.payload.color)) ?? []
  )
}

const copyResponsiveShadowsData = (
  data: ResponsiveShadowsData,
  context: CopyContext,
): ResponsiveShadowsData =>
  mapShadowColors(data, (color) => copyColorDataV2(color, context))

export function copyShadowsPropControllerData(
  data: ShadowsPropControllerData | undefined,
  context: CopyContext,
): ShadowsPropControllerData | undefined {
  const copy = (data: ResponsiveShadowsDataV1) =>
    toResponsiveShadowsDataV1(
      copyResponsiveShadowsData(toResponsiveShadowsDataV2(data), context),
    )

  return match(data)
    .with(undefined, () => undefined)
    .with({ [ControlDataTypeKey]: ShadowsPropControllerDataV2Type }, (v2) => ({
      ...v2,
      value: copyResponsiveShadowsData(v2.value, context),
    }))
    .with({ [ControlDataTypeKey]: ShadowsPropControllerDataV1Type }, (v1) => ({
      ...v1,
      value: copy(v1.value),
    }))
    .otherwise((v0) => copy(v0))
}

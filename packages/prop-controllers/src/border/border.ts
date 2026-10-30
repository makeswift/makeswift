import { match } from 'ts-pattern'
import {
  copyColorDataV2,
  ResourceSchema,
  StyleSchema,
  toColorDataV1,
  toColorDataV2,
  type ColorData,
  type ColorDataV2,
} from '@makeswift/controls'

import {
  ControlDataTypeKey,
  CopyContext,
  ResolveOptions,
  Types,
  Schema,
} from '../prop-controllers'
import { getColorDataV2SwatchIds } from '../data'

import { z } from 'zod'

const responsiveBorderDataSchema = <C extends z.ZodTypeAny>(color: C) =>
  Schema.responsiveValue(StyleSchema.borderSchema(color))

type ResponsiveBorder<Color> = z.infer<
  ReturnType<typeof responsiveBorderDataSchema<z.ZodType<Color>>>
>

type ResponsiveBorderDataV1 = ResponsiveBorder<ColorData>

export type ResponsiveBorderData = ResponsiveBorder<ColorDataV2>

const borderPropControllerDataV0Schema = responsiveBorderDataSchema(
  ResourceSchema.colorData,
)

export type BorderPropControllerDataV0 = z.infer<
  typeof borderPropControllerDataV0Schema
>

export const BorderPropControllerDataV1Type = 'prop-controllers::border::v1'

const borderPropControllerDataV1Schema = z.object({
  [ControlDataTypeKey]: z.literal(BorderPropControllerDataV1Type),
  value: responsiveBorderDataSchema(ResourceSchema.colorData),
})

export type BorderPropControllerDataV1 = z.infer<
  typeof borderPropControllerDataV1Schema
>

/** v2 colors are either a swatch or an inline color */
export const BorderPropControllerDataV2Type = 'prop-controllers::border::v2'

const borderPropControllerDataV2Schema = z.object({
  [ControlDataTypeKey]: z.literal(BorderPropControllerDataV2Type),
  value: responsiveBorderDataSchema(ResourceSchema.colorDataV2),
})

export type BorderPropControllerDataV2 = z.infer<
  typeof borderPropControllerDataV2Schema
>

export const borderPropControllerDataSchema = z.union([
  borderPropControllerDataV0Schema,
  borderPropControllerDataV1Schema,
  borderPropControllerDataV2Schema,
])

export type BorderPropControllerData = z.infer<
  typeof borderPropControllerDataSchema
>

export const BorderPropControllerFormat = {
  ClassName: 'makeswift::prop-controllers::border::format::class-name',
  ResponsiveValue:
    'makeswift::prop-controllers::border::format::responsive-value',
} as const

export type BorderPropControllerFormat =
  (typeof BorderPropControllerFormat)[keyof typeof BorderPropControllerFormat]

type BorderOptions = { format?: BorderPropControllerFormat }

type BorderDescriptorV0<
  _T = BorderPropControllerDataV0,
  U extends BorderOptions = BorderOptions,
> = {
  type: typeof Types.Border
  options: U
}

type BorderDescriptorV1<
  _T = BorderPropControllerData,
  U extends BorderOptions = BorderOptions,
> = {
  type: typeof Types.Border
  version: 1
  options: U
}

type BorderDescriptorV2<
  _T = BorderPropControllerData,
  U extends BorderOptions = BorderOptions,
> = {
  type: typeof Types.Border
  version: 2
  options: U
}

export type BorderDescriptor<
  _T = BorderPropControllerData,
  U extends BorderOptions = BorderOptions,
> =
  | BorderDescriptorV0<_T, U>
  | BorderDescriptorV1<_T, U>
  | BorderDescriptorV2<_T, U>

export type ResolveBorderPropControllerValue<T extends BorderDescriptor> =
  T extends BorderDescriptor
    ? undefined extends ResolveOptions<T['options']>['format']
      ? ResponsiveBorderData | undefined
      : ResolveOptions<
            T['options']
          >['format'] extends typeof BorderPropControllerFormat.ClassName
        ? string
        : ResolveOptions<
              T['options']
            >['format'] extends typeof BorderPropControllerFormat.ResponsiveValue
          ? ResponsiveBorderData | undefined
          : never
    : never

/**
 * @deprecated Imports from `@makeswift/prop-controllers` are deprecated. Use
 * `@makeswift/runtime/controls` instead.
 */
export function Border<T extends BorderOptions>(
  options: T & BorderOptions = {} as T,
): BorderDescriptor<BorderPropControllerData, T> {
  return { type: Types.Border, version: 2, options }
}

Border.Format = BorderPropControllerFormat

type BorderSides<Side> = {
  borderTop: Side | null | undefined
  borderRight: Side | null | undefined
  borderBottom: Side | null | undefined
  borderLeft: Side | null | undefined
}

function mapBorderSides<From, To>(
  { borderTop, borderRight, borderBottom, borderLeft }: BorderSides<From>,
  callback: (side: From) => To | undefined,
): BorderSides<To> {
  return {
    borderTop: borderTop && callback(borderTop),
    borderRight: borderRight && callback(borderRight),
    borderBottom: borderBottom && callback(borderBottom),
    borderLeft: borderLeft && callback(borderLeft),
  }
}

function toResponsiveBorderDataV2(
  data: ResponsiveBorderDataV1,
): ResponsiveBorderData {
  return data.map((override) => ({
    ...override,
    value: mapBorderSides(override.value, (side) => ({
      ...side,
      color: side.color && toColorDataV2(side.color),
    })),
  }))
}

function toResponsiveBorderDataV1(
  data: ResponsiveBorderData,
): ResponsiveBorderDataV1 {
  return data.map((override) => ({
    ...override,
    value: mapBorderSides(override.value, (side) => ({
      ...side,
      color: side.color && toColorDataV1(side.color),
    })),
  }))
}

export function getBorderPropControllerDataResponsiveBorderData(
  data: BorderPropControllerData | undefined,
): ResponsiveBorderData | undefined {
  return match(data)
    .with(undefined, () => undefined)
    .with(
      { [ControlDataTypeKey]: BorderPropControllerDataV2Type },
      (v2) => v2.value,
    )
    .with({ [ControlDataTypeKey]: BorderPropControllerDataV1Type }, (v1) =>
      toResponsiveBorderDataV2(v1.value),
    )
    .otherwise((v0) => toResponsiveBorderDataV2(v0))
}

export function createBorderPropControllerDataFromResponsiveBorderData(
  definition: BorderDescriptor,
  responsiveBorderData: ResponsiveBorderData,
): BorderPropControllerData {
  return match(definition)
    .with(
      { version: 2 },
      () =>
        ({
          [ControlDataTypeKey]: BorderPropControllerDataV2Type,
          value: responsiveBorderData,
        }) as const,
    )
    .with(
      { version: 1 },
      () =>
        ({
          [ControlDataTypeKey]: BorderPropControllerDataV1Type,
          value: toResponsiveBorderDataV1(responsiveBorderData),
        }) as const,
    )
    .otherwise(() => toResponsiveBorderDataV1(responsiveBorderData))
}

export function getBorderPropControllerDataSwatchIds(
  data: BorderPropControllerData | undefined,
): string[] {
  return getResponsiveBorderDataSwatchIds(
    getBorderPropControllerDataResponsiveBorderData(data),
  )
}

export function getResponsiveBorderDataSwatchIds(
  value: ResponsiveBorderData | undefined,
): string[] {
  return (
    value
      ?.flatMap((override) => override.value)
      .flatMap((borderValue) =>
        [
          borderValue.borderTop,
          borderValue.borderRight,
          borderValue.borderBottom,
          borderValue.borderLeft,
        ].flatMap((side) => getColorDataV2SwatchIds(side?.color)),
      ) ?? []
  )
}

function copyResponsiveBorderData(
  data: ResponsiveBorderData,
  context: CopyContext,
): ResponsiveBorderData {
  return data.map((override) => ({
    ...override,
    value: mapBorderSides(override.value, (side) => {
      if (side.color == null) return side

      const color = copyColorDataV2(side.color, context)
      return color == null ? undefined : { ...side, color }
    }),
  }))
}

export function copyBorderPropControllerData(
  data: BorderPropControllerData | undefined,
  context: CopyContext,
): BorderPropControllerData | undefined {
  const copy = (data: ResponsiveBorderDataV1) =>
    toResponsiveBorderDataV1(
      copyResponsiveBorderData(toResponsiveBorderDataV2(data), context),
    )

  return match(data)
    .with(undefined, () => undefined)
    .with({ [ControlDataTypeKey]: BorderPropControllerDataV2Type }, (v2) => ({
      ...v2,
      value: copyResponsiveBorderData(v2.value, context),
    }))
    .with({ [ControlDataTypeKey]: BorderPropControllerDataV1Type }, (v1) => ({
      ...v1,
      value: copy(v1.value),
    }))
    .otherwise((v0) => copy(v0))
}
